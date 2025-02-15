const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors({
    origin: 'https://qr-code-jn3w-black.vercel.app'
}));


let usedCodes = {}; // Store used QR codes

// Verify QR Code at Entrance
app.post('/verify-qr', (req, res) => {
    const { qrCode } = req.body;

    if (!qrCode) {
        return res.status(400).json({ message: 'QR Code is required' });
    }

    if (usedCodes[qrCode]) {
        return res.status(403).json({ message: 'QR Code has already been used!' });
    }

    // Assign a seat number
    const seatNumber = `Seat-${Object.keys(usedCodes).length + 1}`;

    // Mark QR code as used
    usedCodes[qrCode] = seatNumber;

    res.status(200).json({
        message: `Welcome! Your seat number is ${seatNumber}. Enjoy the event!`,
        seatNumber,
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
