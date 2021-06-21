import { Commit } from "vuex"
import { State } from "../index"
import axios from "axios"
import { order } from "@/globalTypes"
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  CART_RESET,
  ORDER_CREATE_RESET,
} from "../mutationTypes"

export interface orderCreate {
  order: order
  loading: boolean
  success: boolean
  error: string | null
}

export default {
  state: {
    order: {},
    loading: false,
    success: false,
    error: null,
  },
  mutations: {
    [ORDER_CREATE_REQUEST](state: orderCreate): void {
      state.loading = true
    },
    [ORDER_CREATE_SUCCESS](state: orderCreate, payload: order): void {
      state.order = payload
      state.loading = false
      state.success = true
    },
    [ORDER_CREATE_FAIL](state: orderCreate, payload: { error: string }): void {
      state.loading = false
      state.error = payload.error
    },
    [ORDER_CREATE_RESET](state: orderCreate): void {
      state.order = {} as order
      state.loading = false
      state.success = false
      state.error = null
    },
  },
  actions: {
    async createOrder(
      { commit, rootState }: { commit: Commit; rootState: State },
      order: order
    ): Promise<void> {
      try {
        commit(ORDER_CREATE_REQUEST)

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${rootState.userLogin.userInfo?.token}`,
          },
        }

        const { data } = await axios.post("/api/orders", order, config)
        commit(ORDER_CREATE_SUCCESS, data)
        commit(CART_RESET, null, { root: true })
      } catch (error) {
        commit(ORDER_CREATE_FAIL, {
          error:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    },
  },
}
