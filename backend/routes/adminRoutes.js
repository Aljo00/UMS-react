import express from "express";
import protect from "../middlewares/authMiddleware.js";
import admin from "../middlewares/adminMiddleware.js";

import getAllUsers from "../controllers/admin/getAllUsers.js";
import addUser from "../controllers/admin/addUser.js";
import updateUser from "../controllers/admin/updateUser.js";
import deleteUser from "../controllers/admin/deleteUser.js";
import searchUsers from "../controllers/admin/searchUsers.js";

const router = express.Router();

router.use(protect, admin);

router.get("/", getAllUsers);
router.post("/add", addUser);
router.put("/edit/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.get("/search", searchUsers);

export default router;
