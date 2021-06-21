import { Commit } from "vuex"
import { State } from "../index"
import axios from "axios"
import {
  USER_DELETE_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
} from "../mutationTypes"

export interface userDelete {
  loading: boolean
  success: boolean
  error: string | null
}

export default {
  state: <userDelete>{
    loading: false,
    success: false,
    error: null,
  },
  mutations: {
    [USER_DELETE_REQUEST](state: userDelete): void {
      state.loading = true
      state.success = false
    },
    [USER_DELETE_SUCCESS](state: userDelete): void {
      state.loading = false
      state.success = true
    },
    [USER_DELETE_FAIL](state: userDelete, payload: { error: string }): void {
      state.loading = false
      state.error = payload.error
    },
  },
  actions: {
    async deleteUser(
      { commit, rootState }: { commit: Commit; rootState: State },
      id: string
    ): Promise<void> {
      try {
        commit(USER_DELETE_REQUEST)
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${rootState.userLogin.userInfo?.token}`,
          },
        }
        await axios.delete(`/api/users/${id}`, config)
        commit(USER_DELETE_SUCCESS)
      } catch (error) {
        commit(USER_DELETE_FAIL, {
          error:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    },
  },
}
