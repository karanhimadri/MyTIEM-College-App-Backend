const { cloudinary } = require("../config/cloudinary")

// Upload file
const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { path, filename, originalname, mimetype, size } = req.file;
    return res.status(200).json({
      message: 'File uploaded successfully',
      url: path,
      filename: filename,
      originalName: originalname,
      type: mimetype,
      sizeInBytes: size,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

// Delete file
const deleteFile = async (req, res) => {
  try {
    const { filename, fileType } = req.body; // Expect fileType: "image" | "raw" (PDFs, docs, etc.)

    if (!filename || !fileType) {
      return res.status(400).json({ message: 'Filename and fileType are required' });
    }

    if (!['image', 'video', 'raw'].includes(fileType)) {
      return res.status(400).json({ message: 'Invalid fileType. Use "image", "video", or "raw".' });
    }

    const result = await cloudinary.uploader.destroy(filename, {
      resource_type: fileType,
    });

    if (result.result !== 'ok') {
      return res.status(400).json({ message: 'Failed to delete file', cloudinaryResponse: result });
    }

    return res.status(200).json({ message: 'File deleted successfully', cloudinaryResponse: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Deletion failed', error: err.message });
  }
};

module.exports = {
  uploadFile,
  deleteFile
};
