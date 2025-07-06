import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { home, logoutUser } from "../api/user/userService";
import { logOut, setUser } from "../redux/slices/userSlice";
import { RootState } from "../redux/store";
import EditProfileModal from "../components/EditProfileModal";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaSignOutAlt, FaEdit } from "react-icons/fa";

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
}

const Home: React.FC = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector(
    (state: RootState) => state.user.user
  ) as User | null;

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";

    if (!isLoggedIn) {
      navigate("/users/login");
      return;
    }
    if (!userData) {
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
          } else {
            toast.error("User profile data is missing");
          }
        } catch (error: any) {
          console.error(error);

          if (error.response && error.response.status === 401) {
            toast.error("Session expired. Please login again.");
            localStorage.removeItem("userLoggedIn");
            navigate("/users/login");
          } else {
            toast.error("Failed to load user profile");
          }
        }
      };

      fetchUserProfile();
    }
  }, [userData, dispatch, navigate]);

  const handleLogOut = async () => {
    console.log("logout");
    try {
      await logoutUser();
      dispatch(logOut());

      localStorage.removeItem("userLoggedIn");

      toast.success("Logout successful");

      navigate("/users/login");
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);

      dispatch(logOut());
      localStorage.removeItem("userLoggedIn");
      navigate("/users/login");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black text-white"
    >
      <header className="w-full flex justify-between items-center px-10 py-6 bg-black bg-opacity-40 backdrop-blur-md fixed top-0 z-10 shadow-lg">
        <motion.h1
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"
        >
          User Dashboard
        </motion.h1>

        <motion.button
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogOut}
          className="bg-gradient-to-r from-red-500 to-pink-600 px-4 py-2 rounded-md flex items-center gap-2 shadow-lg hover:shadow-pink-500/20"
        >
          <FaSignOutAlt /> Logout
        </motion.button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-10">
        {userData ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-md bg-gray-800 bg-opacity-50 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-gray-700"
          >
            <div className="relative flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-1">
                  <img
                    src={userData.image || "/default-user.png"}
                    alt="User Profile"
                    className="w-full h-full rounded-full object-cover border-4 border-gray-800"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gray-800 rounded-full p-2 shadow-lg">
                  <FaUser className="text-blue-400" size={18} />
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-center w-full"
              >
                <h2 className="text-2xl font-bold text-white mb-1">
                  {userData.name}
                </h2>
                <p className="text-blue-300 mb-6">{userData.email}</p>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-6"></div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEditModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg flex items-center justify-center gap-2 w-full shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                >
                  <FaEdit /> Edit Profile
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-blue-300">Loading your profile...</p>
          </div>
        )}

        <AnimatePresence>
          {showEditModal && userData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EditProfileModal onClose={() => setShowEditModal(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default Home;
