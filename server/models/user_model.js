const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  ID: {
    type: Number,
  },
  userName: {
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
  userRole: {
    type: String,
    default: "Organizer", // 'organizer', 'Admin', 'Attendee',
  },
  registrationDate: {
    type: Date,
    default: Date.now, // Automatically set the current date when creating a new user
  },
  status: {
    type: String,
    default: "active", // active, inActive
  },
  ticketsPurchased: { type: Number, default: 0 },
});

module.exports = mongoose.model("Manageusers", UserSchema);
