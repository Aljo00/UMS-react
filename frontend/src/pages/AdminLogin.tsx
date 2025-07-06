import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAdmin } from "../redux/slices/adminSlice";
import { loginAdmin, dashboard } from "../api/admin/adminService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUserShield,
} from "react-icons/fa";
import { RootState } from "../redux/store";
import { motion } from "framer-motion";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(
    (state: RootState) => state.admin.isAuthenticated
  );
  const adminData = useSelector((state: RootState) => state.admin.admin);

  useEffect(() => {
    if (isAuthenticated && adminData) {
      navigate("/admin/dashboard");
      return;
    }

    const hasAdminCookies =
      document.cookie.includes("adminAccessToken") ||
      document.cookie.includes("adminRefreshToken");

    if (hasAdminCookies) {
      const verifyAdminAuth = async () => {
        try {
          const data = await dashboard("");
          if (data) {
            dispatch(
              setAdmin({
                admin: data.admin,
                isAuthenticated: true,
              })
            );
            navigate("/admin/dashboard");
          }
        } catch (error) {
          console.error("Failed to verify admin authentication:", error);
        }
      };

      verifyAdminAuth();
    }
  }, [dispatch, navigate, isAuthenticated, adminData]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();

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
    } else if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      const data = await loginAdmin(email, password);

      if (data) {
        dispatch(
          setAdmin({
            admin: data.admin,
          })
        );

        localStorage.setItem("adminLoggedIn", "true");

        toast.success("Admin login successful");
        navigate("/admin/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
    }
  };

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-pink-900/20 to-black overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-10 translate-x-1/2 translate-y-1/2"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 bg-black bg-opacity-30 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-gray-800 w-full max-w-md"
      >
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center p-1 shadow-lg">
            <div className="w-full h-full rounded-full bg-black bg-opacity-70 flex items-center justify-center">
              <FaUserShield className="text-4xl text-pink-500" />
            </div>
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text mb-8 text-center"
        >
          Admin Login
        </motion.h1>

        <form onSubmit={handleAdminLogin}>
          <motion.div variants={containerVariants} className="space-y-6">
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaEnvelope />
              </div>
              <input
                className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-all duration-300"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaLock />
              </div>
              <input
                className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-all duration-300"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 py-3 rounded-lg text-white font-medium shadow-lg hover:shadow-pink-500/20 transition-all duration-300 flex justify-center items-center"
            >
              Login
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminLogin;
