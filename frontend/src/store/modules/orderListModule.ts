import { Commit } from "vuex"
import { State } from "../index"
import axios from "axios"
import { order } from "@/globalTypes"
import {
  ORDER_LIST_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
} from "../mutationTypes"

export interface orderList {
  orders: order[]
  loading: boolean
  error: string | null
}

export default {
  state: <orderList>{
    orders: [],
    loading: false,
    error: null,
  },
  mutations: {
    [ORDER_LIST_REQUEST](state: orderList): void {
      state.loading = true
    },
    [ORDER_LIST_SUCCESS](state: orderList, payload: order[]): void {
      state.orders = payload
      state.loading = false
    },
    [ORDER_LIST_FAIL](state: orderList, payload: { error: string }): void {
      state.loading = false
      state.error = payload.error
    },
  },
  actions: {
    async listOrders({
      commit,
      rootState,
    }: {
      commit: Commit
      rootState: State
    }): Promise<void> {
      try {
        commit(ORDER_LIST_REQUEST)
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${rootState.userLogin.userInfo?.token}`,
          },
        }

        const { data } = await axios.get("/api/orders", config)
        commit(ORDER_LIST_SUCCESS, data)
      } catch (error) {
        commit(ORDER_LIST_FAIL, {
          error:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    },
  },
}
