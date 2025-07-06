import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateUserProfile } from "../api/user/userService";
import { updateUser } from "../redux/slices/userSlice";
import { uploadImageToCloudinary } from "../utils/cloudinary";
import { RootState } from "../redux/store";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaEnvelope, FaCamera, FaSave, FaTimes } from "react-icons/fa";

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
}

interface EditProfileModalProps {
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
  const user = useSelector(
    (state: RootState) => state.user.user
  ) as User | null;

  if (!user) {
    toast.error("User data not found");
    onClose();
    return null;
  }

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user.image);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const dispatch = useDispatch();

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

    try {
      setIsLoading(true);

      let imageUrl = user.image;
      if (imageFile) {
        setImageUploading(true);
        try {
          imageUrl = await uploadImageToCloudinary(imageFile);
        } catch (error: any) {
          toast.error("Failed to upload image: " + error.message);
          setIsLoading(false);
          setImageUploading(false);
          return;
        }
        setImageUploading(false);
      }

      const updatedUser = await updateUserProfile(name, email, imageUrl);

      dispatch(updateUser(updatedUser));

      toast.success("Profile updated successfully");
      onClose();
    } catch (error: any) {
      // Handle unauthorized errors
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("userLoggedIn");
        window.location.href = "/users/login";
      } else {
        toast.error(error.message || "Failed to update profile");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-gray-900 bg-opacity-80 backdrop-blur-md p-8 rounded-xl w-full max-w-md border border-gray-700 shadow-2xl"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-6"
        >
          Edit Profile
        </motion.h2>

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-6"
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
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-2 border-gray-900"
                  />
                </div>
                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FaCamera className="text-white text-2xl" />
                </div>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                  accept="image/*"
                  disabled={isLoading}
                />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-5"
          >
            <label className="block text-gray-300 mb-2 text-sm font-medium">
              Name
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaUser />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300"
                disabled={isLoading}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <label className="block text-gray-300 mb-2 text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaEnvelope />
              </div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300"
                disabled={isLoading}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end space-x-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
              disabled={isLoading}
            >
              <FaTimes /> Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 rounded-lg text-white shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center gap-2"
              disabled={isLoading || imageUploading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditProfileModal;
