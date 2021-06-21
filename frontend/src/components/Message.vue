<template>
  <div :class="alertVariant">
    {{ message }}
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
export default defineComponent({
  props: {
    message: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      default: "info",
    },
  },
  setup(props) {
    const alertVariant = computed(() => `alert alert-${props.variant}`)

    return { alertVariant }
  },
})
</script>
