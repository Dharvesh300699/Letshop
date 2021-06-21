import { InjectionKey } from "vue"
import { createStore, Store, useStore as baseUseStore } from "vuex"
import productListModule, { productList } from "./modules/productListModule"

import productDetailsModule, {
  productDetails,
} from "./modules/productDetailsModule"
import productDeleteModule, {
  productDelete,
} from "./modules/productDeleteModule"
import productCreateModule, {
  productCreate,
} from "./modules/productCreateModule"
import productUpdateModule, {
  productUpdate,
} from "./modules/productUpdateModule"
import productReviewModule, {
  productReview,
} from "./modules/productReviewModule"

import productTopModule, { productTop } from "./modules/productTopModule"

import cartModule, { cart } from "./modules/cartModule"

import userLoginModule, { userLogin } from "./modules/userLoginModule"
import userRegisterModule, { userRegister } from "./modules/userRegisterModule"

import orderCreateModule, { orderCreate } from "./modules/orderCreateModule"
import orderDetailsModule, { orderDetails } from "./modules/orderDetailsModule"
import orderPayModule, { orderPay } from "./modules/orderPayModule"
import orderDeliverModule, { orderDeliver } from "./modules/orderDeliverModule"
import orderListModule, { orderList } from "./modules/orderListModule"

import userOrdersListModule, {
  userOrdersList,
} from "./modules/userOrdersListModule"

import userListModule, { userList } from "./modules/userListModule"
import userDeleteModule, { userDelete } from "./modules/userDeleteModule"
import userUpdateModule, { userUpdate } from "./modules/userUpdateModule"

export interface State {
  productList: productList
  productDetails: productDetails
  productDelete: productDelete
  productCreate: productCreate
  productUpdate: productUpdate
  productReview: productReview
  productTop: productTop
  cart: cart
  userLogin: userLogin
  userRegister: userRegister
  orderCreate: orderCreate
  orderDetails: orderDetails
  orderPay: orderPay
  orderDeliver: orderDeliver
  orderList: orderList
  userOrdersList: userOrdersList
  userList: userList
  userUpdate: userUpdate
  userDelete: userDelete
}

export const key: InjectionKey<Store<State>> = Symbol()

export function useStore(): Store<State> {
  return baseUseStore(key)
}

export const store = createStore<State>({
  modules: {
    productList: productListModule,
    productDetails: productDetailsModule,
    productDelete: productDeleteModule,
    productCreate: productCreateModule,
    productUpdate: productUpdateModule,
    productReview: productReviewModule,
    productTop: productTopModule,
    cart: cartModule,
    userLogin: userLoginModule,
    userRegister: userRegisterModule,
    orderCreate: orderCreateModule,
    orderDetails: orderDetailsModule,
    orderPay: orderPayModule,
    orderDeliver: orderDeliverModule,
    orderList: orderListModule,
    userOrdersList: userOrdersListModule,
    userList: userListModule,
    userDelete: userDeleteModule,
    userUpdate: userUpdateModule,
  },
})
