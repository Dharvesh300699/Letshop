import { Commit } from "vuex"
import axios from "axios"
import { State } from "../index"
import { order } from "@/globalTypes"
import {
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
} from "../mutationTypes"

export interface orderDetails {
  order: order
  loading: boolean
  error: string | null
}

export default {
  state: <orderDetails>{
    order: { shippingAddress: {} },
    loading: false,
    error: null,
  },
  mutations: {
    [ORDER_DETAILS_REQUEST](state: orderDetails): void {
      state.loading = true
    },
    [ORDER_DETAILS_SUCCESS](state: orderDetails, payload: order): void {
      state.loading = false
      state.order = payload
    },
    [ORDER_DETAILS_FAIL](
      state: orderDetails,
      payload: { error: string }
    ): void {
      state.error = payload.error
      state.loading = false
    },
  },
  actions: {
    async orderDetails(
      { commit, rootState }: { commit: Commit; rootState: State },
      id: string
    ): Promise<void> {
      try {
        commit(ORDER_DETAILS_REQUEST)
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${rootState.userLogin.userInfo?.token}`,
          },
        }
        const { data } = await axios.get(`/api/orders/${id}`, config)
        commit(ORDER_DETAILS_SUCCESS, data)
      } catch (error) {
        commit(ORDER_DETAILS_FAIL, {
          error:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    },
  },
}
