const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Number of QR codes to generate
const NUM_CODES = 20;

// Ensure "qrcodes" folder exists
if (!fs.existsSync('qrcodes')) fs.mkdirSync('qrcodes');

// Create PDF Document
const doc = new PDFDocument({ size: 'A4', margin: 50 });
const pdfPath = 'qrcodes/qr_codes.pdf';
doc.pipe(fs.createWriteStream(pdfPath));

async function generateQRCodes() {
    const qrSize = 150;  // QR code size
    const colCount = 3;  // 3 QR codes per row
    const rowSpacing = 250; // Increased vertical spacing
    const colSpacing = 200; // Horizontal spacing
    const pageHeight = doc.page.height - 100; // Account for margins
    let x = 60, y = 80; // Starting position with margin

    for (let i = 1; i <= NUM_CODES; i++) {
        const uniqueId = `INVITE-${i}-${Date.now()}`;

        // Save QR code as an image
        const qrPath = `qrcodes/qrcode-${i}.png`;
        await QRCode.toFile(qrPath, uniqueId, { width: qrSize });

        // Load QR code into PDF
        doc.image(qrPath, x, y, { width: qrSize });

        // Add text label under QR code
        doc.fontSize(14).text(`Code: ${uniqueId}`, x, y + qrSize + 10, {
            align: 'center',
            width: qrSize
        });

        // Arrange layout (3 QR codes per row)
        x += colSpacing;

        // If 3 QR codes are placed, move to next row
        if (i % colCount === 0) {
            x = 60; // Reset X position
            y += rowSpacing; // Move to next row
        }

        // If the next row exceeds the page height, add a new page
        if (y + rowSpacing > pageHeight) {
            doc.addPage(); // Add new page
            x = 60; 
            y = 80; // Reset position for new page
        }
    }

    doc.end(); // Finish PDF
    console.log(`✅ QR codes saved & printable PDF created: ${pdfPath}`);
}

generateQRCodes();
