import { Commit } from "vuex"
import { State } from "../index"
import axios from "axios"
import { review } from "@/globalTypes"
import {
  PRODUCT_REVIEW_FAIL,
  PRODUCT_REVIEW_REQUEST,
  PRODUCT_REVIEW_RESET,
  PRODUCT_REVIEW_SUCCESS,
} from "../mutationTypes"

export interface productReview {
  loading: boolean
  success: boolean
  error: string | null
}

export default {
  state: <productReview>{
    loading: false,
    success: false,
    error: null,
  },
  mutations: {
    [PRODUCT_REVIEW_REQUEST](state: productReview): void {
      state.loading = true
    },
    [PRODUCT_REVIEW_SUCCESS](state: productReview): void {
      state.loading = false
      state.success = true
    },
    [PRODUCT_REVIEW_FAIL](
      state: productReview,
      payload: { error: string }
    ): void {
      state.loading = false
      state.error = payload.error
    },
    [PRODUCT_REVIEW_RESET](state: productReview): void {
      state.loading = false
      state.error = null
      state.success = false
    },
  },
  actions: {
    async createReview(
      { commit, rootState }: { commit: Commit; rootState: State },
      { id, review }: { id: string; review: review }
    ): Promise<void> {
      try {
        commit(PRODUCT_REVIEW_REQUEST)
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${rootState.userLogin.userInfo?.token}`,
          },
        }

        await axios.post(`/api/products/${id}/reviews`, review, config)
        commit(PRODUCT_REVIEW_SUCCESS)
      } catch (error) {
        commit(PRODUCT_REVIEW_FAIL, {
          error:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    },
  },
}
