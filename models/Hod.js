const mongoose = require('mongoose');

const hodSchema = new mongoose.Schema({
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
    default: "HOD",
    enum: ["HOD"],
  },
  classSchedules: {
    semester: {
      type: Number,
      default: 0,
      min: 0,
      max: 8
    },
    section_A: {
      scheduleUrl: {
        type: String,
        default: ""
      },
      uploadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UploadFile"
      }
    },
    section_B: {
      scheduleUrl: {
        type: String,
        default: ""
      },
      uploadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UploadFile"
      }
    }
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
  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },
  ],
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
  ],
});

module.exports = mongoose.model('Hod', hodSchema);

