import PdfModel from '../models/pdfModel.js';

class PdfController {
    static async generatePdf(req, res) {
        try {
            const pdfBuffer = await PdfModel.generatePasswordProtectedPdf();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename=output.pdf');
            res.send(pdfBuffer);
        } catch (error) {
            console.error('Error generating PDF:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

export default PdfController;
