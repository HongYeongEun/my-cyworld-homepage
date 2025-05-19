const express = require('express'); 
const db = require('../db');
const router = express.Router();

router.get("/", async (req, res) => {
    try {
  
      let sql = "SELECT * FROM TBL_FEED WHERE ID = " + id;
      let imgsql = "SELECT * FROM TBL_FEED_IMG WHERE FEEDID = " + id;
      let [list] = await db.query(sql);
      let [imgList] = await db.query(imgsql);
      res.json({
        message: "ㅎㅇ",
        feed: list[0],
        imgList : imgList
      });
    } catch (err) {
      console.error("에러 발생!", err);
      res.status(500).send("Server Error");
    }
  });

module.exports = router;