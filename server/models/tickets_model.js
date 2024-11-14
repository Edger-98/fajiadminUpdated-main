const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Manageusers",
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Event",
  },
  
  ticketId: {
    type: Number,
    required: true,
  },
  partyName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  purchasedDate: {
    type: Date,
    required: true,
  },
  price: {
    type: String, // Price in dollars
    required: true,
  },
  promoCode: {
    type: String,
  },
  event_organizer: {
    type: String,
    ref: "Event",
  },
});

module.exports = mongoose.model("Tickets", ticketSchema);
