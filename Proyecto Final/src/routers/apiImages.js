import express from 'express';
import multer from "multer"
import { uploadFileController } from '../controllers/uploadFiles.js';

const routerApiImages = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        const nombreFinal = `${Date.now()}-foto-${file.originalname}`
        cb(null, nombreFinal)
    }
})

const upload = multer({ storage })

routerApiImages.post('/images', upload.single('image'), uploadFileController)

export default routerApiImages