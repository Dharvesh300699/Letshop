import { Commit } from "vuex"
import axios from "axios"
import { State } from "../index"
import {
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_RESET,
  PRODUCT_UPDATE_SUCCESS,
} from "../mutationTypes"

export interface productUpdate {
  loading: boolean
  success: boolean
  error: string | null
}

export default {
  state: <productUpdate>{
    loading: false,
    success: false,
    error: null,
  },
  mutations: {
    [PRODUCT_UPDATE_REQUEST](state: productUpdate): void {
      state.loading = true
    },
    [PRODUCT_UPDATE_SUCCESS](state: productUpdate): void {
      state.loading = false
      state.success = true
    },
    [PRODUCT_UPDATE_FAIL](
      state: productUpdate,
      payload: { error: string }
    ): void {
      state.loading = false
      state.error = payload.error
    },
    [PRODUCT_UPDATE_RESET](state: productUpdate): void {
      state.success = false
      state.error = null
    },
  },
  actions: {
    async updateProduct(
      { commit, rootState }: { commit: Commit; rootState: State },
      { data, id }: { data: FormData; id: string }
    ): Promise<void> {
      try {
        commit(PRODUCT_UPDATE_REQUEST)
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${rootState.userLogin.userInfo?.token}`,
          },
        }
        await axios.put(`/api/products/${id}`, data, config)
        commit(PRODUCT_UPDATE_SUCCESS)
      } catch (error) {
        commit(PRODUCT_UPDATE_FAIL, {
          error:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    },
  },
}
