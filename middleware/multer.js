import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storageDir = 'uploads/';

// Si no existe la carpeta, la crea
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storageDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Combina el nombre con la extension correctamente
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

export default upload;
