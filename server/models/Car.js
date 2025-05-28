const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  model: String,
  year: Number,
  registrationNumber: String,
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' }
});

module.exports = mongoose.model('Car', carSchema);
