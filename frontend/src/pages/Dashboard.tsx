import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../redux/slices/adminSlice";
import AddUserModal from "../components/AddUserModal";
import EditUserModal from "../components/EditUserModal";
import { dashboard, deleteUser, logoutAdmin } from "../api/admin/adminService";
import { RootState } from "../redux/store";
import {
  FaUserPlus,
  FaSearch,
  FaSignOutAlt,
  FaEdit,
  FaTrash,
  FaUser,
} from "react-icons/fa";
interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  createdAt: string;
}
interface Admin {
  _id: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const adminData = useSelector(
    (state: RootState) => state.admin.admin
  ) as Admin | null;

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await dashboard(search);
      setUsers(data.users);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedUserId(id);
    setShowConfirm(true);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const confirmDelete = async () => {
    if (selectedUserId) {
      try {
        await deleteUser(selectedUserId);
        setUsers(users.filter((user) => user._id !== selectedUserId));
        toast.success("User deleted");
      } catch {
        toast.error("Failed to delete user");
      }
      setShowConfirm(false);
      setSelectedUserId(null);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await logoutAdmin();

      dispatch(logOut());
      localStorage.removeItem("adminLoggedIn");

      toast.success("Logged out successfully");
      navigate("/admin/login");
    } catch (error) {
      toast.error("Failed to logout");
      dispatch(logOut());
      localStorage.removeItem("adminLoggedIn");
      navigate("/admin/login");
    }
  };

  const refreshUsers = async () => {
    try {
      const data = await dashboard(search);
      setUsers(data.users);
    } catch {
      toast.error("Failed to refresh users");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-black text-white"
    >
      <div className="container mx-auto px-4 py-2">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-between items-center mb-8 bg-black bg-opacity-40 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-800"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              Admin Dashboard
            </h1>
            {adminData && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 mt-1 flex items-center gap-2"
              >
                <FaUser className="text-purple-400" /> {adminData.email}
              </motion.p>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdminLogout}
            className="bg-gradient-to-r from-red-500 to-pink-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-pink-500/20 transition-all duration-300"
          >
            <FaSignOutAlt /> Logout
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex mx-32 mb-6 gap-2 bg-black bg-opacity-40 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-800"
        >
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-lg bg-gray-800 bg-opacity-50 w-full border border-gray-700 focus:border-purple-500 focus:outline-none transition-all duration-300"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 whitespace-nowrap"
          >
            <FaUserPlus /> Add User
          </motion.button>
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center my-12"
          >
            <div className="w-16 h-16 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin mb-4"></div>
            <p className="text-purple-300">Loading users...</p>
          </motion.div>
        ) : users.length === 0 ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12 bg-black bg-opacity-40 backdrop-blur-md rounded-xl border border-gray-800 shadow-lg"
          >
            <FaUser size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-xl text-gray-300">No users found</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-black mx-32 bg-opacity-40 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-gray-800"
          >
            <table className="min-w-full table-auto">
              <thead className="bg-gray-900 bg-opacity-60 text-white border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="hover:bg-gray-800 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{i + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center p-0.5">
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-full h-full object-cover rounded-full border-2 border-gray-800"
                        />
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {new Date(user.createdAt as string).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-r from-yellow-500 to-amber-600 px-4 py-2 rounded-lg text-sm flex items-center gap-1 shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
                          onClick={() => handleEditClick(user)}
                        >
                          <FaEdit /> Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteClick(user._id)}
                          className="bg-gradient-to-r from-red-500 to-pink-600 px-4 py-2 rounded-lg text-sm flex items-center gap-1 shadow-lg hover:shadow-red-500/20 transition-all duration-300"
                        >
                          <FaTrash /> Delete
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AddUserModal
              onClose={() => setShowAddModal(false)}
              onUserAdded={refreshUsers}
            />
          </motion.div>
        )}

        {showEditModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EditUserModal
              user={selectedUser}
              onClose={() => {
                setShowEditModal(false);
                setSelectedUser(null);
              }}
              onUserUpdated={refreshUsers}
            />
          </motion.div>
        )}

        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 bg-opacity-80 backdrop-blur-md p-8 rounded-xl max-w-md w-full border border-gray-700 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center">
                  <FaTrash className="text-red-500" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Confirm Delete
                  </h3>
                  <p className="text-gray-400 text-sm">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="mb-8 text-gray-300">
                Are you sure you want to permanently delete this user?
              </p>

              <div className="flex justify-end gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowConfirm(false)}
                  className="px-5 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-all duration-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmDelete}
                  className="bg-gradient-to-r from-red-500 to-pink-600 px-5 py-2.5 rounded-lg text-white shadow-lg hover:shadow-red-500/20 transition-all duration-300"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
