const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  token: { type: String },
  tokenExpiry: { type: Date },
});

const User = mongoose.model('User', userSchema);

module.exports = User; // Ensure this is correctly exported
