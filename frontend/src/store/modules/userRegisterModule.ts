import { Commit } from "vuex"
import axios from "axios"
import { user } from "@/globalTypes"

import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LOGIN_SUCCESS,
} from "../mutationTypes"

interface userInfo {
  user: user
  token: string
}

export interface userRegister {
  userInfo: userInfo | null
  loading: boolean
  error: string | null
}

export default {
  state: <userRegister>{
    userInfo: null,
    loading: false,
    error: null,
  },
  mutations: {
    [USER_REGISTER_REQUEST](state: userRegister): void {
      state.loading = true
    },
    [USER_REGISTER_SUCCESS](state: userRegister, payload: userInfo): void {
      state.userInfo = payload
      state.loading = false
    },
    [USER_REGISTER_FAIL](
      state: userRegister,
      payload: { error: string }
    ): void {
      state.loading = false
      state.error = payload.error
    },
  },
  actions: {
    async register(
      { commit }: { commit: Commit },
      {
        name,
        email,
        password,
      }: { name: string; email: string; password: string }
    ): Promise<void> {
      try {
        commit(USER_REGISTER_REQUEST)

        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        }
        const { data } = await axios.post(
          "/api/users",
          { name, email, password },
          config
        )
        commit(USER_REGISTER_SUCCESS, data)
        commit(USER_LOGIN_SUCCESS, data, { root: true })
        sessionStorage.setItem("userInfo", JSON.stringify(data))
      } catch (error) {
        commit(USER_REGISTER_FAIL, {
          error:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    },
  },
}
