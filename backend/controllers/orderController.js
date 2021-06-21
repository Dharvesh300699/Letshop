const crypto = require("crypto")
const asyncHandler = require("express-async-handler")
const Order = require("../models/orderModel")
const Razorpay = require("razorpay")
const { default: ShortUniqueId } = require("short-unique-id")

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error("No order items")
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

    const createdOrder = await order.save()
    res.status(201).json(createdOrder)
  }
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "id name")
    .select("-__v")
  if (!order) {
    res.status(404)
    throw new Error("Order not found")
  } else {
    res.json(order)
  }
})

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      status: req.body.status,
      order_id: req.body.razorpayOrderId,
      payment_id: req.body.razorpayPaymentId,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error("Order not found")
  }
})

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error("Order not found")
  }
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("user", "id name")
    .select("-__v")
  res.json(orders)
})

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ isDelivered: false })
    .sort({ createdAt: -1 })
    .populate("user", "id name")
    .select("-__v")
  res.json(orders)
})

// @desc    Update order to paid
// @route   GET /api/orders/:id/razorOrder
// @access  Private
const createRazorOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    const instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    })

    const uid = new ShortUniqueId()

    const options = {
      amount: Math.round(order.totalPrice * 100),
      currency: "INR",
      receipt: uid(),
    }

    const orderInstance = await instance.orders.create(options)

    if (!orderInstance) {
      res.status(500)
      throw new Error("Something went wrong! Try again.")
    }

    res.json(orderInstance)
  } else {
    res.status(404)
    throw new Error("Order not Found!")
  }
})

// @desc    Order payment successful
// @route   /api/orders/success
// @access  Private

const orderSuccess = asyncHandler(async (req, res) => {
  const {
    orderCreationId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
  } = req.body

  const shasum = crypto.createHmac("sha256", process.env.KEY_SECRET)
  shasum.update(`${orderCreationId}|${razorpayPaymentId}`)
  const digest = shasum.digest("hex")

  if (digest !== razorpaySignature) {
    res.status(400)
    throw new Error("Transaction is not legit!")
  }
  res.json({
    razorpayOrderId,
    razorpayPaymentId,
    status: "Completed",
  })
})

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  createRazorOrder,
  orderSuccess,
  getOrders,
}
