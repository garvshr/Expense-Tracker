const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in cookies (accessToken)
        if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        } 
        // Fallback to Authorization header
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized to access this route" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: "Token is invalid or expired" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
