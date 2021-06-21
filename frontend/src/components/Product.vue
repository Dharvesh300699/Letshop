<template>
  <div class="m-2 p-1 product">
    <router-link :to="{ name: 'ProductDetails', params: { id: product._id } }">
      <img :src="product.image" :alt="product.name" />
    </router-link>
    <router-link :to="{ name: 'ProductDetails', params: { id: product._id } }">
      <div>
        <strong>{{ product.name }}</strong>
      </div>
    </router-link>
    <div class="my-1">
      <Rating :value="product.rating" :text="review" />
    </div>
    <div class="fs-5 fw-normal">
      <p>&#8377;{{ product.price }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue"
import { product } from "@/globalTypes"
import Rating from "@/components/Rating.vue"
export default defineComponent({
  props: {
    product: {
      type: Object as PropType<product>,
      required: true,
    },
  },
  components: { Rating },
  setup(props) {
    const review = computed(() => `${props.product.numReviews} reviews`)

    return { review }
  },
})
</script>

<style scoped>
.product {
  background-color: #fff;
  max-width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product img {
  height: 200px;
  width: 100%;
  object-fit: cover;
}

.product a {
  text-decoration: none;
  color: var(--primary-color);
}

.product a:hover {
  text-decoration: underline;
}
</style>
