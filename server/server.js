require('dotenv').config(); 
const express = require('express');  
const cookieParser = require('cookie-parser'); 
const cors = require('cors'); 
const connectToDb = require('./database/db')
const authRoute = require('./routes/authRoute');
const userRoute  = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000; 

//Middleware
app.use(express.json()); 
app.use(cors({
    Credential : true // Allows cookies and authorization headers . 
})); 
app.use(cookieParser());

app.use('/auth/api',authRoute);
app.use('/api',userRoute);

connectToDb();

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
});
