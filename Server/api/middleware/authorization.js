/* eslint-disable camelcase */
import { verifyToken } from '../util/auth.js';

import User from '../models/user.js';

// express.js middleware for verifying user token
const verifyUsers = async (req, res, next) => {

    const { authorization } = req.headers;
    console.log(req.headers);

    try {
        if (!authorization) {
            return res.status(401).json({ error: 'Unauthorized: no token provided' });
        }

        const [token_type, token] = authorization.split(' ');
        console.log(token_type, token);

        if (token_type !== 'Bearer' || !token) {
            return res.status(401).json({ error: 'Unauthorized: invalid token format' });
        }

        const verified = verifyToken(token);
        console.log('Verified Token:', verified);

        if (!verified) {
            return res.status(401).json({ error: 'Unauthorized: token is invalid or expired' });
        }

        const exists = await User.exists({ _id: verified.user_id });
        if (!exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        req.verified = verified;
        console.log('req.verified:', req.verified);

        // pass control to the next middleware or to route handler
        next();
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

export { verifyUsers };
