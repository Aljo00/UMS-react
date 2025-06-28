import User from "../../models/User.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(
      "There is error find in the getAllUsers controllers ",
      error.message
    );
    res.status(500).json({ message: "Failed to fetch users from the DB" });
  }
};
export default getAllUsers