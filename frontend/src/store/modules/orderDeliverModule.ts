import { Commit } from "vuex"
import axios from "axios"
import { State } from "../index"
import {
  ORDER_DELIVER_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_RESET,
  ORDER_DELIVER_SUCCESS,
} from "../mutationTypes"

export interface orderDeliver {
  loading: boolean
  success: boolean
  error: string | null
}

export default {
  state: <orderDeliver>{
    loading: false,
    success: false,
    error: null,
  },
  mutations: {
    [ORDER_DELIVER_REQUEST](state: orderDeliver): void {
      state.loading = true
    },
    [ORDER_DELIVER_SUCCESS](state: orderDeliver): void {
      state.loading = false
      state.success = true
    },
    [ORDER_DELIVER_FAIL](
      state: orderDeliver,
      payload: { error: string }
    ): void {
      state.loading = false
      state.error = payload.error
    },
    [ORDER_DELIVER_RESET](state: orderDeliver): void {
      state.loading = false
      state.success = false
      state.error = null
    },
  },
  actions: {
    async deliverOrder(
      { commit, rootState }: { commit: Commit; rootState: State },
      id: string
    ): Promise<void> {
      try {
        commit(ORDER_DELIVER_REQUEST)
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${rootState.userLogin.userInfo?.token}`,
          },
        }

        await axios.put(`/api/orders/${id}/deliver`, {}, config)
        commit(ORDER_DELIVER_SUCCESS)
      } catch (error) {
        commit(ORDER_DELIVER_FAIL, {
          error:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    },
  },
}
