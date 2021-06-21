<template>
  <div class="row">
    <h1 class="mt-3">Shopping Cart</h1>
    <div class="col-md-8">
      <router-link to="/" class="btn btn-first my-2">Go Back</router-link>
      <ul class="list-group list-group-flush">
        <li class="list-group-item" v-for="item in cartItems" :key="item._id">
          <div class="row">
            <div class="col-md-3">
              <img :src="item.image" :alt="item.name" class="img-fluid" />
            </div>
            <div class="col-md-3 product">
              <router-link
                :to="{ name: 'ProductDetails', params: { id: item._id } }"
                >{{ item.name }}</router-link
              >
            </div>
            <div class="col-md-2">&#8377;{{ item.price }}</div>
            <div class="col-md-3">
              <select
                class="form-select"
                aria-label="Default select example"
                :value="item.qty"
                @change="qtyChange($event.target.value, item)"
              >
                <option v-for="x in item.countInStock" :key="x" :value="x">{{
                  x
                }}</option>
              </select>
            </div>
            <div class="col-md-1">
              <button
                type="button"
                class="btn btn-light"
                @click="removeFromCart(item._id)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="col-md-4">
      <div class="card">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <h2>Subtotal ({{ totalItems }}) items</h2>
            &#8377; {{ totalPrice }}
          </li>
          <li class="list-group-item">
            <button
              type="button"
              class="btn btn-second"
              :disabled="cartItems.length === 0"
              @click="checkoutHandler"
            >
              Proceed To Checkout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "@/store"
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "@/store/mutationTypes"
import { cartItem } from "@/globalTypes"
export default defineComponent({
  setup() {
    const store = useStore()
    const router = useRouter()
    const { cartItems } = toRefs(store.state.cart)

    const totalItems = computed(() => {
      return cartItems.value.reduce((acc, item) => acc + item.qty, 0)
    })

    const totalPrice = computed(() => {
      return cartItems.value.reduce(
        (acc, item) => acc + item.qty * item.price,
        0
      )
    })

    const qtyChange = (qty: string, item: cartItem) => {
      store.commit(CART_ADD_ITEM, {
        item: { ...item, qty: +qty },
      })
    }

    const removeFromCart = (id: string) => {
      store.commit(CART_REMOVE_ITEM, { id: id })
    }

    const checkoutHandler = () => {
      router.push({ name: "Login", query: { redirect: "Shipping" } })
    }

    return {
      cartItems,
      totalItems,
      totalPrice,
      qtyChange,
      removeFromCart,
      checkoutHandler,
    }
  },
})
</script>

<style scoped>
.product a {
  text-decoration: none;
  color: var(--primary-color);
}

.product a:hover {
  text-decoration: underline;
}
</style>
