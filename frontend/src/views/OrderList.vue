<template>
  <div class="row">
    <div class="table-responsive col-xxl-10 mx-auto">
      <h1 class="my-3">Orders</h1>
      <Loader v-if="loading" />
      <Message v-if="error" variant="danger" :message="error" />
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>USER</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order._id">
            <td>{{ order._id }}</td>
            <td>{{ order.user.name }}</td>
            <td>{{ order.createdAt.substring(0, 10) }}</td>
            <td>&#8377;{{ order.totalPrice }}</td>
            <td>
              <span v-if="order.isPaid">
                {{ order.paidAt.substring(0, 10) }}
              </span>
              <span v-if="!order.isPaid">
                <i class="fas fa-times" style="color: red"></i>
              </span>
            </td>
            <td>
              <router-link :to="{ name: 'Order', params: { id: order._id } }">
                <button type="button" class="btn btn-first">
                  Details
                </button>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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

    const { orders, loading, error } = toRefs(store.state.orderList)
    const { userInfo } = toRefs(store.state.userLogin)

    watchEffect(() => {
      if (userInfo.value && userInfo.value.user.isAdmin) {
        store.dispatch("listOrders")
      } else if (userInfo.value) {
        router.push({ name: "Home" })
      } else {
        router.push({ name: "Login" })
      }
    })

    return { orders, loading, error }
  },
})
</script>
