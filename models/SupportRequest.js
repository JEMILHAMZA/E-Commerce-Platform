



const mongoose = require('mongoose');

const supportRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isResponded: { type: Boolean, default: false }
});

const SupportRequest = mongoose.model('SupportRequest', supportRequestSchema);

module.exports = SupportRequest;

