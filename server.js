const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
//importing routers
const userRouter = require('./routers/userRouters');
const teacherRouter = require('./routers/teacherRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const bookRoutes = require('./routers/book-routes');
const billRoutes = require('./routers/bill-routes');

//express app
const app = express();


//middleware & static files
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
    })

//routers
app.use('/api/user', userRouter);
app.use('/api/teachers', teacherRouter);
app.use('/api/books', bookRoutes);
app.use('/api/bills', billRoutes);
//connect to mongodb
mongoose.connect(process.env.MONGO_URI) 
    .then(()=>{
        //lissening for request
        app.listen(process.env.PORT, () => {
            console.log('connect to the db & listening for request on port ', process.env.PORT);
        })
    })
    .catch((err)=>{console.log(err)});

// Error middleware
app.use(errorHandler);