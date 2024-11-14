const User = require("../models/user_model");
const Event = require("../models/events_model");
const Ticket = require("../models/tickets_model");
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// **********
// Add User
// *********
exports.addUser = async (req, res) => {
  const {
    ID,
    userName,
    email,
    password,
    // registrationDate,
    userRole,
    status,
  } = req.body;

  try {
    const newUser = new User({
      ID,
      userName,
      email,
      password,
      userRole,
      status,
      registrationDate: new Date(),
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ error: "Error adding user", details: err.message });
  }
};

exports.getPurchasedUser = async (req, res) => {
  const { userId } = req.query; // Get userId from query parameters

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Fetch user data by userId
    const user = await User.findById(userId);
    const formattedUser = {
      ...user._doc,
      registrationDate: formatDate(user.registrationDate),
    };

    return res.json(formattedUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
// **********
// Get Users
// *********
exports.getAllUsers = async (req, res) => {
  try {
    const { userRole } = req.query;

    let query = {};

    if (userRole) {
      query.userRole = userRole;
    }
    const users = await User.find(query);
    const formattedDate = users.map((user) => ({
      ...user._doc,
      registrationDate: formatDate(user.registrationDate),
    }));

    return res.json(formattedDate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// *******************
// Get User by userid
// *******************
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res
      .status(500)
      .json({ error: "Error fetching user", details: err.message });
  }
};
// **********
// update User
// ***********
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const updatedData = req.body;
    const user = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.status(200).json({ message: "User updated", user });
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
};
// **********
// delete User
// ***********
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error("Error deleting User:", error);
    res
      .status(500)
      .json({ error: "Error deleting user", details: error.message });
  }
};
// **************************
// Update User status and Role
// **************************

exports.updatedUserStatusAndRole = async (req, res) => {
  try {
    const { status, userRole } = req.body;
    console.log(status);
    console.log(userRole);
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { userRole },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User status updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
