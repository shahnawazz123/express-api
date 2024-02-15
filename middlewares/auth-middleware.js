import jwt from 'jsonwebtoken';



const checkUserAuth = async (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;

    if (token && token.startsWith('Bearer')) {
        try {
            const userdetails = userModel.findById(1);
            token = token.slice(7); // Remove 'Bearer ' from the token
            // Verify token
            const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
            // Get user from MySQL database
            const [rows] = await connection.execute('SELECT id, username, email FROM users WHERE id = ?', [userId]);

            if (rows.length === 0) {
                return res.status(401).json({
                    status: 'failed',
                    message: 'Unauthorized user, invalid token.',
                    result: null
                });
            }

            const user = rows[0];
            // Exclude password field or any other sensitive information
            delete user.password;

            // Attach user object to the request
            req.user = user;
            next();

        } catch (error) {
            console.log(error);
            return res.status(401).json({
                status: 'failed',
                message: 'Unauthorized user, invalid token.',
                result: null
            });
        }
    } else {
        res.status(401).json({
            status: 'failed',
            message: 'Unauthorized user, no token.',
            result: null
        });
    }
}

export default checkUserAuth;
