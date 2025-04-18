const express = require("express")
const { uploadFile, deleteFile } = require("../controllers/fileController")
const upload = require("../middlewares/uploadMiddleware")

const router = express.Router()

router.post("/upload-file", upload.single("file"), uploadFile)
router.delete("/delete-file", deleteFile)

module.exports = router;