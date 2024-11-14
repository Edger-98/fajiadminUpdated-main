const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const changeSchema = new Schema({
  old: { type: String, required: false },
  new: { type: String, required: true },
});
const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },

  ID: {
    type: Number,
    required: true,
  },
  timeStamp: { type: Date, default: Date.now },
  userId: {
    type: Number,

    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  changes: {
    type: Map,
    of: changeSchema,
  },
});
const AuditLog = mongoose.model("auditLogs", auditLogSchema);
module.exports = AuditLog;
