const express = require("express");
const router = express.Router();
const {
  createGroupRoom,
  getGroupRoom,
  joinGroupRoom,
  addMemberItem,
  removeMemberItem,
  updateMemberItemQuantity,
  toggleLockGroupRoom,
  confirmGroupOrder,
} = require("../controllers/groupOrderController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createGroupRoom);
router.get("/:roomId", getGroupRoom);
router.post("/:roomId/join", protect, joinGroupRoom);
router.post("/:roomId/items", protect, addMemberItem);
router.put("/:roomId/items/:itemId", protect, updateMemberItemQuantity);
router.delete("/:roomId/items/:itemId", protect, removeMemberItem);
router.patch("/:roomId/lock", protect, toggleLockGroupRoom);
router.post("/:roomId/confirm", protect, confirmGroupOrder);

module.exports = router;
