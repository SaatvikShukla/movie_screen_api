const mongoose = require('mongoose');

// Define movie schema
var screenSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {type: String, required: true, unique: true, index:true},
  seatInfo: {
      A : {
        numberOfSeats: {type: Number, required: true},
        aisleSeats: {type: Array, required: true},
        reserved: {type: Array}
      },
      B : {
        numberOfSeats: {type: Number, required: true},
        aisleSeats: {type: Array, required: true},
        reserved: {type: Array}
      },
      C : {
        numberOfSeats: {type: Number, required: true},
        aisleSeats: {type: Array, required: true},
        reserved: {type: Array}
      }
  }
});

screenSchema.pre('save', function (next) {
    next();
});

module.exports = mongoose.model('Movie', screenSchema);