interface review {
  _id: string
  name: string
  rating: number
  comment: string
  user: string
}

interface product {
  _id: string
  rating: number
  numReviews: number
  price: number
  countInStock: number
  name: string
  image: string
  description: string
  brand: string
  category: string
  user: string
  reviews: review[]
  createdAt: string
  updatedAt: string
}

interface cartItem {
  _id: string
  name: string
  image: string
  price: number
  countInStock: number
  qty: number
}

interface address {
  address: string
  city: string
  postalCode: string
  country: string
}

interface user {
  _id: string
  name: string
  email: string
  isAdmin: boolean
}

interface orderItem extends cartItem {}

interface paymentResult {
  status: string
  order_id: string
  payment_id: string
}

interface successData {
  razorpayOrderId: string
  razorpayPaymentId: string
  status: string
}

interface orderUser {
  id: string
  name: string
}

interface order {
  _id?: string
  user?: orderUser
  orderItems: orderItem[]
  shippingAddress: address
  paymentResult?: paymentResult
  taxPrice: number
  shippingPrice: number
  totalPrice: number
  itemsPrice: number
  isPaid?: boolean
  paidAt?: string
  isDelivered?: boolean
  deliveredAt?: string
  createdAt?: string
  updatedAt?: string
}

interface review {
  rating: number
  comment: string
}

export { product, cartItem, address, user, order, successData, review }
