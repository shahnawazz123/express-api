import express from "express";
import multer from 'multer';
import UserController from '../controllers/userController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';
import ExcelController from "../controllers/ExcelController.js";
import PdfController from "../controllers/pdfController.js";


const router = express.Router();


// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Public routes
router.post('/register', UserController.userRegistration);
router.post('/login', UserController.userLogin);
router.get('/export', ExcelController.exportToExcel);
router.post('/import', upload.single('file'), ExcelController.importFromExcel);
router.get('/generate-pdf', PdfController.generatePdf);

// Protected route with middleware
router.post('/change-user-password', checkUserAuth, UserController.changeUserPassword);

export default router;
