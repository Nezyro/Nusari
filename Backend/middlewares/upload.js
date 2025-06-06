const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear carpeta si no existe
const dir = path.join(__dirname, '../uploads/artworks');
fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, filename);
  }
});

const upload = multer({ storage });
module.exports = upload;
