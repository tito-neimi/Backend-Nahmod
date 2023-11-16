const { Router } = require('express');
const router = Router();
const { changeUserPremium, uploadDocuments } = require('../../../controllers/user.controller.js');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define las carpetas de destino según el tipo de archivo
    let uploadPath = 'storage/documents'; // Carpeta predeterminada

    if (req.body.type === 'profile') {
      uploadPath = 'storage/profiles';
    } else if (file.fieldname === 'product') {
      uploadPath = 'storage/products';
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

router.get('/premium/:uid', changeUserPremium);

// Utiliza upload.fields para manejar múltiples archivos con distintas claves
router.post('/:uid/documents', upload.single('file'), uploadDocuments);

module.exports = router;
