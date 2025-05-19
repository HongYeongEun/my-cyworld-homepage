const express = require('express') 
const db = require('./db')
const productRouter = require('./routes/product')
const userRouter = require('./routes/user')
const loginRouter = require('./routes/login')
const feedRouter = require('./routes/feed')
const studentRouter = require('./routes/student')
const memberRouter = require("./routes/member")
const snsFeed = require("./routes/sns/feed")
const membercy = require("./routes/cyworld/member")
const commentRouter = require("./routes/cyworld/comment")
const postRouter = require("./routes/cyworld/posts")
const photosRouter = require("./routes/cyworld/photos")
const homeRouter = require("./routes/cyworld/home")
const friendsRouter = require("./routes/cyworld/friends")


const cors = require('cors')
const session = require('express-session')

const app = express()
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],  // 허용할 도메인 설정
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // 허용할 HTTP 메소드 설정
  allowedHeaders: ['Content-Type', 'Authorization'],  // 허용할 헤더 설정
  credentials: true  // 쿠키와 자격 증명을 허용
}));



app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(session({
    secret: 'test1234',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly : true,
        secure: false,
        maxAge : 1000 * 60 * 60
    }
  }))
app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/login", loginRouter);
app.use("/student", studentRouter);

app.use("/feed", feedRouter);
app.use("/member", memberRouter);
app.use("/sns-feed", snsFeed);
app.use("/membercy", membercy);
app.use("/comment", commentRouter);
app.use("/posts", postRouter);
app.use("/photos", photosRouter);
app.use("/home", homeRouter);
app.use("/friends", friendsRouter);



app.listen(3005, () => {
    console.log("서버 실행 중!");
})