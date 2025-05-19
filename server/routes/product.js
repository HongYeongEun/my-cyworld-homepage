const express = require('express'); 
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const db = require('../db');
const authMiddleware  = require('../auth');
const path = require('path');


const router = express.Router();

router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 파일 업로드 및 DB 저장
router.post('/profile', upload.single('avatar'), async function (req, res, next) {
    try {
        const file = req.file;
        const { productId } = req.body;

        if (!file) return res.status(400).send("파일이 업로드되지 않았습니다.");

        let sql = `INSERT INTO tbl_product_file (productId, fileName, filePath) VALUES (?, ?, ?)`;
        let values = [productId, file.originalname, file.path];

        await db.query(sql, values);

        res.send("파일 업로드 및 DB 저장 완료!");
    } catch (err) {
        console.error("에러 발생!", err);
        res.status(500).send("서버 오류");
    }
});

  

// router.get("/list", async (req, res) => {
//     let {pageSize, offset} = req.query;
//     try {
//       // let { pageSize, page } = req.query; // req.query로 값 가져오기
//       // pageSize = parseInt(pageSize) || 5;
//       // page = parseInt(page) || 0;
//       let sql = "SELECT * FROM TBL_PRODUCT LIMIT ? OFFSET ?";
//       let [list] = await db.query(sql, [parseInt( pageSize), parseInt(offset)]);
//       let [count] = await db.query("SELECT COUNT(*) AS cnt FROM TBL_PRODUCT");
//       res.json({
//         message: "ㅎㅇ",
//         list: list,
//         count: count[0].cnt  // 👈 이거 중요
//       });
//     } catch (err) {
//       console.error("에러 발생!", err);
//       res.status(500).send("Server Error");
//     }
//   });
  

router.get("/", async (req, res) => {
  try {

    let sql = "SELECT * FROM TBL_PRODUCT";
    let [list] = await db.query(sql);
    let [count] = await db.query("SELECT COUNT(*) AS cnt FROM TBL_PRODUCT");
    res.json({
      message: "ㅎㅇ",
      list: list,
      count: count[0].cnt  // 👈 이거 중요
    });
  } catch (err) {
    console.error("에러 발생!", err);
    res.status(500).send("Server Error");
  }
});
 

  
  router.post("/", upload.single("file"), async (req, res) => {
    const { productName, description, price, stock, category } = req.body;
    const file = req.file;
  
    try {
      // 1. 상품 등록
      const productInsertSql = `
        INSERT INTO TBL_PRODUCT 
        VALUES (NULL, ?, ?, ?, ?, ?, 'Y', NOW(), NOW())
      `;
      const [productResult] = await db.query(productInsertSql, [productName, description, price, stock, category]);
  
      // 2. 파일 등록
      if (file) {
        const fileInsertSql = `
          INSERT INTO tbl_product_file (productId, fileName, filePath)
          VALUES (?, ?, ?)
        `;
        await db.query(fileInsertSql, [
          productResult.insertId,
          file.originalname,
          file.path
        ]);
      }
  
      res.json({
        message: "상품 및 파일 등록 완료!",
        productId: productResult.insertId
      });
  
    } catch (err) {
      console.error("에러 발생!", err);
      res.status(500).send("서버 오류");
    }
  });
  
  router.put("/:productId", async (req, res) => {
    let {productName, description, price, stock, category} =  req.body;
    let {productId} = req.params;
    console.log(productName, description, price, stock, category);
  
    try {
      let query = "UPDATE TBL_PRODUCT SET " +"productName=?, description=?, price=?, stock=?, category=? "
      + "WHERE productId = ?" ;
      let [list] = await db.query(query, [productName, description, price, stock, category]);
      //console.log(list);
  
      res.json({
        message : "ㅎㅇ",
        list : list
      });
    } catch (err) {
      console.log("에러 발샹!")
      res.status(500).send("Server Error")
    }
  })
  
  router.delete("/:productId",authMiddleware , async (req, res) => { //콜백함수 실행전에 authMiddleware 이거 실행
    let { productId } = req.params; // URL에서 productId 가져옴
  
    try {
        let [result] = await db.query("DELETE FROM TBL_PRODUCT WHERE PRODUCTID = " + productId); // Prepared Statement 사용
        res.json({
            message: "삭제 성공!",
            result: result // 삭제 결과 반환
        });
    } catch (err) {
        console.log("에러 발생!", err);
        res.status(500).send("Server Error");
    }
  });
  
  
  router.get("/:productId", async (req, res) => {
    let {productId} = req.params;
    try {
        let [list] = await db.query("SELECT * FROM TBL_PRODUCT WHERE PRODUCTID = ?", [productId]);
        let [fileList] = await db.query("SELECT * FROM TBL_PRODUCT_FILE WHERE PRODUCTID = ?", [productId]);

        // 파일 경로를 완전한 URL로 변환
        fileList = fileList.map(file => ({
            ...file,
            filePath: `http://localhost:3000/uploads/${path.basename(file.filePath)}`
        }));

        res.json({
            message : "ㅎㅇ",
            info : list[0],
            files: fileList
        });
    } catch (err) {
        console.error("에러 발생!", err);
        res.status(500).send("서버 오류");
    }
});


  module.exports = router;