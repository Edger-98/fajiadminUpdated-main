const multer = require('multer');
const path = require('path');

// Define storage for the uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/Images'); // Directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname)); // Create a unique filename
  }
});

const upload = multer({ storage: storage });

module.exports = upload;