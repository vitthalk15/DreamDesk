import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // Try to get token from cookie first
        let token = req.cookies.token;

        // If no token in cookie, try Authorization header
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            console.log('No token found in request');
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        try {
            const decode = await jwt.verify(token, process.env.SECRET_KEY);
            if (!decode) {
                console.log('Invalid token format');
                return res.status(401).json({
                    message: "Invalid token",
                    success: false
                });
            }
            req.id = decode.userId;
            next();
        } catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            return res.status(401).json({
                message: "Invalid token",
                success: false
            });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({
            message: "Authentication failed",
            success: false
        });
    }
}

export default isAuthenticated;