<template>
  <Loader v-if="loading || loadingDeliver" />
  <Message v-if="error" variant="danger" :message="error" />
  <div class="row">
    <div class="col-md-8">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <h2>Shipping</h2>
          <p>
            <strong>Order ID: {{ order._id }}</strong>
          </p>
          <p>
            <strong>Email: {{ userInfo && userInfo.user.email }}</strong>
          </p>
          <p>
            <strong
              >Address: {{ order.shippingAddress.address }},
              {{ order.shippingAddress.city }},
              {{ order.shippingAddress.postalCode }},
              {{ order.shippingAddress.country }}</strong
            >
          </p>
          <Message v-if="!order.isDelivered" message="Not Delivered" />
          <Message
            v-if="order.isDelivered"
            :message="deliverMessage"
            variant="success"
          />
        </li>
        <li class="list-group-item">
          <h2>Payment Status:</h2>
          <Message
            v-if="order.isPaid"
            variant="success"
            :message="paidMessage"
          />
          <Message v-if="!order.isPaid" message="Not Paid" variant="danger" />
        </li>
        <li class="list-group-item">
          <h2>Order Items</h2>
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item"
              v-for="item in order.orderItems"
              :key="item._id"
            >
              <div class="row">
                <div class="col-md-3">
                  <img :src="item.image" :alt="item.name" class="img-fluid" />
                </div>
                <div class="col-md-5">
                  <router-link
                    class="link"
                    :to="{ name: 'ProductDetails', params: { id: item._id } }"
                    >{{ item.name }}</router-link
                  >
                </div>
                <div class="col-md-4">
                  {{ item.qty }} x {{ item.price }} = &#8377;{{
                    item.qty * item.price
                  }}
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="col-md-4">
      <div class="card">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <h2>Order Summary</h2>
          </li>
          <li class="list-group-item">
            <div class="row">
              <div class="col">Items</div>
              <div class="col">&#8377;{{ order.itemsPrice }}</div>
            </div>
          </li>
          <li class="list-group-item">
            <div class="row">
              <div class="col">Shipping</div>
              <div class="col">&#8377;{{ order.shippingPrice }}</div>
            </div>
          </li>
          <li class="list-group-item">
            <div class="row">
              <div class="col">Tax</div>
              <div class="col">&#8377;{{ order.taxPrice }}</div>
            </div>
          </li>
          <li class="list-group-item">
            <div class="row">
              <div class="col">Total</div>
              <div class="col">&#8377;{{ order.totalPrice }}</div>
            </div>
          </li>
          <li v-if="!order.isPaid" class="list-group-item">
            <Message
              v-if="!sdkReady"
              variant="danger"
              message="Unable to proceed! Are you online?"
            />
            <Message v-if="localError" variant="danger" :message="localError" />
            <button
              type="button"
              class="btn btn-second"
              @click="paymentHandler"
            >
              Pay &#8377;{{ order.totalPrice }}
            </button>
          </li>
          <li
            class="list-group-item"
            v-if="
              userInfo &&
                userInfo.user.isAdmin &&
                !order.isDelivered &&
                order.isPaid
            "
          >
            <button
              type="button"
              class="btn btn-second"
              @click="deliverHandler"
            >
              Mark As Delivered
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  toRefs,
  watchEffect,
} from "vue"
import { useStore } from "@/store"
import { useRouter, useRoute } from "vue-router"
import axios from "axios"
import Loader from "@/components/Loader.vue"
import Message from "@/components/Message.vue"
import {
  ORDER_CREATE_RESET,
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from "@/store/mutationTypes"
export default defineComponent({
  components: { Message, Loader },
  setup() {
    const store = useStore(),
      router = useRouter(),
      route = useRoute(),
      localError = ref(""),
      sdkReady = ref(true),
      orderId = route.params.id

    const { userInfo } = toRefs(store.state.userLogin)
    const { order, loading, error } = toRefs(store.state.orderDetails)
    const { success: successPay } = toRefs(store.state.orderPay)
    const { success: successDeliver, loading: loadingDeliver } = toRefs(
      store.state.orderDeliver
    )

    const paidMessage = computed(
      () =>
        `Paid on ${order.value.paidAt && order.value.paidAt.substring(0, 10)}`
    )
    const deliverMessage = computed(
      () =>
        `Delivered on ${order.value.deliveredAt &&
          order.value.deliveredAt.substring(0, 10)}`
    )

    function getScript(src: string) {
      return new Promise((resolve) => {
        const script = document.createElement("script")
        script.type = "text/javascript"
        script.src = src
        script.className = "payment"
        script.onload = () => {
          resolve(true)
        }
        script.onerror = () => {
          resolve(false)
        }
        document.body.appendChild(script)
      })
    }

    const loadScript = async () => {
      const res = await getScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      )

      if (!res) {
        sdkReady.value = false
        return
      } else {
        sdkReady.value = true
      }
    }

    const paymentHandler = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.value?.token}`,
          },
        }
        const result = await axios.get(
          `/api/orders/${order.value._id}/razorOrder`,
          config
        )

        const { amount, id: order_id, currency } = result.data
        const KEY_ID = await axios.get("/api/config/razorPay")

        const options = {
          key: KEY_ID,
          amount: amount.toString(),
          currency: currency,
          name: "Proshop",
          description: "Thanks for shopping with us.",
          image:
            "https://res.cloudinary.com/dswp5qfpm/image/upload/v1623813881/ecommerce/shopping_rjxaee.png",
          order_id: order_id,
          handler: async function(response: any) {
            const successData = {
              orderCreationId: order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            }

            const { data } = await axios.post(
              "/api/orders/success",
              successData,
              config
            )
            store.dispatch("payOrder", {
              id: route.params.id,
              data,
            })
          },
          prefill: {
            name: userInfo.value?.user.name,
            email: userInfo.value?.user.email,
          },
        }

        const paymentObject = new (window as any).Razorpay(options)
        paymentObject.open()
      } catch (error) {
        localError.value =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
      }
    }

    const deliverHandler = () => {
      store.dispatch("deliverOrder", orderId)
    }

    watchEffect(() => {
      if (userInfo.value) {
        if (
          successPay.value ||
          !order.value.orderItems ||
          order.value._id !== orderId ||
          successDeliver.value
        ) {
          store.dispatch("orderDetails", orderId)
        }

        if (successPay.value) {
          store.commit(ORDER_PAY_RESET)
          store.commit(ORDER_CREATE_RESET)
        }
        if (successDeliver.value) {
          store.commit(ORDER_DELIVER_RESET)
        }
      } else {
        router.push({ name: "Login" })
      }
    })

    onMounted(() => {
      if (!document.querySelector(".payment")) {
        loadScript()
      }
    })

    return {
      order,
      loading,
      loadingDeliver,
      error,
      userInfo,
      paidMessage,
      deliverMessage,
      localError,
      sdkReady,
      paymentHandler,
      deliverHandler,
    }
  },
})
</script>
