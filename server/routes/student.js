const express = require('express'); 
const multer  = require('multer')
const db = require('../db');
//const path = require('path');

const router = express.Router();

router.get("/list", async (req, res) => {

    try {
      // let { pageSize, page } = req.query; // req.query로 값 가져오기
      // pageSize = parseInt(pageSize) || 5;
      // page = parseInt(page) || 0;

      let [list] = await db.query("SELECT * FROM STUDENT ");

      res.json({
        message: "ㅎㅇ",
        list: list,
       // count: count[0].cnt  // 👈 이거 중요
      });
    } catch (err) {
      console.error("에러 발생!", err);
      res.status(500).send("Server Error");
    }
  });

  router.get("/:stu_no", async (req, res) => {
    let {stu_no} = req.params;
    try {
        let [list] = await db.query("SELECT * FROM STUDENT WHERE STU_NO = ?", [stu_no]);




        res.json({
            message : "ㅎㅇ",
            info : list[0],
        });
    } catch (err) {
        console.error("에러 발생!", err);
        res.status(500).send("서버 오류");
    }
});

  module.exports = router;