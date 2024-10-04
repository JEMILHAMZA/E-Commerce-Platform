// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
    }
  ],
  totalCost: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  orderStatus: { 
    type: String, 
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Processing' 
  },
  shippingAddress: {
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true },
  fullName: { type: String, required: true },  // Added field for full name
  phoneNumber: { type: String, required: true },  // Added field for phone number
});

module.exports = mongoose.model('Order', OrderSchema);

