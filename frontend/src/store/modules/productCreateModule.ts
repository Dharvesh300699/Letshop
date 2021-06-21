import { Commit } from "vuex"
import axios from "axios"
import { State } from "../index"
import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_RESET,
  ORDER_CREATE_SUCCESS,
} from "../mutationTypes"

export interface productCreate {
  loading: boolean
  success: boolean
  error: string | null
}

export default {
  state: <productCreate>{
    loading: false,
    success: false,
    error: null,
  },
  mutations: {
    [ORDER_CREATE_REQUEST](state: productCreate): void {
      state.loading = true
    },
    [ORDER_CREATE_SUCCESS](state: productCreate): void {
      state.loading = false
      state.success = true
    },
    [ORDER_CREATE_FAIL](
      state: productCreate,
      payload: { error: string }
    ): void {
      state.loading = false
      state.error = payload.error
    },
    [ORDER_CREATE_RESET](state: productCreate): void {
      state.success = false
      state.error = null
    },
  },
  actions: {
    async createProduct(
      { commit, rootState }: { commit: Commit; rootState: State },
      data: FormData
    ): Promise<void> {
      try {
        commit(ORDER_CREATE_REQUEST)
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${rootState.userLogin.userInfo?.token}`,
          },
        }
        await axios.post("/api/products", data, config)
        commit(ORDER_CREATE_SUCCESS)
      } catch (error) {
        commit(ORDER_CREATE_FAIL, {
          error:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    },
  },
}
