import { Commit } from "vuex"
import axios from "axios"
import { State } from "../index"
import {
  ORDER_PAY_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_RESET,
  ORDER_PAY_SUCCESS,
} from "../mutationTypes"

import { successData } from "@/globalTypes"

export interface orderPay {
  loading: boolean
  success: boolean
  error: string | null
}

export default {
  state: <orderPay>{
    loading: false,
    success: false,
    error: null,
  },
  mutations: {
    [ORDER_PAY_REQUEST](state: orderPay): void {
      state.loading = true
    },
    [ORDER_PAY_SUCCESS](state: orderPay): void {
      state.loading = false
      state.success = true
    },
    [ORDER_PAY_FAIL](state: orderPay, payload: { error: string }): void {
      state.loading = false
      state.error = payload.error
    },
    [ORDER_PAY_RESET](state: orderPay): void {
      state.loading = false
      state.success = false
      state.error = null
    },
  },
  actions: {
    async payOrder(
      { commit, rootState }: { commit: Commit; rootState: State },
      { id, data }: { id: string; data: successData }
    ): Promise<void> {
      try {
        commit(ORDER_PAY_REQUEST)
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${rootState.userLogin.userInfo?.token}`,
          },
        }
        await axios.put(`/api/orders/${id}/pay`, data, config)
        commit(ORDER_PAY_SUCCESS)
      } catch (error) {
        commit(ORDER_PAY_FAIL, {
          error:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    },
  },
}
