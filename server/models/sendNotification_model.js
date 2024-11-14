const mongoose = require("mongoose");
// console.log(mongoose.Schema.Types.ObjectId);
const notificationsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("sendNotifications", notificationsSchema);
