import PDFDocument from 'pdfkit';
import encryption from 'pdf-encrypt';
import stream from 'stream';

class PdfModel {
    static async generatePasswordProtectedPdf() {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            doc.text('Hello, this is a password-protected PDF!');

            const password = 'node';
            const encryptionOptions = {
                password,
                ownerPassword: '1122', // Optional
                permissions: {
                    printing: true,
                    modifying: false,
                    copying: false,
                    annotating: false,
                    fillingForms: false,
                    contentAccessibility: false,
                    documentAssembly: false,
                },
            };

            const chunks = [];
            const writeStream = new stream.Writable({
                write(chunk, encoding, callback) {
                    chunks.push(chunk);
                    callback();
                },
            });

            writeStream.on('finish', () => {
                const pdfBuffer = Buffer.concat(chunks);
                resolve(pdfBuffer);
            });

            const encryptedStream = encryption.encrypt(doc, encryptionOptions);
            encryptedStream.pipe(writeStream);
            doc.end();
        });
    }
}

export default PdfModel;
