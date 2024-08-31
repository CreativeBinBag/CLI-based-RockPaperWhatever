const crypto = require('crypto');

export const generateKey = () => {
    return crypto.randomBytes(32).toString('hex'); // 256 bits
};

export const calculateHMAC = (key, message) => {
    const hmac = crypto.createHmac('sha256', Buffer.from(key, 'hex'));
    hmac.update(message);
    return hmac.digest('hex');
};
