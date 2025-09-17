require('dotenv').config(); 
const express = require('express');  
const cookieParser = require('cookie-parser'); 
const cors = require('cors'); 
const connectToDb = require('./database/db')
const authRoute = require('./routes/authRoute');
const userRoute  = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000; 

// Middleware

// Parse incoming requests with JSON payloads
app.use(express.json()); 

// "credentials: true" allows cookies and authorization headers to be sent
app.use(cors({
    origin : 'https://mern-auth-service-frontend.onrender.com',
    credentials : true // Allows cookies and authorization headers . 
})); 

// Parse cookies from the request headers, making them accessible via req.cookies
app.use(cookieParser());
app.use('/auth/api',authRoute);
app.use('/api',userRoute);

connectToDb();

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
});
