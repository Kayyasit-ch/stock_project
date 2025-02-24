const Koa = require('koa');
const Router = require('koa-router');
const mysql = require('mysql2');
const bodyParser = require('koa-bodyparser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // ใช้สร้าง Token
const cors = require('@koa/cors');

const app = new Koa();
const router = new Router();
const secretKey = 'your_secret_key'; // เปลี่ยนเป็นคีย์ลับจริงในโปรเจค

// สร้างการเชื่อมต่อฐานข้อมูล
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'freenix1',
  database: 'login',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ใช้ Middleware
app.use(bodyParser());
app.use(cors());

// ✅ **API สมัครสมาชิก (Register)**
router.post('/api/register', async (ctx) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { message: 'กรุณากรอกข้อมูลให้ครบ' };
    return;
  }

  try {
    // ตรวจสอบชื่อผู้ใช้ในฐานข้อมูล
    const [rows] = await pool.promise().query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (rows.length > 0) {
      ctx.status = 400;
      ctx.body = { message: 'ชื่อผู้ใช้นี้มีผู้ใช้งานแล้ว' };
      return;
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.promise().query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    ctx.body = { message: 'สมัครสมาชิกสำเร็จ', userId: result.insertId };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { message: 'เกิดข้อผิดพลาด', error: err.message };
  }
});

// ✅ **API ล็อกอิน (Login)**
router.post('/api/login', async (ctx) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { message: 'กรุณากรอกข้อมูลให้ครบ' };
    return;
  }

  try {
    // ค้นหาผู้ใช้ในฐานข้อมูลตามชื่อผู้ใช้
    const [rows] = await pool.promise().query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    // หากไม่พบผู้ใช้
    if (rows.length === 0) {
      ctx.status = 401;
      ctx.body = { message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
      return;
    }

    const user = rows[0];
    
    // เปรียบเทียบรหัสผ่านที่กรอกกับรหัสผ่านที่เก็บในฐานข้อมูล
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      ctx.status = 401;
      ctx.body = { message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
      return;
    }

    // สร้าง Token JWT
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, {
      expiresIn: '1h'
    });

    ctx.body = { message: 'เข้าสู่ระบบสำเร็จ', token };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { message: 'เกิดข้อผิดพลาด', error: err.message };
  }
});

// ใช้งาน API
app.use(router.routes()).use(router.allowedMethods());

// เริ่มเซิร์ฟเวอร์
app.listen(3001, () => {
  console.log('Login & Register API running on http://localhost:3001');
});
