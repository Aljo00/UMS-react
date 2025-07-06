import React, { useState, useEffect } from "react";
import { editUser } from "../api/admin/adminService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaEdit, FaTimes, FaIdCard } from "react-icons/fa";

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
}

interface EditUserModalProps {
  user: User | null;
  onClose: () => void;
  onUserUpdated: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  onClose,
  onUserUpdated,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?._id || !name || !email) {
      toast.error("All fields are required");
      return;
    }

    try {
      setIsLoading(true);

      const response = await editUser(user._id, name, email);

      if (response) {
        toast.success("User updated successfully!");
        onUserUpdated();
        onClose();
      }
    } catch (err: any) {
      console.error("Error updating user:", err);
      toast.error(err.message || "Error updating user");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

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
      onClick={onClose}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-gray-900 bg-opacity-80 backdrop-blur-md p-8 rounded-xl w-full max-w-md border border-gray-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-transparent bg-clip-text mb-6 flex items-center gap-2"
        >
          <FaEdit className="text-amber-500" /> Edit User
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center mb-4 bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 flex items-center justify-center p-0.5 mr-4">
              <img
                src={user.image}
                alt={user.name}
                className="w-full h-full rounded-full object-cover border-2 border-gray-900"
              />
            </div>
            <div>
              <p className="text-gray-300 flex items-center gap-2 mb-1">
                <FaIdCard className="text-amber-500" /> User ID:
              </p>
              <p className="text-gray-400 text-sm">{user._id}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FaUser />
            </div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-all duration-300"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FaEnvelope />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-all duration-300"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-between pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-gradient-to-r from-yellow-500 to-amber-600 px-6 py-3 rounded-lg text-white shadow-lg hover:shadow-amber-500/20 transition-all duration-300 flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaEdit /> Update User
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
            >
              <FaTimes /> Cancel
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditUserModal;
