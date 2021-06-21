<template>
  <Loader v-if="loading" />
  <Message v-if="error" :message="error" variant="danger" />
  <Carousel :autoplay="3000" :wrap-around="true" v-if="products.length">
    <Slide v-for="product in products" :key="product._id">
      <div class="carousel__item">
        <router-link
          :to="{ name: 'ProductDetails', params: { id: product._id } }"
        >
          <img class="img-fluid" :src="product.image" :alt="product.name" />
        </router-link>
      </div>
    </Slide>

    <template #addons>
      <Navigation />
      <Pagination />
    </template>
  </Carousel>
</template>

<script lang="ts">
import { defineComponent, toRefs, watchEffect } from "vue"
import { useStore } from "@/store"
import Loader from "@/components/Loader.vue"
import Message from "@/components/Message.vue"
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel"
import "vue3-carousel/dist/carousel.css"

export default defineComponent({
  components: { Loader, Message, Carousel, Slide, Pagination, Navigation },
  setup() {
    const store = useStore()
    const { products, loading, error } = toRefs(store.state.productTop)

    watchEffect(() => {
      store.dispatch("listTopProducts")
    })

    return { products, loading, error }
  },
})
</script>

<style>
.carousel button {
  background-color: #7952b3 !important;
}
</style>
