const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  token: { type: String },        // Token field
  tokenExpiry: { type: Date },    // Token expiry field
  role: { 
    type: String, 
    enum: ['customer', 'admin'], // Only allows 'customer' or 'admin' as values
    default: 'customer'          // Default role is 'customer'
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
