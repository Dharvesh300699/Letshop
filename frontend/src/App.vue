<template>
  <div class="app">
    <Header />
    <main class="container py-3">
      <router-view></router-view>
    </main>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"
export default defineComponent({
  components: { Header, Footer },
})
</script>

<style scoped></style>
