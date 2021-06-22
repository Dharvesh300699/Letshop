<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-white">
      <div class="container">
        <router-link class="navbar-brand fw-bold fs-3 " :to="{ name: 'Home' }"
          >LetShop</router-link
        >
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link
                class="nav-link active fs-5"
                aria-current="page"
                :to="{ name: 'Cart' }"
                ><i class="fas fa-shopping-cart me-1"></i> Cart</router-link
              >
            </li>
            <li v-if="!userInfo" class="nav-item">
              <router-link class="nav-link fs-5" :to="{ name: 'Login' }"
                >Sign In</router-link
              >
            </li>
            <li v-if="userInfo" class="nav-item">
              <div class="dropdown mt-1 mx-md-2">
                <button
                  class="btn btn-first dropdown-toggle"
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {{ userInfo && userInfo.user.name }}
                </button>

                <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <li>
                    <router-link class="dropdown-item" :to="{ name: 'Profile' }"
                      >Profile</router-link
                    >
                  </li>
                  <li
                    class="dropdown-item"
                    style="cursor: pointer"
                    @click="logoutHandler"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </li>
            <li v-if="userInfo && userInfo.user.isAdmin" class="nav-item">
              <div className="dropdown mt-2 mt-sm-2 mt-md-2 mt-lg-1 mx-md-2">
                <button
                  className="btn btn-first dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Admin
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <router-link
                      class="dropdown-item"
                      :to="{ name: 'UserList' }"
                    >
                      Users
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      class="dropdown-item"
                      :to="{ name: 'ProductList' }"
                    >
                      Products
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      class="dropdown-item"
                      :to="{ name: 'OrderList' }"
                    >
                      Orders
                    </router-link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "@/store"
export default defineComponent({
  setup() {
    const store = useStore()
    const router = useRouter()
    const { userInfo } = toRefs(store.state.userLogin)

    const logoutHandler = () => {
      store.dispatch("logout")
      router.push({ name: "Home" })
    }

    return { userInfo, logoutHandler }
  },
})
</script>

<style scoped>
.dropdown-toggle:focus {
  box-shadow: none;
}

.navbar-toggler {
  border-color: #fff;
}

.navbar-toggler:focus {
  box-shadow: none;
}

header {
  box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.1);
}
</style>
