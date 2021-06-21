import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import Home from "../views/Home.vue"
import ProductDetails from "../views/ProductDetails.vue"
import Cart from "../views/Cart.vue"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import Shipping from "../views/Shipping.vue"
import PlaceOrder from "../views/PlaceOrder.vue"
import Order from "../views/Order.vue"
import UserOrdersList from "../views/UserOrdersList.vue"
import UserList from "../views/UserList.vue"
import ProductList from "../views/ProductList.vue"
import CreateProduct from "../views/CreateProduct.vue"
import UpdateProduct from "../views/UpdateProduct.vue"
import OrderList from "../views/OrderList.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Welcome to Letshop",
    },
  },
  {
    path: "/product/:id",
    name: "ProductDetails",
    component: ProductDetails,
    meta: {
      title: "Product Details",
    },
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
    meta: {
      title: "Cart",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "Login",
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: "Register",
    },
  },
  {
    path: "/shipping",
    name: "Shipping",
    component: Shipping,
    meta: {
      title: "Shipping Address",
    },
  },
  {
    path: "/placeorder",
    name: "PlaceOrder",
    component: PlaceOrder,
    meta: {
      title: "Place Order",
    },
  },
  {
    path: "/order/:id",
    name: "Order",
    component: Order,
    meta: {
      title: "Order Summary",
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: UserOrdersList,
    meta: {
      title: "Profile",
    },
  },
  {
    path: "/admin/userlist",
    name: "UserList",
    component: UserList,
    meta: {
      title: "User List",
    },
  },
  {
    path: "/admin/productlist",
    name: "ProductList",
    component: ProductList,
    meta: {
      title: "Product List",
    },
  },
  {
    path: "/admin/product/:id/edit",
    name: "UpdateProduct",
    component: UpdateProduct,
    meta: {
      title: "Update Product",
    },
  },
  {
    path: "/admin/createProduct",
    name: "CreateProduct",
    component: CreateProduct,
    meta: {
      title: "Create Product",
    },
  },
  {
    path: "/admin/orderList",
    name: "OrderList",
    component: OrderList,
    meta: {
      title: "Order List",
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`
  next()
})

export default router
