const mongoose = require('mongoose')


const hikingTrailSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'], required: true },
    distance: { type: Number, required: true },
    elevationGain: { type: Number },
    description: String,
    imageUrl: String,
    createdAt: { type: Date, default: Date.now }
  });
  

const HikingTrail = mongoose.model('HikingTrail', hikingTrailSchema);
module.exports = HikingTrail;
