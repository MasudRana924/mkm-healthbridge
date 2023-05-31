const mongoose = require("mongoose");

const hireNurseSchema = new mongoose.Schema({

  nursename: {
    type: String,
  },
  nursefees: {
    type: Number,

  },
  nurseimage: {
    type: String,
  },
  nurseId: {
    type: mongoose.Schema.ObjectId,
    ref: "Doctor",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  fees: {
    type: Number,
    required: true,
    default: 0,
  },
  patientname: {
    type: String,
  },
  patientemail: {
    type: String,
  },
  patientgender: {
    type: String,
  },
  date: {
    type: String,
  },
  totalFees: {
    type: Number,
    required: true,
    default: 0,
  },
  bookingStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Hire", hireNurseSchema);