const crypto = require('crypto');

const generateKey = () => {
    return crypto.randomBytes(32).toString('hex'); // 256 bits
};

const calculateHMAC = (key, message) => {
    const hmac = crypto.createHmac('sha256', Buffer.from(key, 'hex'));
    hmac.update(message);
    return hmac.digest('hex');
};

module.exports = {generateKey, calculateHMAC}