import express from "express";
import protect from "../middlewares/authMiddleware.js";
import updateProfileController from "../controllers/user/updateProfileController.js";

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.status(200).json(req.user);
});

router.put("/profile", protect, updateProfileController);

export default router;
