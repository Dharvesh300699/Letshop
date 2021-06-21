<template>
  <div class="rating">
    <span>
      <i class="star" :style="{ color: color }" :class="star1"></i>
      <i class="star" :style="{ color: color }" :class="star2"></i>
      <i class="star" :style="{ color: color }" :class="star3"></i>
      <i class="star" :style="{ color: color }" :class="star4"></i>
      <i class="star" :style="{ color: color }" :class="star5"></i>
    </span>
    <span>{{ text }}</span>
  </div>
</template>

<script>
import { computed, defineComponent } from "vue"
export default defineComponent({
  props: {
    value: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      default: "#ffdf6b",
    },
    text: {
      type: String,
    },
  },
  setup(props) {
    const star1 = computed(() =>
      props.value >= 1
        ? "fas fa-star"
        : props.value >= 0.5
        ? "fas fa-star-half-alt"
        : "far fa-star"
    )

    const star2 = computed(() =>
      props.value >= 2
        ? "fas fa-star"
        : props.value >= 1.5
        ? "fas fa-star-half-alt"
        : "far fa-star"
    )

    const star3 = computed(() =>
      props.value >= 3
        ? "fas fa-star"
        : props.value >= 2.5
        ? "fas fa-star-half-alt"
        : "far fa-star"
    )

    const star4 = computed(() =>
      props.value >= 4
        ? "fas fa-star"
        : props.value >= 3.5
        ? "fas fa-star-half-alt"
        : "far fa-star"
    )

    const star5 = computed(() =>
      props.value >= 5
        ? "fas fa-star"
        : props.value >= 4.5
        ? "fas fa-star-half-alt"
        : "far fa-star"
    )

    return { star1, star2, star3, star4, star5 }
  },
})
</script>

<style scoped>
.rating span {
  margin: 0.1rem;
  font-weight: 300;
}
</style>
