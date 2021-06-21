const express = require("express")
const router = new express.Router()
const {
  authUser,
  registerUser,
  getUsers,
  deleteUser,
  adminUpdate,
} = require("../controllers/userController")
const { auth, admin } = require("../middleware/authMiddleware")

router.post("/", registerUser)
router.get("/", auth, admin, getUsers)
router.post("/login", authUser)
router.delete("/:id", auth, admin, deleteUser)
router.put("/:id", auth, admin, adminUpdate)

module.exports = router
