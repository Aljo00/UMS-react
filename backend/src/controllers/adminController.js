import { ZodError } from "zod";
import userModel from "../models/user.model.js";
import { HttpStatus } from "../utils/httpStatusCode.js";
import {
  adminLoginSchema,
  userRegistrationSchema,
} from "../validations/userValidation.js";
import { generateRefreshToken } from "../services/auth.service.js";
import userService from "../services/user.service.js";

// ===========================================================================================================
// LOGIN ADMIN
// ===========================================================================================================
// This controller is responsible for logging the uadmin into the dashboard.
// ===========================================================================================================
export const loginAdmin = async (req, res) => {
  try {
    const validatedData = adminLoginSchema.parse(req.body);

    const { email, password } = validatedData;

    const admin = await userModel
      .findOne({ email: email, role: "admin" })
      .select("+password");
    if (!admin) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Admin not found." });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Invalid Email or Password" });
    }

    const adminAccessToken = admin.generateAccessToken();
    const adminRefreshToken = generateRefreshToken(admin._id);

    res.cookie("adminAccessToken", adminAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("adminRefreshToken", adminRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(HttpStatus.OK).json({ admin });
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessage = error.errors.map((err) => err.message);
      return res.status(HttpStatus.BAD_REQUEST).json({ message: errorMessage });
    }

    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error: error.message });
  }
};

// ===========================================================================================================
// DASHBOARD
// ===========================================================================================================
// This controller provide the data to the admin dashboard.
// ===========================================================================================================
export const adminDashboard = async (req, res) => {
  try {
    const { search } = req.query;

    const filter = { role: "user" };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await userModel.find(filter).sort({ createdAt: -1 });
    // if (!users || users.length === 0) {
    //     return res.status(HttpStatus.NOT_FOUND).json({ message: "Users not found" });
    // }

    return res.status(HttpStatus.OK).json({ users });
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error: error.message });
  }
};

// ===========================================================================================================
// CREATE USER
// ===========================================================================================================
// This controller allow the admin to create new user.
// ===========================================================================================================
export const createUser = async (req, res) => {
  try {
    const validatedData = userRegistrationSchema.parse(req.body);

    const { name, email, image, password } = validatedData;

    if (!name || !email || !image || !password) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "All fields are required." });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "User already exist." });
    }

    const user = await userService.createUser({
      name,
      email,
      password,
      image,
    });

    const accessToken = user.generateAccessToken();
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(HttpStatus.CREATED).json({
      user,
    });
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error: error.message });
  }
};

// ===========================================================================================================
// EDIT USER
// ===========================================================================================================
// This controller allow the admin to edit the user info like email, name etc.
// ===========================================================================================================
export const editUser = async (req, res) => {
  try {
    const { id, name, email } = req.body;

    console.log(req.body);

    if (!id || !name || !email) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "All fields are required" });
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    }

    user.name = name;
    user.email = email;

    await user.save();

    return res
      .status(HttpStatus.OK)
      .json({ message: "User updated successfully" });
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error: error.message });
  }
};

// ===========================================================================================================
// DELET USER
// ===========================================================================================================
// This controller allow the admin to delete the user from the data base.
// ===========================================================================================================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "User id is required" });
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "User not found." });
    }

    await user.deleteOne();

    return res
      .status(HttpStatus.OK)
      .json({ message: "User deleted successfully" });
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error: error.message });
  }
};

// ===========================================================================================================
// LOGOUT ADMIN
// ===========================================================================================================
// This controller allow the admin to logout from the dashboard.
// ===========================================================================================================
export const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("adminAccessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("adminRefreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res
      .status(HttpStatus.OK)
      .json({ message: "Logged out successfully." });
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error: error.message });
  }
};
