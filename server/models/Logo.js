var mongoose = require('mongoose');

var LogoSchema = new mongoose.Schema({
  email: String,
  password: String,
  signedIn: Boolean,
  logos: [{
    id: String,
    workName: String,
    images: [{
      link: String,
      x: Number,
      y: Number,
      height: Number,
      width: Number
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