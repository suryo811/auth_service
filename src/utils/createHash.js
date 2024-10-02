import crypto from 'crypto';

const hashString = (val) => {
    return crypto.createHash('md5').update(val).digest('hex');
}

export default hashString;