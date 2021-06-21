<template>
  <div class="row py-3">
    <div class="col-12 col-sm-12 col-md-6 col-lg-4 mx-auto">
      <h1>Register</h1>
      <Message v-if="error" variant="danger" :message="error" />
      <Message v-if="message" variant="danger" :message="message" />
      <Loader v-if="loading" />

      <form @submit.prevent="registerHandler">
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
          <label for="email" class="form-label">Email address</label>
          <input
            type="text"
            class="form-control"
            id="email"
            autocomplete="off"
            v-model.trim="email"
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            autocomplete="off"
            v-model.trim="password"
          />
        </div>
        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="confirmPassword"
            autocomplete="off"
            v-model.trim="confirmPassword"
          />
        </div>
        <button type="submit" class="btn btn-first">Register</button>
      </form>
      <div class="row py-3">
        <div class="col">
          Have an Account?
          <router-link
            class="link"
            :to="{ name: 'Login', query: { redirect: redirect } }"
          >
            Login
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
    const store = useStore(),
      route = useRoute(),
      router = useRouter()
    const email = ref(""),
      password = ref(""),
      name = ref(""),
      confirmPassword = ref(""),
      message = ref("")

    const { userInfo, loading, error } = toRefs(store.state.userRegister)
    const redirect = route.query.redirect ? route.query.redirect : "Home"

    const registerHandler = () => {
      if (
        !name.value ||
        !email.value ||
        !password.value ||
        !confirmPassword.value
      ) {
        message.value = "Fields can not be empty"
      } else if (password.value.includes(" ")) {
        message.value = "Password can not contain spaces"
      } else if (password.value.length < 6) {
        message.value = "Password must be atleast 6 characters"
      } else if (password.value !== confirmPassword.value) {
        message.value = "Passwords do not match"
      } else {
        message.value = ""
        store.dispatch("register", {
          name: name.value,
          email: email.value,
          password: password.value,
        })
      }
    }

    watchEffect(() => {
      if (userInfo.value) {
        router.push({ name: `${redirect}` })
      }
    })

    return {
      name,
      email,
      password,
      confirmPassword,
      redirect,
      loading,
      error,
      message,
      registerHandler,
    }
  },
})
</script>

<style scoped></style>
