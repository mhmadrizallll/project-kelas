import express from "express";
const router = express.Router();
import { userController } from "../../controllers/api/user-controller";
import authMiddleware from "../../middlewares/auth";

router.get("/", authMiddleware, userController.getAllUsers);
router.post("/register", userController.registerGuest);
router.post("/login/auth/google", userController.loginAuthGoogle);
router.post("/login", userController.login);
router.post(
  "/register/logging",
  authMiddleware,
  userController.registerLogging
);
router.put("/update/:id", authMiddleware, userController.updateUser);
router.delete("/delete/:id", authMiddleware, userController.deleteUser);
router.put("/restore/:id", authMiddleware, userController.restoreUser);

export default router;
