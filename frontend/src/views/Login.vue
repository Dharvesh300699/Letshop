<template>
  <div class="row py-3">
    <div class="col-12 col-sm-12 col-md-6 col-lg-4 mx-auto">
      <h1>Sign In</h1>
      <Message v-if="error" variant="danger" :message="error" />

      <Loader v-if="loading" />

      <form @submit.prevent="loginHandler">
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input
            type="text"
            class="form-control"
            id="email"
            autocomplete="off"
            v-model="email"
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            autocomplete="off"
            v-model="password"
          />
        </div>
        <button type="submit" class="btn btn-first">Sign In</button>
      </form>
      <div class="row py-3">
        <div class="col">
          New Customer?
          <router-link
            class="link"
            :to="{ name: 'Register', query: { redirect: redirect } }"
          >
            Register
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useStore } from "@/store"
import Message from "@/components/Message.vue"
import Loader from "@/components/Loader.vue"
export default defineComponent({
  components: { Message, Loader },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const email = ref("")
    const password = ref("")

    const { userInfo, loading, error } = toRefs(store.state.userLogin)

    const redirect = route.query.redirect ? route.query.redirect : "Home"

    const loginHandler = () => {
      store.dispatch("login", { email: email.value, password: password.value })
    }

    watchEffect(() => {
      if (userInfo.value) {
        router.push({ name: `${redirect}` })
      }
    })

    return { email, password, redirect, loading, error, loginHandler }
  },
})
</script>

<style scoped></style>
