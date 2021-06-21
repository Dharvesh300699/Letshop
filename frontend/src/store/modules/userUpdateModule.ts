import { Commit } from "vuex"
import { State } from "../index"
import axios from "axios"
import {
  USER_UPDATE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
} from "../mutationTypes"

export interface userUpdate {
  loading: boolean
  success: boolean
  error: string | null
}

export default {
  state: <userUpdate>{
    loading: false,
    success: false,
    error: null,
  },
  mutations: {
    [USER_UPDATE_REQUEST](state: userUpdate): void {
      state.loading = true
      state.success = false
    },
    [USER_UPDATE_SUCCESS](state: userUpdate): void {
      state.loading = false
      state.success = true
    },
    [USER_UPDATE_FAIL](state: userUpdate, payload: { error: string }): void {
      state.loading = false
      state.error = payload.error
    },
  },
  actions: {
    async updateUser(
      { commit, rootState }: { commit: Commit; rootState: State },
      id: string
    ): Promise<void> {
      try {
        commit(USER_UPDATE_REQUEST)
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${rootState.userLogin.userInfo?.token}`,
          },
        }
        await axios.put(`/api/users/${id}`, {}, config)
        commit(USER_UPDATE_SUCCESS)
      } catch (error) {
        commit(USER_UPDATE_FAIL, {
          error:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    },
  },
}
