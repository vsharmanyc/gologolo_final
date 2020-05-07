var mongoose = require('mongoose');

var LogoSchema = new mongoose.Schema({
  email: String,
  password: String,
  logos: [{
    id: String,
    images: [{
      link: String,
      x: Number,
      y: Number
    }],
    texts: [{
      text: String,
      color: String,
      fontSize: { type: Number, min: 2, max: 144 },
      x: Number,
      y: Number
    }],
    backgroundColor: String,
    borderColor: String,
    borderRadius: { type: Number, min: 0 },
    borderWidth: { type: Number, min: 0 },
    padding: { type: Number, min: 0 },
    margin: { type: Number, min: 0 },
    lastUpdate: { type: Date, default: Date.now },
  }]
});

module.exports = mongoose.model('Logo', LogoSchema);