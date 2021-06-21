import { Commit } from "vuex"
import axios from "axios"
import { product } from "@/globalTypes"

import {
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
} from "../mutationTypes"

export interface productDetails {
  product: product
  loading: boolean
  error: string | null
}

export default {
  state: <productDetails>{
    product: {},
    loading: false,
    error: null,
  },
  mutations: {
    [PRODUCT_DETAILS_REQUEST](state: productDetails): void {
      state.loading = true
    },
    [PRODUCT_DETAILS_SUCCESS](
      state: productDetails,
      payload: { product: product }
    ): void {
      state.loading = false
      state.product = payload.product
    },
    [PRODUCT_DETAILS_FAIL](
      state: productDetails,
      payload: { error: string }
    ): void {
      state.loading = false
      state.error = payload.error
    },
  },
  actions: {
    async listProductDetails(
      { commit }: { commit: Commit },
      id: string
    ): Promise<void> {
      try {
        commit(PRODUCT_DETAILS_REQUEST)
        const { data } = await axios.get(`/api/products/${id}`)
        commit(PRODUCT_DETAILS_SUCCESS, { product: data })
      } catch (error) {
        commit(PRODUCT_DETAILS_FAIL, {
          error:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    },
  },
}
