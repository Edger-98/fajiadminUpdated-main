const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  // emailId: {
  //   type: Number,
  //   required: true,
  // },
  name: {
    type: String,
    required: true,
  },

  subject: {
    type: String,
    required: true,
  },

  body: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("emailTemplates", emailSchema);
