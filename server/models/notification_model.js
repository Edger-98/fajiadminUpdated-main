const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema({
  // notification_id: {
  //   type: String,
  //   required: true,
  // },
  title: {
    type: String,
    required: true,
  },
 
  date: { type: Date, required: true },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Notifications", notificationsSchema);
