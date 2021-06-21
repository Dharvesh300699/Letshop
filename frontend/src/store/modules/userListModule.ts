import { Commit } from "vuex"
import axios from "axios"
import { State } from "../index"
import { user } from "@/globalTypes"
import {
  USER_LIST_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_RESET,
  USER_LIST_SUCCESS,
} from "../mutationTypes"

export interface userList {
  users: user[]
  loading: boolean
  error: string | null
}

export default {
  state: <userList>{
    users: [],
    loading: false,
    error: null,
  },
  mutations: {
    [USER_LIST_REQUEST](state: userList): void {
      state.loading = true
    },
    [USER_LIST_SUCCESS](state: userList, payload: user[]): void {
      state.loading = false
      state.users = payload
    },
    [USER_LIST_FAIL](state: userList, payload: { error: string }): void {
      state.loading = false
      state.error = payload.error
    },
    [USER_LIST_RESET](state: userList): void {
      state.loading = false
      state.error = null
      state.users = []
    },
  },
  actions: {
    async listUsers({
      commit,
      rootState,
    }: {
      commit: Commit
      rootState: State
    }): Promise<void> {
      try {
        commit(USER_LIST_REQUEST)
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${rootState.userLogin.userInfo?.token}`,
          },
        }
        const { data } = await axios.get("/api/users", config)
        commit(USER_LIST_SUCCESS, data)
      } catch (error) {
        commit(USER_LIST_FAIL, {
          error:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    },
  },
}
