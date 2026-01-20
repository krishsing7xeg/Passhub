const QRCode = require("qrcode");

exports.generateQR = async (payload) => {
  try {
    
    const qrData = `${payload.passId}|${payload.qrToken}`;
    
    const qrImage = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'M',  // Medium error correction (25% recovery)
      type: 'image/png',           // PNG format
      quality: 0.92,               // High quality
      margin: 1,                   // Minimal margin (1 module)
      width: 300,                  // 300x300 pixels
      color: {
        dark: '#000000',           // Black QR code
        light: '#FFFFFF'           // White background
      }
    });
    
    // Log success and size
    const imageSizeKB = (qrImage.length * 0.75 / 1024).toFixed(2);
    return qrImage;
    
  } catch (error) {
    throw new Error("Failed to generate QR code");
  }
};

exports.parseQR = (qrData) => {
  try {
    const [passId, qrToken] = qrData.split('|');
    
    if (!passId || !qrToken) {
      throw new Error('Invalid QR format');
    }
    
    return { passId, qrToken };
    
  } catch (error) {
    console.error("❌ QR parsing error:", error);
    throw new Error("Invalid QR code format");
  }
};

exports.isValidQRFormat = (qrData) => {
  if (!qrData || typeof qrData !== 'string') {
    return false;
  }
  
  const parts = qrData.split('|');
  
  if (parts.length !== 2) {
    return false;
  }
  
  const [passId, token] = parts;
  
  if (!passId || passId.length !== 24) {
    return false;
  }
  
  if (!token || token.length !== 36) {
    return false;
  }
  
  return true;
};
