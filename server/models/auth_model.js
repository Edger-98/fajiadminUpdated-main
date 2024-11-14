const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "attendee", "organizer"], // Limit the role to these values
    default: "admin", // Default role
  },

  pushNotificationsEnabled: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateToken = async function () {
  try {
    return await jwt.sign(
      { userId: this._id.toString() },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );
  } catch (error) {
    console.error("Error generating token:", error);
    return null; // Optionally return null or handle the error as needed
  }
};

module.exports = mongoose.model("User", userSchema);
