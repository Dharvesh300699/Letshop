import { Commit } from "vuex"
import { State } from "../index"
import axios from "axios"
import {
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
} from "../mutationTypes"

export interface productDelete {
  loading: boolean
  success: boolean
  error: string | null
}

export default {
  state: <productDelete>{
    loading: false,
    success: false,
    error: null,
  },
  mutations: {
    [PRODUCT_DELETE_REQUEST](state: productDelete): void {
      state.loading = true
      state.success = false
    },
    [PRODUCT_DELETE_SUCCESS](state: productDelete): void {
      state.loading = false
      state.success = true
    },
    [PRODUCT_DELETE_FAIL](
      state: productDelete,
      payload: { error: string }
    ): void {
      state.loading = false
      state.error = payload.error
    },
  },
  actions: {
    async deleteProduct(
      { commit, rootState }: { commit: Commit; rootState: State },
      id: string
    ): Promise<void> {
      try {
        commit(PRODUCT_DELETE_REQUEST)
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${rootState.userLogin.userInfo?.token}`,
          },
        }
        await axios.delete(`/api/products/${id}`, config)
        commit(PRODUCT_DELETE_SUCCESS)
      } catch (error) {
        commit(PRODUCT_DELETE_FAIL, {
          error:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    },
  },
}
