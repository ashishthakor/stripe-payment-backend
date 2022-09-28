const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  stripe_customer_id: {
    type: String,
    required: true
  },
  cards: {
    type: [{
      type: String
    }],
  },
});

const User = mongoose.model("User", UserSchema)
module.exports = User