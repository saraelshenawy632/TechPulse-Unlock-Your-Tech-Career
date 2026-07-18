const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const userController = require("../controllers/userController");

// الحصول على قائمة المستخدمين
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    userController.getUsers
);

// حذف مستخدم
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    userController.deleteUser
);

// تعديل صلاحية مستخدم
router.put(
    "/:id/role",
    authMiddleware,
    adminMiddleware,
    userController.updateRole
);

module.exports = router;