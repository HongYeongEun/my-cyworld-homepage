const express = require('express') 
const db = require('../db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const path = require('path');
//파일 업로드 패키지 추가
const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
  
const JWT_KEY = "show-me-the-money";
const upload = multer({ storage });
router.post("/", async (req, res) => {
    const { email, pwd } = req.body;
  
    try {
      const sql = "SELECT email, userName, phone, pwd FROM TBL_MEMBER WHERE EMAIL = ?";
      const [user] = await db.query(sql, [email]);
  
      if (user.length > 0) {
        const isMatch = await bcrypt.compare(pwd, user[0].pwd);
  
        if (isMatch) {
          const payload = {
            sessionEmail: user[0].email,
            sessionName: user[0].userName,
            sessionPhone: user[0].phone
          };
          const token = jwt.sign(payload, JWT_KEY, { expiresIn: "1h" });
  
          return res.json({
            success: true,
            message: "로그인 성공",
            token: token,
            user: payload
          });
        } else {
          return res.json({
            success: false,
            message: "비밀번호가 틀렸습니다"
          });
        }
      } else {
        return res.json({
          success: false,
          message: "아이디 확인"
        });
      }
    } catch (err) {
      console.error("에러 발생!", err);
      res.status(500).send("Server Error");
    }
  });
  
  

  // 프로필 이미지 업로드
  router.post('/upload', upload.single('file'), async (req, res) => {
    let {email} = req.body;
    const filename = req.file.filename; 
    const destination = req.file.destination; 
    try{
        let query = "UPDATE TBL_MEMBER SET PROFILEIMG = ? WHERE EMAIL = ?";
        let result = await db.query(query, [destination+filename, email]);
        
        res.json({
            message : "result",
            result : result
        });
    } catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
});

  router.get("/:email", async (req, res) => {
    let {email} = req.params;
    try {
        let [list] = await db.query("SELECT * FROM TBL_MEMBER WHERE EMAIL = ?", [email]);



        res.json({
            message : "ㅎㅇ",
            info : list[0]
        });
    } catch (err) {
        console.error("에러 발생!", err);
        res.status(500).send("서버 오류");
    }
});

router.post("/join", async (req, res) => {
    let { email, pwd, userName, addr, phone, birth, intro } = req.body;
  
    try {
      let hashPwd = await bcrypt.hash(pwd, 10);
      let sql = "INSERT INTO TBL_MEMBER VALUES(?,?,?,?,?, ?,?, null,NOW(),NOW())";
      let [user] = await db.query(sql, [email, pwd, userName, addr, phone, birth, intro]);
      let result = {
        
      };
      
      res.json({
        result
      });
    } catch (err) {
      console.error("에러 발생!", err);
      res.status(500).send("Server Error");
    }
  });

  

  module.exports = router;