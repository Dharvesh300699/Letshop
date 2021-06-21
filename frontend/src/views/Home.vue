<template>
  <ProductCarousel />
  <h1 class="mt-3">Latest Products</h1>
  <Loading v-if="loading" />
  <Message v-if="error" variant="danger" :message="error" />

  <div class="productList">
    <Product
      v-for="product in products"
      :key="product._id"
      :product="product"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs } from "vue"
import { useStore } from "@/store"
import Product from "@/components/Product.vue"
import Loading from "@/components/Loader.vue"
import Message from "@/components/Message.vue"
import ProductCarousel from "@/components/ProductCarousel.vue"
export default defineComponent({
  components: { Product, Loading, Message, ProductCarousel },
  setup() {
    const store = useStore()
    const { products, loading, error } = toRefs(store.state.productList)

    onMounted(() => {
      store.dispatch("listProducts")
    })

    return { products, loading, error }
  },
})
</script>

<style scoped>
.productList {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
