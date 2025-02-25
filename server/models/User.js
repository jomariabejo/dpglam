const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  token: { type: String },        // Token field
  tokenExpiry: { type: Date },    // Token expiry field
  role: { 
    type: String, 
    enum: ['customer', 'admin'], 
    default: 'customer'          
  },
  profileImageUrl: { type: String }
}, { timestamps: true });

/**
 * Generates a new JWT token and updates the user's record.
 */
userSchema.methods.generateToken = async function () {
  const token = jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
      username: this.username,
      profileImageUrl: this.profileImageUrl,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );

  this.token = token;
  this.tokenExpiry = new Date(Date.now() + process.env.JWT_LIFETIME * 1000);
  await this.save(); // Update user record with new token
  return token;
};

/**
 * Validates an existing token.
 */
userSchema.statics.validateToken = function (token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null; // Token is invalid or expired
  }
};

const User = mongoose.model('User', userSchema);
module.exports = User;
