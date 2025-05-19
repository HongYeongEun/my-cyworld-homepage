const express = require('express'); 
const multer  = require('multer')
const db = require('../db');
const path = require('path');
const router = express.Router();

router.get("/", async (req, res) => {

    try {


      let [list] = await db.query("SELECT * FROM tbl_board B INNER JOIN tbl_user U on B.USERID = U.USERID");

      res.json({
        message: "ㅎㅇ",
        list: list,

      });
    } catch (err) {
      console.error("에러 발생!", err);
      res.status(500).send("Server Error");
    }
  });


router.post("/", async (req, res) => {
  let {title, contents} = req.body;
  console.log(title, contents);
  try{
      let query = "INSERT INTO TBL_BOARD VALUES(NULL, ?, ?, 'user001', 0, NOW(), NOW())";
      let result = await db.query(query, [title, contents]);
      console.log("result==>", result);
      res.json({
          message : "success",
          result : result[0]
      });
  }catch(err){
      console.log("에러 발생!");
      res.status(500).send("Server Error");
  }
})

  router.get("/:boardNo", async (req, res) => {
    let {boardNo} = req.params;
    try {
        let [list] = await db.query("SELECT * FROM tbl_board B INNER JOIN tbl_user U on B.USERID = U.USERID");
         let [cnt] = await db.query("UPDATE TBL_BOARD SET CNT = CNT + 1 WHERE BOARDNO = ?", [boardNo]);

        res.json({
            message : "ㅎㅇ",
            info : list[0],
            cnt : cnt
        });
    } catch (err) {
        console.error("에러 발생!", err);
        res.status(500).send("서버 오류");
    }
});

router.put("/:boardNo", async (req, res) => {
  let {boardNo} = req.params;
  let {title, contents} =  req.body;
  
  console.log(title, contents);

  try {
    let query = "UPDATE TBL_BOARD SET " +"title=?, contents=?"
    + "WHERE boardNo = ?" ;
    let [list] = await db.query(query, [title, contents,boardNo]);
    //console.log(list);

    res.json({
      message : "수정되었습니다.",
      list : list
    });
  } catch (err) {
    console.log("에러 발샹!")
    res.status(500).send("Server Error")
  }
})


router.delete("/:boardNo" , async (req, res) => { //콜백함수 실행전에 authMiddleware 이거 실행
  let { boardNo } = req.params; // URL에서 productId 가져옴

  try {
      let [result] = await db.query("DELETE FROM TBL_BOARD WHERE BOARDNO = " + boardNo); // Prepared Statement 사용
      res.json({
          message: "삭제 성공!",
          result: result // 삭제 결과 반환
      });
  } catch (err) {
      console.log("에러 발생!", err);
      res.status(500).send("Server Error");
  }
});
  module.exports = router;