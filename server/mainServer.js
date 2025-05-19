const express = require('express');
const db = require('./db');
const productRouter = require('./routes/product')
const userRouter = require('./routes/user')
const loginRouter = require('./routes/login');
const feedRouter = require('./routes/feed');
const path = require('path');
const cors = require('cors') 
var session = require('express-session')

const app = express()
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
    origin : "http://localhost:3000",
    credentials : true
}))
app.use(session({
    secret: 'test1234',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly : true,
        secure: false ,
        maxAge : 1000 * 60 * 30
    }
}))


app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/login", loginRouter);

app.use("/feed", feedRouter);

app.listen(3005, ()=>{
    console.log("서버 실행 중!"); 
})