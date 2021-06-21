<template>
  <div class="row">
    <div class="col-md-8">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <h2>Shipping</h2>
          <p>
            <strong>Address: </strong>
            {{ shippingAddress.address }}, {{ shippingAddress.city }},
            {{ shippingAddress.postalCode }}, {{ shippingAddress.country }}
          </p>
        </li>
        <li class="list-group-item">
          <h2>Order Items</h2>
          <Message v-if="cartItems.length === 0" message="Your cart is empty" />
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item"
              v-for="item in cartItems"
              :key="item._id"
            >
              <div class="row">
                <div class="col-md-3">
                  <img class="img-fluid" :src="item.image" :alt="item.name" />
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
              <div class="col">&#8377;{{ itemsPrice }}</div>
            </div>
          </li>
          <li class="list-group-item">
            <div class="row">
              <div class="col">Shipping</div>
              <div class="col">&#8377;{{ shippingPrice }}</div>
            </div>
          </li>
          <li class="list-group-item">
            <div class="row">
              <div class="col">Tax</div>
              <div class="col">&#8377;{{ taxPrice }}</div>
            </div>
          </li>
          <li class="list-group-item">
            <div class="row">
              <div class="col">Total</div>
              <div class="col">&#8377;{{ totalPrice }}</div>
            </div>
          </li>
          <li class="list-group-item">
            <Message v-if="error" variant="danger" :message="error" />
          </li>
          <li class="list-group-item">
            <button
              type="button"
              class="btn btn-second"
              :disabled="cartItems.length === 0"
              @click="placeOrderHandler"
            >
              Place Order
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, watchEffect } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "@/store"
import Message from "@/components/Message.vue"
export default defineComponent({
  components: { Message },
  setup() {
    const store = useStore(),
      router = useRouter()
    const { cartItems, shippingAddress } = toRefs(store.state.cart)
    const { order, success, error } = toRefs(store.state.orderCreate)

    const itemsPrice = cartItems.value.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      ),
      shippingPrice = itemsPrice < 2000 ? 200 : 0,
      taxPrice = Math.floor(0.15 * itemsPrice),
      totalPrice = itemsPrice + shippingPrice + taxPrice

    const placeOrderHandler = () => {
      store.dispatch("createOrder", {
        orderItems: cartItems.value,
        shippingAddress: shippingAddress.value,
        shippingPrice,
        taxPrice,
        itemsPrice,
        totalPrice,
      })
    }

    watchEffect(() => {
      if (success.value && order.value) {
        router.push({ name: "Order", params: { id: order.value._id! } })
      }
    })

    return {
      shippingAddress,
      cartItems,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      error,
      placeOrderHandler,
    }
  },
})
</script>
