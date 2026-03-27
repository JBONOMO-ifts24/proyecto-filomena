const multer = require('multer');
const path = require('path');

// Usamos almacenamiento en memoria para procesar el archivo Excel directamente desde el buffer
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Aceptamos xlsx y xls
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ];
    
    if (mimetypes.includes(file.mimetype) || ext === '.xlsx' || ext === '.xls') {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se aceptan archivos Excel (.xlsx, .xls).'), false);
    }
};

const uploadExcel = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB para planillas de stock
    },
    fileFilter: fileFilter
});

module.exports = uploadExcel;
