<template>
  <Loader v-if="loading" />
  <Message v-if="error" variant="danger" :message="error" />
  <div class="row d-md-block d-none">
    <h1>My Orders</h1>
    <div class="col-xxl-9 mx-auto">
      <div class="table-responsive">
        <table class="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order._id">
              <td>{{ order._id }}</td>
              <td>{{ userInfo && userInfo.user.name }}</td>
              <td>{{ order.createdAt.substring(0, 10) }}</td>
              <td>&#8377;{{ order.totalPrice }}</td>
              <td>
                <span v-if="order.isPaid">{{
                  order.paidAt.substring(0, 10)
                }}</span>
                <span v-if="!order.isPaid"
                  ><i class="fas fa-times" style="color: red"></i
                ></span>
              </td>
              <td>
                <span v-if="order.isDelivered">{{
                  order.deliveredAt.substring(0, 10)
                }}</span>
                <span v-if="!order.isDelivered"
                  ><i class="fas fa-times" style="color: red"></i
                ></span>
              </td>
              <td>
                <router-link :to="{ name: 'Order', params: { id: order._id } }">
                  <button type="button" class="btn btn-first">Details</button>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="row d-md-none">
    <h1 class="my-3">My Orders</h1>
    <ul class="list-group list-group-flush">
      <li class="list-group-item" v-for="order in orders" :key="order._id">
        <p>
          <strong>Order ID: </strong>
          <router-link
            class="link"
            style="font-weight: bold"
            :to="{ name: 'Order', params: { id: order._id } }"
            >{{ order._id }}</router-link
          >
        </p>
        <p><strong>Date: </strong>{{ order.createdAt.substring(0, 10) }}</p>
        <p><strong>Total: </strong>&#8377;{{ order.totalPrice }}</p>
        <p>
          <strong>Paid: </strong
          ><span v-if="order.isPaid" style="color: green; font-weight: bold">{{
            order.paidAt.substring(0, 10)
          }}</span>
          <span v-if="!order.isPaid"
            ><i class="fas fa-times" style="color: red"></i
          ></span>
        </p>
        <p>
          <strong>Delivered: </strong
          ><span
            v-if="order.isDelivered"
            style="color: green; font-weight: bold"
            >{{ order.deliveredAt.substring(0, 10) }}</span
          >
          <span v-if="!order.isDelivered"
            ><i class="fas fa-times" style="color: red"></i
          ></span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, watchEffect } from "vue"
import { useStore } from "@/store"
import { useRouter } from "vue-router"
import Loader from "@/components/Loader.vue"
import Message from "@/components/Message.vue"
export default defineComponent({
  components: { Loader, Message },
  setup() {
    const store = useStore(),
      router = useRouter()

    const { userInfo } = toRefs(store.state.userLogin)
    const { loading, error, orders } = toRefs(store.state.userOrdersList)

    watchEffect(() => {
      if (!userInfo.value) {
        router.push({ name: "Login" })
      } else {
        store.dispatch("listUserOrders")
      }
    })

    return { loading, error, orders, userInfo }
  },
})
</script>
