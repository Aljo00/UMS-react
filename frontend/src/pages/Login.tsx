import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { toast } from "react-toastify";
import { registerUser, loginUser, home } from "../api/user/userService";
import { uploadImageToCloudinary } from "../utils/cloudinary";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaCamera,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Login: React.FC = () => {
  const [signState, setSignState] = useState<"Log In" | "Sign Up">("Log In");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const hasCookies =
      document.cookie.includes("accessToken") ||
      document.cookie.includes("refreshToken");

    if (hasCookies) {
      const fetchUserProfile = async () => {
        try {
          const data = await home();
          if (data) {
            dispatch(
              setUser({
                user: data,
                isAuthenticated: true,
              })
            );
            navigate("/users/home");
          }
        } catch (error) {
          console.error("Failed to verify authentication:", error);
        }
      };

      fetchUserProfile();
    }
  }, [dispatch, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signState === "Log In") {
      if (!email.trim()) {
        toast.error("Email is required");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      if (!password) {
        toast.error("Password is required");
        return;
      }

      try {
        setLoading(true);
        const data = await loginUser(email, password);
        if (data.user) {
          toast.success("Login successful.");
          console.log(data);
          // Store user data in Redux
          dispatch(
            setUser({
              user: data.user,
              isAuthenticated: true,
            })
          );

          // Set localStorage flag for authentication
          localStorage.setItem("userLoggedIn", "true");

          navigate("/users/home");
        } else {
          toast.error("Login failed");
        }
      } catch (error: any) {
        console.error("Login Error:", error);
        toast.error(error?.response?.data?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    }

    if (signState === "Sign Up") {
      if (!name.trim()) {
        toast.error("Name is required");
        return;
      }

      if (!email.trim()) {
        toast.error("Email is required");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      if (!password) {
        toast.error("Password is required");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      if (!imageFile) {
        toast.error("Please upload an image");
        return;
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        toast.error(
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
        );
        return;
      }

      try {
        setLoading(true);

        setImageUploading(true);
        let imageUrl;
        try {
          imageUrl = await uploadImageToCloudinary(imageFile);
          setImage(imageUrl);
          setImageUploading(false);
        } catch (uploadErr: any) {
          console.error("Image upload error:", uploadErr);
          toast.error("Image upload failed: " + uploadErr.message);
          setLoading(false);
          setImageUploading(false);
          return;
        }

        try {
          const data = await registerUser(name, email, imageUrl, password);
          if (data.user) {
            // Store user data in Redux
            dispatch(
              setUser({
                user: data.user,
                isAuthenticated: true,
              })
            );

            // Set localStorage flag for authentication
            localStorage.setItem("userLoggedIn", "true");

            toast.success("Account created successfully");
            navigate("/users/home");
          } else {
            toast.error("Registration failed");
          }
        } catch (registerErr: any) {
          console.error("Registration error:", registerErr);
          toast.error(
            registerErr?.response?.data?.message || "Registration failed"
          );
        }
      } catch (error: any) {
        console.error("Signup Error:", error);
        toast.error(error?.message || "Signup failed");
      } finally {
        setLoading(false);
        setImageUploading(false);
      }
    }
  };

  const inputStyle =
    "w-full bg-transparent border-b border-gray-600 p-2 focus:outline-none focus:border-blue-400";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Fix for signup fields visibility
  const signupFieldsVariants = {
    hidden: { opacity: 0, height: 0, marginBottom: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      marginBottom: 24,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-indigo-900 to-black overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-10 translate-x-1/2 translate-y-1/2"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 bg-black bg-opacity-30 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-gray-800 w-full max-w-md"
      >
        <motion.h1
          variants={itemVariants}
          className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-8 text-center"
        >
          {signState === "Log In" ? "Welcome Back" : "Create Account"}
        </motion.h1>

        <form onSubmit={handleSubmit}>
          <motion.div variants={containerVariants} className="space-y-6">
            <motion.div
              variants={signupFieldsVariants}
              initial="hidden"
              animate={signState === "Sign Up" ? "visible" : "hidden"}
              className="overflow-hidden"
            >
              <motion.div
                key="signup-fields"
                variants={containerVariants}
                className="space-y-6"
              >
                <motion.div
                  variants={itemVariants}
                  className="flex justify-center relative w-full"
                >
                  {imageUploading ? (
                    <div className="w-28 h-28 rounded-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div className="relative group">
                      <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1 shadow-lg">
                        <img
                          src={imagePreview || "/default-avatar.png"}
                          alt="preview"
                          className="w-full h-full rounded-full object-cover border-2 border-gray-900"
                        />
                      </div>
                      <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <FaCamera className="text-white text-2xl" />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                        disabled={loading || imageUploading}
                      />
                    </div>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaUser />
                  </div>
                  <input
                    className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading || imageUploading}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaEnvelope />
              </div>
              <input
                className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || imageUploading}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaLock />
              </div>
              <input
                className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || imageUploading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </motion.div>

            <motion.div
              variants={signupFieldsVariants}
              initial="hidden"
              animate={signState === "Sign Up" ? "visible" : "hidden"}
              className="overflow-hidden"
            >
              <motion.div
                key="confirm-password"
                variants={itemVariants}
                className="relative"
              >
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaLock />
                </div>
                <input
                  className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading || imageUploading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </motion.div>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-lg text-white font-medium shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex justify-center items-center"
              disabled={loading || imageUploading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              ) : (
                signState
              )}
            </motion.button>
          </motion.div>
        </form>

        <motion.div variants={itemVariants} className="mt-6 text-center">
          <p className="text-gray-300">
            {signState === "Log In"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <motion.button
              whileHover={{ scale: 1.05 }}
              type="button"
              className="text-blue-400 font-medium hover:text-blue-300 transition-colors duration-300"
              onClick={() =>
                setSignState(signState === "Log In" ? "Sign Up" : "Log In")
              }
              disabled={loading || imageUploading}
            >
              {signState === "Log In" ? "Sign Up" : "Log In"}
            </motion.button>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
