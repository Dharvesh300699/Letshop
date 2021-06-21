<template>
  <router-link class="btn btn-first my-3" :to="{ name: 'Home' }"
    >Go Back</router-link
  >
  <Loader v-if="loading" />
  <Message v-if="error" variant="danger" :message="error" />
  <div class="row">
    <div class="col-md-6">
      <img class="img-fluid" :src="product.image" :alt="product.name" />
    </div>
    <div class="col-md-3">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <h3>{{ product.name }}</h3>
        </li>
        <li class="list-group-item">
          <Rating
            v-if="Object.keys(product).length"
            :value="product.rating"
            :text="review"
          />
        </li>
        <li class="list-group-item">Price: &#8377;{{ product.price }}</li>
        <li class="list-group-item">Description: {{ product.description }}</li>
      </ul>
    </div>
    <div class="col-md-3">
      <div class="card">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <div class="row">
              <div class="col">Price:</div>
              <div class="col">
                <h5>&#8377;{{ product.price }}</h5>
              </div>
            </div>
          </li>
          <li class="list-group-item">
            <div class="row">
              <div class="col">Status:</div>
              <div
                class="col fw-bold"
                :class="{
                  'text-success': product.countInStock > 0,
                  'text-danger': product.countInStock == 0,
                }"
              >
                {{ product.countInStock > 0 ? "In Stock" : "Out Of Stock" }}
              </div>
            </div>
          </li>
          <li class="list-group-item" v-if="product.countInStock > 0">
            <div class="row">
              <div class="col">Qty</div>
              <div class="col">
                <select
                  class="form-select"
                  aria-label="Default select example"
                  v-model="selected"
                >
                  <option
                    v-for="x in product.countInStock"
                    :key="x"
                    :value="x"
                    >{{ x }}</option
                  >
                </select>
              </div>
            </div>
          </li>
          <li class="list-group-item">
            <button
              class="btn btn-second"
              type="button"
              :disabled="product.countInStock === 0"
              @click="addToCartHandler"
            >
              ADD TO CART
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6">
      <h2>Reviews</h2>
      <Message
        v-if="product.reviews && product.reviews.length === 0"
        message="No Reviews"
      />
      <ul class="list-group list-group-flush">
        <li
          class="list-group-item"
          v-for="review in product.reviews"
          :key="review._id"
        >
          <strong>{{ review.name }}</strong>
          <Rating :value="review.rating" text="" />
          <p>{{ review.createdAt.substring(0, 10) }}</p>
          <p>{{ review.comment }}</p>
        </li>
        <li class="list-group-item">
          <h2>Write a Customer Review</h2>
          <Loader v-if="loadingReview" />
          <Message v-if="errorReview" variant="danger" :message="errorReview" />
          <form v-if="userInfo" @submit.prevent="reviewHandler">
            <div class="mb-3">
              <label for="rating" class="form-label">Rating</label>
              <select
                class="form-select"
                aria-label="Default select example"
                v-model="selectedRating"
              >
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="comment" class="form-label">Comment</label>
              <textarea
                class="form-control"
                id="comment"
                rows="2"
                v-model.trim="comment"
              ></textarea>
            </div>
            <button type="submit" class="btn btn-first">Submit</button>
          </form>
          <Message v-if="!userInfo" message="Sign in to write a review" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, toRefs, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useStore } from "@/store"
import Loader from "@/components/Loader.vue"
import Message from "@/components/Message.vue"
import Rating from "@/components/Rating.vue"
import { CART_ADD_ITEM, PRODUCT_REVIEW_RESET } from "@/store/mutationTypes"
export default defineComponent({
  components: { Loader, Message, Rating },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const selected = ref(1),
      selectedRating = ref(1),
      comment = ref("")

    const { product, loading, error } = toRefs(store.state.productDetails)
    const { userInfo } = toRefs(store.state.userLogin)
    const {
      loading: loadingReview,
      error: errorReview,
      success: successReview,
    } = toRefs(store.state.productReview)
    const review = computed(() => `${product.value.numReviews} reviews`)

    const addToCartHandler = () => {
      const { _id, name, image, price, countInStock } = product.value
      store.commit(CART_ADD_ITEM, {
        item: {
          _id,
          name,
          image,
          price,
          countInStock,
          qty: selected.value,
        },
      })

      router.push({ name: "Cart" })
    }

    const reviewHandler = () => {
      store.dispatch("createReview", {
        id: route.params.id,
        review: {
          rating: +selectedRating.value,
          comment: comment.value,
        },
      })
    }

    watch([successReview, errorReview], () => {
      if (successReview.value) {
        comment.value = ""
        selectedRating.value = 1
        store.commit(PRODUCT_REVIEW_RESET)
        store.dispatch("listProductDetails", route.params.id)
      }
    })

    onMounted(() => store.dispatch("listProductDetails", route.params.id))

    return {
      product,
      loading,
      error,
      selected,
      review,
      addToCartHandler,
      reviewHandler,
      comment,
      selectedRating,
      loadingReview,
      errorReview,
      userInfo,
    }
  },
})
</script>
