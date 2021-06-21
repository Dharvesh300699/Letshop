<template>
  <Loader v-if="loading || loadingDelete" />
  <Message v-if="error" variant="danger" :message="error" />
  <Message v-if="errorDelete" variant="danger" :message="errorDelete" />
  <div class="row">
    <div class="col-xxl-10">
      <div class="row">
        <div class="col">
          <h1 class="my-3">Products</h1>
        </div>
        <div class="col text-end">
          <button
            @click="createProductHandler"
            type="button"
            class="btn btn-first my-3"
          >
            <i class="fas fa-plus"></i>
            Add Product
          </button>
        </div>
      </div>
    </div>
    <div class="table-responsive col-xxl-10 mx-auto">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th>CREATED AT</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product._id">
            <td>{{ product._id }}</td>
            <td>{{ product.name }}</td>
            <td>&#8377;{{ product.price }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.brand }}</td>
            <td>{{ product.createdAt.substring(0, 10) }}</td>
            <td>
              <router-link
                :to="{ name: 'UpdateProduct', params: { id: product._id } }"
              >
                <button class="btn">
                  <i class="fas fa-edit"></i>
                </button>
              </router-link>
              <button
                class="btn"
                @click="deleteHandler(product._id)"
                :disabled="loadingDelete"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, watch, watchEffect } from "vue"
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
    const { products, loading, error } = toRefs(store.state.productList)
    const {
      loading: loadingDelete,
      success: successDelete,
      error: errorDelete,
    } = toRefs(store.state.productDelete)

    const deleteHandler = (id: string) => {
      alert("Are you sure?")
      store.dispatch("deleteProduct", id)
    }

    const createProductHandler = () => {
      router.push({ name: "CreateProduct" })
    }

    watch(successDelete, () => {
      if (successDelete.value) {
        store.dispatch("listProducts")
      }
    })

    watchEffect(() => {
      if (userInfo.value && userInfo.value.user.isAdmin) {
        store.dispatch("listProducts")
      } else if (userInfo.value) {
        router.push({ name: "Home" })
      } else {
        router.push({ name: "Login" })
      }
    })

    return {
      loading,
      error,
      products,
      loadingDelete,
      errorDelete,
      deleteHandler,
      createProductHandler,
    }
  },
})
</script>
