import { Commit } from "vuex"
import { State } from "../index"
import axios from "axios"
import { order } from "@/globalTypes"
import {
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_RESET,
  ORDER_LIST_MY_SUCCESS,
} from "../mutationTypes"

export interface userOrdersList {
  orders: order[]
  loading: boolean
  error: string | null
}

export default {
  state: <userOrdersList>{
    orders: [],
    loading: false,
    error: null,
  },
  mutations: {
    [ORDER_LIST_MY_REQUEST](state: userOrdersList): void {
      state.loading = true
    },
    [ORDER_LIST_MY_SUCCESS](state: userOrdersList, payload: order[]): void {
      state.orders = payload
      state.loading = false
    },
    [ORDER_LIST_MY_FAIL](
      state: userOrdersList,
      payload: { error: string }
    ): void {
      state.loading = false
      state.error = payload.error
    },
    [ORDER_LIST_MY_RESET](state: userOrdersList): void {
      state.orders = []
      state.loading = false
      state.error = null
    },
  },
  actions: {
    async listUserOrders({
      commit,
      rootState,
    }: {
      commit: Commit
      rootState: State
    }): Promise<void> {
      try {
        commit(ORDER_LIST_MY_REQUEST)
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${rootState.userLogin.userInfo?.token}`,
          },
        }

        const { data } = await axios.get("/api/orders/myorders", config)
        commit(ORDER_LIST_MY_SUCCESS, data)
      } catch (error) {
        commit(ORDER_LIST_MY_FAIL, {
          error:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    },
  },
}
