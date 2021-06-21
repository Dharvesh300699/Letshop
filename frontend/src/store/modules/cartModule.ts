import { cartItem, address } from "@/globalTypes"

import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_RESET,
  SAVE_SHIPPING_ADDRESS,
} from "../mutationTypes"

export interface cart {
  cartItems: cartItem[]
  shippingAddress: address
}

let cartItemsFromStorage: cartItem[]
if (sessionStorage.getItem("cartItems")) {
  cartItemsFromStorage = JSON.parse(sessionStorage.getItem("cartItems")!)
} else {
  cartItemsFromStorage = []
}

let shippingAddressFromStorage: address
if (sessionStorage.getItem("shippingAddress")) {
  shippingAddressFromStorage = JSON.parse(
    sessionStorage.getItem("shippingAddress")!
  )
} else {
  shippingAddressFromStorage = {} as address
}

export default {
  state: <cart>{
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
  },
  mutations: {
    [CART_ADD_ITEM](state: cart, payload: { item: cartItem }): void {
      const item = payload.item

      const existItem = state.cartItems.find((x) => item._id === x._id)
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id == item._id ? item : x
        )
      } else {
        state.cartItems = [...state.cartItems, item]
      }

      sessionStorage.setItem("cartItems", JSON.stringify(state.cartItems))
    },
    [CART_REMOVE_ITEM](state: cart, payload: { id: string }): void {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== payload.id
      )

      sessionStorage.setItem("cartItems", JSON.stringify(state.cartItems))
    },
    [SAVE_SHIPPING_ADDRESS](state: cart, payload: address): void {
      state.shippingAddress = payload
      sessionStorage.setItem("shippingAddress", JSON.stringify(payload))
    },
    [CART_RESET](state: cart): void {
      state.cartItems = []
      if (sessionStorage.getItem("cartItems")) {
        sessionStorage.removeItem("cartItems")
      }
    },
  },
}
