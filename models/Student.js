const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "STUDENT",
    enum: ["STUDENT"],
  },
  department: {
    type: String,
    required: true,
    default: ""
  },
  semester: {
    type: Number,
    required: true,
    default: 0,
    min: 1,
    max: 8,
  },
  gender: {
    type: String,
    default: ""
  },
  dob: {
    type: Date,
    default: null
  },
  phone: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    default: ""
  },
  address: {
    addressLine1: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zipcode: { type: String, default: "" },
  },
  profileDetails: {
    profileUrl: {
      type: String,
      default: "",
    },
    uploadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UploadFile",
    },
  },
  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],
  hod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hod",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
