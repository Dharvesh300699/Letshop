<template>
  <Loader v-if="loading || loadingDelete || loadingUpdate" />
  <Message v-if="error" variant="danger" :message="error" />
  <Message v-if="errorDelete" variant="danger" :message="errorDelete" />
  <Message v-if="errorUpdate" variant="danger" :message="errorUpdate" />
  <div class="row">
    <div class="table-responsive col-xxl-10 mx-auto">
      <h1 class="my-3">Users</h1>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>CREATED AT</th>
            <th>ADMIN</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td>{{ user._id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.createdAt.substring(0, 10) }}</td>
            <td>
              <span v-if="user.isAdmin">
                <i class="fas fa-check" style="color: green"></i>
              </span>
              <span v-if="!user.isAdmin">
                <i class="fas fa-times" style="color: red"></i>
              </span>
            </td>
            <td
              v-if="
                userInfo && user._id.toString() !== userInfo.user._id.toString()
              "
            >
              <button
                class="btn"
                @click="updateHandler(user._id)"
                :disabled="loadingUpdate"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="btn"
                @click="deleteHandler(user._id)"
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
    const { users, loading, error } = toRefs(store.state.userList)
    const { userInfo } = toRefs(store.state.userLogin)
    const {
      loading: loadingDelete,
      error: errorDelete,
      success: successDelete,
    } = toRefs(store.state.userDelete)
    const {
      loading: loadingUpdate,
      error: errorUpdate,
      success: successUpdate,
    } = toRefs(store.state.userUpdate)

    const deleteHandler = (id: string) => {
      alert("Are you sure?")
      store.dispatch("deleteUser", id)
    }

    const updateHandler = (id: string) => {
      store.dispatch("updateUser", id)
    }

    watch([successDelete, successUpdate], () => {
      if (successDelete.value) {
        store.dispatch("listUsers")
      }
      if (successUpdate.value) {
        store.dispatch("listUsers")
      }
    })

    watchEffect(() => {
      if (userInfo.value && userInfo.value.user.isAdmin) {
        store.dispatch("listUsers")
      } else if (userInfo.value) {
        router.push({ name: "Home" })
      } else {
        router.push({ name: "Login" })
      }
    })

    return {
      users,
      userInfo,
      loading,
      error,
      loadingDelete,
      loadingUpdate,
      errorDelete,
      errorUpdate,
      successDelete,
      successUpdate,
      deleteHandler,
      updateHandler,
    }
  },
})
</script>
