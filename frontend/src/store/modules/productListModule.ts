import { Commit } from "vuex"
import axios from "axios"
import { product } from "@/globalTypes"
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
} from "../mutationTypes"

export interface productList {
  products: product[]
  loading: boolean
  error: string | null
}

export default {
  state: <productList>{
    products: [],
    loading: false,
    error: null,
  },
  mutations: {
    [PRODUCT_LIST_REQUEST](state: productList): void {
      state.loading = true
    },
    [PRODUCT_LIST_SUCCESS](
      state: productList,
      payload: { products: product[] }
    ): void {
      state.loading = false
      state.products = payload.products
    },
    [PRODUCT_LIST_FAIL](state: productList, payload: { error: string }): void {
      state.loading = false
      state.error = payload.error
    },
  },
  actions: {
    async listProducts({ commit }: { commit: Commit }): Promise<void> {
      try {
        commit(PRODUCT_LIST_REQUEST)
        const { data } = await axios.get("/api/products")
        commit(PRODUCT_LIST_SUCCESS, { products: data })
      } catch (error) {
        commit(PRODUCT_LIST_FAIL, {
          error:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    },
  },
}
