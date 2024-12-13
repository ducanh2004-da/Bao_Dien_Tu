// const mysql = require('mysql2');
// const dotenv = require('dotenv');

// dotenv.config();

// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// })

// db.connect((err)=>{
//     if(err) throw err;
//     console.log('Kết nối thành công DB');
// })

// module.exports = db;

<<<<<<< HEAD
const mysql = require('mysql2');
const dotenv = require('dotenv');
=======
const mysql = require("mysql2");
const dotenv = require("dotenv");
>>>>>>> 1095213 (Hoan thien dang ki dang nhap,admin,guest,editor,writer)

dotenv.config();

// Tạo connection pool thay vì một kết nối đơn
const db = mysql.createPool({
<<<<<<< HEAD
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,  // Chờ đợi kết nối nếu tất cả kết nối đều đang sử dụng
    connectionLimit: 10,       // Giới hạn số lượng kết nối tối đa
    queueLimit: 0              // Không giới hạn số lượng truy vấn trong hàng đợi
=======
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "baodientu",
  // Không giới hạn số lượng truy vấn trong hàng đợi
>>>>>>> 1095213 (Hoan thien dang ki dang nhap,admin,guest,editor,writer)
});

// Kiểm tra kết nối đến MySQL
db.getConnection((err, connection) => {
<<<<<<< HEAD
    if (err) {
        console.error('Lỗi kết nối DB:', err);
        throw err;
    }
    console.log('Kết nối thành công DB');
    connection.release();  // Giải phóng kết nối sau khi kiểm tra
=======
  if (err) {
    console.error("Lỗi kết nối DB:", err);
    throw err;
  }
  console.log("Kết nối thành công DB");
  connection.release(); // Giải phóng kết nối sau khi kiểm tra
>>>>>>> 1095213 (Hoan thien dang ki dang nhap,admin,guest,editor,writer)
});

module.exports = db;
