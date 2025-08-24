const jwt = require('jsonwebtoken');
const authMiddleware = (req,res,next) =>  {
    try{
        //Extract the token from the cookie or the headers 
        const token = req.headers["authorization"]?.split(' ')[1] || req.cookies.token ; 
        if(!token) {
                 res.status(403).json({
                success : false, 
                message : 'Unauthorized : no token provided'
            })
        }; 
        //Verify the token.
        jwt.verify(token,process.env.JWT_SECRET, (err,decoded) => {
            if(err) {
                    return res.status(403).json({
                    success : false, 
                    message: 'Access denied : invalide or expired token. '
                })
            }; 
            //Attach the user's data to the request
            req.user = decoded 
            console.log('token : ',decoded); 
            next()
        });
    }catch(error){
        console.error('Error from authentication middleware'); 
        res.status(500).json({
            success : false, 
            message: "Internal server error occurred. Please try again later."
        });
    };
};
module.exports = {authMiddleware};