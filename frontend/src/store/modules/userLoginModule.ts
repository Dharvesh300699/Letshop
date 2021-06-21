import { Commit } from "vuex"
import axios from "axios"
import { user } from "@/globalTypes"

import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  PRODUCT_REVIEW_RESET,
  ORDER_PAY_RESET,
  ORDER_CREATE_RESET,
  ORDER_DELIVER_RESET,
} from "../mutationTypes"

interface userInfo {
  user: user
  token: string
}

let userInfo: userInfo | null
if (sessionStorage.getItem("userInfo")) {
  userInfo = JSON.parse(sessionStorage.getItem("userInfo")!)
} else {
  userInfo = null
}

export interface userLogin {
  userInfo: userInfo | null
  loading: boolean
  error: string | null
}

export default {
  state: <userLogin>{
    userInfo,
    loading: false,
    error: null,
  },
  mutations: {
    [USER_LOGIN_REQUEST](state: userLogin): void {
      state.loading = true
    },
    [USER_LOGIN_SUCCESS](state: userLogin, payload: userInfo): void {
      state.userInfo = payload
      state.loading = false
    },
    [USER_LOGIN_FAIL](state: userLogin, payload: { error: string }): void {
      state.loading = false
      state.error = payload.error
    },
    [USER_LOGOUT](state: userLogin): void {
      state.userInfo = null
    },
  },
  actions: {
    async login(
      { commit }: { commit: Commit },
      { email, password }: { email: string; password: string }
    ): Promise<void> {
      try {
        commit(USER_LOGIN_REQUEST)

        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        }
        const { data } = await axios.post(
          "/api/users/login",
          { email, password },
          config
        )
        commit(USER_LOGIN_SUCCESS, data)
        sessionStorage.setItem("userInfo", JSON.stringify(data))
      } catch (error) {
        commit(USER_LOGIN_FAIL, {
          error:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    },
    logout({ commit }: { commit: Commit }): void {
      if (sessionStorage.getItem("userInfo")) {
        sessionStorage.removeItem("userInfo")
      }
      if (sessionStorage.getItem("cartItems")) {
        sessionStorage.removeItem("cartItems")
      }
      if (sessionStorage.getItem("shippingAddress")) {
        sessionStorage.removeItem("shippingAddress")
      }
      commit(PRODUCT_REVIEW_RESET, null, { root: true })
      commit(ORDER_PAY_RESET, null, { root: true })
      commit(ORDER_CREATE_RESET, null, { root: true })
      commit(ORDER_DELIVER_RESET, null, { root: true })
      commit(USER_LOGOUT)
    },
  },
}
