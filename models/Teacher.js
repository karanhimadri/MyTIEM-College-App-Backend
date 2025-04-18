const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "TEACHER",
    enum: ["TEACHER"],
  },
  announcements: [
    {
      message: {
        type: String,
        required: true,
        default: ""
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
  ],
  hod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hod',
    required: true,
  },
});

module.exports = mongoose.model('Teacher', teacherSchema);

