const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  todayVisits: { type: Number, default: 0 },
  totalVisits: { type: Number, default: 0 },
  lastVisitDate: { type: String, default: '' }
});

module.exports = mongoose.model('Visitor', visitorSchema);
