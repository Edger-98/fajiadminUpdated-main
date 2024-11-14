const mongoose = require("mongoose");

const eventsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manageusers",
    required: true,
  },
  eventTitle: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  event_organizer: {
    type: String,
    required: true,
  },
  date: { type: Date, required: true },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },

  reason: { type: String },
  images: {
    type: [String],
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  description: { type: String, required: true },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  platform_expense: {
    type: String,
    required: true,
  },
  ticketsSold: { type: Number, default: 0 }, // Optional for quick access
});

module.exports = mongoose.model("events", eventsSchema);
