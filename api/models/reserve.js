const mongoose = require('mongoose');

// Define movie schema
var reserveSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true, index:true},
  seats: {
      A : {type: String},
      B : {type: String},
      C : {type: String}
  },
  success: false
});

reserveSchema.pre('save', function (next) {
    var str0 = this.seats.A.toString();
    var str1 = this.seats.B.toString();
    var str2 = this.seats.D.toString();
    this.seats.A = str0.split(',');
    this.seats.B = str1.split(',');
    this.seats.D = str2.split(',');

    this.seats.A = this.seats.A.map(function (x) { 
        return parseInt(x, 10); 
    });
    this.seats.B = this.seats.A.map(function (x) { 
        return parseInt(x, 10); 
    });
    this.seats.D = this.seats.A.map(function (x) { 
        return parseInt(x, 10); 
    });

    next();
});

module.exports = mongoose.model('Reserve', reserveSchema);