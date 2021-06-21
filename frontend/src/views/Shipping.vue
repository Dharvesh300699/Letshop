<template>
  <div class="row py-3">
    <div class="col-12 col-sm-12 col-md-6 col-lg-4 mx-auto">
      <h1>Shipping</h1>
      <Message v-if="message" variant="danger" :message="message" />

      <form @submit.prevent="submitHandler">
        <div class="mb-3">
          <label for="address" class="form-label">Address</label>
          <input
            type="text"
            class="form-control"
            id="address"
            autocomplete="off"
            v-model.trim="address"
          />
        </div>
        <div class="mb-3">
          <label for="city" class="form-label">City</label>
          <input
            type="text"
            class="form-control"
            id="city"
            autocomplete="off"
            v-model.trim="city"
          />
        </div>
        <div class="mb-3">
          <label for="postalCode" class="form-label">Postal Code</label>
          <input
            type="text"
            class="form-control"
            id="postalCode"
            autocomplete="off"
            v-model.trim="postalCode"
          />
        </div>
        <div class="mb-3">
          <label for="country" class="form-label">Country</label>
          <input
            type="text"
            class="form-control"
            id="country"
            autocomplete="off"
            v-model.trim="country"
          />
        </div>
        <button type="submit" class="btn btn-first">Continue</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watchEffect } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "@/store"
import Message from "@/components/Message.vue"
import { SAVE_SHIPPING_ADDRESS } from "@/store/mutationTypes"
export default defineComponent({
  components: { Message },
  setup() {
    const store = useStore(),
      router = useRouter()

    const address = ref(""),
      city = ref(""),
      postalCode = ref(""),
      country = ref(""),
      message = ref("")

    const { userInfo } = toRefs(store.state.userLogin)

    const submitHandler = () => {
      if (
        !address.value ||
        !city.value ||
        !postalCode.value ||
        !country.value
      ) {
        message.value = "Fields can not be empty"
      } else {
        store.commit(SAVE_SHIPPING_ADDRESS, {
          address: address.value,
          city: city.value,
          postalCode: postalCode.value,
          country: country.value,
        })
        router.push({ name: "PlaceOrder" })
      }
    }

    watchEffect(() => {
      if (!userInfo.value) {
        router.push({ name: "Login", query: { redirect: "Shipping" } })
      }
    })

    return { address, city, postalCode, country, message, submitHandler }
  },
})
</script>
