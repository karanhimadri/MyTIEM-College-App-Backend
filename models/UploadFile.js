const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  publicUrl: {
    type: String,
    required: true,
    default: ""
  },
  filename: {
    type: String, // Cloudinary filename used for deletion
    required: true,
    default: ""
  },
  fileType: {
    type: String, // "image" | "pdf" | "video"
    required: true,
    default: "image"
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Upload_File', uploadSchema);
