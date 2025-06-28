import User from "../../models/User.js";

const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;

    const users = await User.find({
      role: "user",
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to search users", error: error.message });
  }
};

export default searchUsers;
