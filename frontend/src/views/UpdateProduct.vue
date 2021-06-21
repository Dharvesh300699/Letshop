<template>
  <div class="row py-3">
    <div class="col-12 col-sm-12 col-md-6 col-lg-4 mx-auto">
      <h1>Create Product</h1>
      <Message v-if="error" variant="danger" :message="error" />
      <Message v-if="errorUpdate" variant="danger" :message="errorUpdate" />
      <Message v-if="message" variant="danger" :message="message" />
      <Loader v-if="loading || loadingUpdate" />

      <form @submit.prevent="submitHandler">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input
            type="text"
            class="form-control"
            id="name"
            autocomplete="off"
            v-model.trim="name"
          />
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <input
            type="text"
            class="form-control"
            id="description"
            autocomplete="off"
            v-model.trim="description"
          />
        </div>
        <div class="mb-3">
          <label for="category" class="form-label">Category</label>
          <input
            type="text"
            class="form-control"
            id="category"
            autocomplete="off"
            v-model.trim="category"
          />
        </div>
        <div class="mb-3">
          <label for="brand" class="form-label">Brand</label>
          <input
            type="text"
            class="form-control"
            id="brand"
            autocomplete="off"
            v-model.trim="brand"
          />
        </div>
        <div class="mb-3">
          <label for="price" class="form-label">Price</label>
          <input
            type="number"
            class="form-control"
            id="price"
            autocomplete="off"
            v-model.number="price"
          />
        </div>
        <div class="mb-3">
          <label for="countInStock" class="form-label">Count In Stock</label>
          <input
            type="number"
            class="form-control"
            id="countInStock"
            autocomplete="off"
            v-model.number="countInStock"
          />
        </div>
        <div className="mb-3">
          <label for="image" class="form-label">
            Image
          </label>
          <input
            class="form-control"
            type="file"
            id="image"
            @change="imageFileHandler"
          />
        </div>
        <button type="submit" class="btn btn-first">Create</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch, watchEffect } from "vue"
import { useStore } from "@/store"
import { useRouter, useRoute } from "vue-router"
import Loader from "@/components/Loader.vue"
import Message from "@/components/Message.vue"
import { PRODUCT_UPDATE_RESET } from "@/store/mutationTypes"
export default defineComponent({
  components: { Loader, Message },
  setup() {
    const store = useStore(),
      router = useRouter(),
      route = useRoute()

    const name = ref(""),
      description = ref(""),
      category = ref(""),
      brand = ref(""),
      price = ref(0),
      countInStock = ref(0),
      message = ref(""),
      formData = new FormData()

    const productId = route.params.id

    const { userInfo } = toRefs(store.state.userLogin)
    const {
      loading: loadingUpdate,
      error: errorUpdate,
      success: successUpdate,
    } = toRefs(store.state.productUpdate)
    const { loading, error, product } = toRefs(store.state.productDetails)

    const submitHandler = () => {
      if (
        !name.value ||
        !description.value ||
        !category.value ||
        !brand.value
      ) {
        message.value = "Fields can not be empty!"
      } else {
        message.value = ""
        formData.append("name", name.value)
        formData.append("description", description.value)
        formData.append("category", category.value)
        formData.append("brand", brand.value)
        formData.append("price", price.value.toString())
        formData.append("countInStock", countInStock.value.toString())

        store.dispatch("updateProduct", {
          data: formData,
          id: productId,
        })
      }
    }

    const imageFileHandler = (e: any) => {
      formData.append("image", e.target.files[0])
    }

    watch([successUpdate, product], () => {
      if (successUpdate.value) {
        router.push({ name: "ProductList" })
        store.commit(PRODUCT_UPDATE_RESET)
      }
      if (Object.keys(product.value).length !== 0) {
        name.value = product.value.name
        description.value = product.value.description
        category.value = product.value.category
        brand.value = product.value.brand
        price.value = product.value.price
        countInStock.value = product.value.countInStock
      }
    })

    watchEffect(() => {
      if (!userInfo.value) {
        router.push({ name: "Login" })
      } else if (!userInfo.value.user.isAdmin) {
        router.push({ name: "Home" })
      } else {
        store.dispatch("listProductDetails", productId)
      }
    })

    return {
      name,
      description,
      category,
      brand,
      price,
      countInStock,
      imageFileHandler,
      submitHandler,
      loading,
      loadingUpdate,
      errorUpdate,
      error,
      message,
    }
  },
})
</script>
