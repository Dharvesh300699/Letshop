import { Commit } from "vuex"
import axios from "axios"
import { product } from "@/globalTypes"
import {
  PRODUCT_TOP_FAIL,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
} from "../mutationTypes"

export interface productTop {
  products: product[]
  loading: boolean
  error: string | null
}

export default {
  state: <productTop>{
    products: [],
    loading: false,
    error: null,
  },
  mutations: {
    [PRODUCT_TOP_REQUEST](state: productTop): void {
      state.loading = true
    },
    [PRODUCT_TOP_SUCCESS](state: productTop, payload: product[]): void {
      state.loading = false
      state.products = payload
    },
    [PRODUCT_TOP_FAIL](state: productTop, payload: { error: string }): void {
      state.loading = false
      state.error = payload.error
    },
  },
  actions: {
    async listTopProducts({ commit }: { commit: Commit }): Promise<void> {
      try {
        commit(PRODUCT_TOP_REQUEST)
        const { data } = await axios.get("/api/products/top")
        commit(PRODUCT_TOP_SUCCESS, data)
      } catch (error) {
        commit(PRODUCT_TOP_FAIL, {
          error:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    },
  },
}
