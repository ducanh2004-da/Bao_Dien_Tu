require('dotenv').config();

const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const crypto = require('crypto');
const bodyParser = require("body-parser");
const path = require("path");
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const upload = require('multer')();

// Initialize Passport strategies
require('./config/passport');

// Custom middlewares
const authMiddleware         = require('./middlewares/auth');
const { updateScheduledPosts } = require('./middlewares/publishPost');

// Route imports
const mainRoutes = require("./routes/main");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const editorRoutes = require("./routes/editor.js");
const homeRoutes = require("./routes/home.js");
const writerRoutes = require("./routes/writer.js");

const app = express();
const PORT = process.env.PORT || 5000;

//====================
// Publish scheduled posts on startup
//====================
updateScheduledPosts();

//====================
// Security & performance middleware
//====================
app.use((req, res, next) => {
  res.locals.nonce = require('crypto').randomBytes(32).toString('hex');
  next();
});
// CSP (Chính sách bảo mật nội dung) để ngăn chặn các cuộc tấn công XSS (Cross-Site Scripting)
// và các cuộc tấn công khác bằng cách chỉ cho phép tải nội dung từ các nguồn đáng tin cậy       
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://cdnjs.cloudflare.com",
        "https://cdn.jsdelivr.net",
        "https://code.jquery.com",
        "https://unpkg.com",
        (req, res) => `'nonce-${res.locals.nonce}'`,
      ],
      styleSrc: [
        "'self'",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com",
        "https://cdn.jsdelivr.net",
        (req, res) => `'nonce-${res.locals.nonce}'`,
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com",
        "https://cdn.jsdelivr.net"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https://trusted-cdn.com" // Thay bằng domain thực tế của bạn
      ],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],  // Đã sửa tên directive
      formAction: ["'self'"],      // Đã sửa tên directive
      baseUri: ["'self'"],
      scriptSrcAttr: ["'none'"],
      styleSrcAttr: ["'none'"]
    },
    reportOnly: false,
    setAllHeaders: true
  })
);

//thiết lập HTTP Strict Transport Security (HSTS) để bảo vệ truy cập trang web qua HTTPS
// app.use(helmet.hsts({
//     maxAge: 31536000,  //1 năm
//     includeSubDomains: false, // Chưa áp dụng cho subdomain nếu chưa sẵn sàng 
//     preload: false            // Không đăng ký preload nếu chưa hoàn toàn chuyển đổi HTTPS hoặc có subdomain chưa hỗ trợ HTTPS
// }));
// Thiết lập giới hạn request
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 400, // Giới hạn mỗi IP chỉ được 700 requests trong 15 phút
    message: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.",
    headers: true, // Trả về headers cho biết còn bao nhiêu request có thể gửi
});
// Áp dụng rate limiting cho tất cả các routes để tránh tấn công DDoS
app.use(limiter);

// CORS configuration
const allowedOrigins = [
  'http://localhost:8000',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
];
// app.use(cors({
  const apiCorsOptions = {
    //     origin: (incomingOrigin, callback) => {
    //         console.log('[CORS] incomingOrigin =', incomingOrigin);
    //          // 1) Nếu không có Origin header hoặc Origin === 'null', cho qua luôn
    //     if (!incomingOrigin || incomingOrigin === 'null') {
    //         return callback(null, true);
    //       }
    //   
    //       // 2) Nếu Origin nằm trong whitelist, cho qua
    //       if (allowedOrigins.includes(incomingOrigin)) {
    //         return callback(null, true);
    //       }
    //   
    //       // 3) Còn lại, block
    //       callback(new Error(`Origin ${incomingOrigin} not allowed by CORS`));
    //     },
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    };
// Rate limiting
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 minutes
  max: 12,                  // limit to 10 login attempts
  message: 'Bạn đã nhập sai quá nhiều lần. Hãy thử lại sau 10 phút.'
});

// Anti-clickjacking
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

//====================
// Body parsing
//====================
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//====================
// Static files
//====================
app.use("/public", express.static("public"));
// // Static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, "public")));


//====================
// Template engine (Handlebars)
//====================
const { engine } = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const numeral = require('numeral');

app.engine('hbs', engine({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, "/views/layouts"),
  helpers: {
    format_number: v => numeral(v).format('0,0') + 'd',
    eq: (a, b) => a === b,
    ifEquals(a,b,opts) { return a===b?opts.fn(this):opts.inverse(this); },
    length: a => Array.isArray(a)?a.length:0,
    ifCond(v1, operator, v2) {
         switch (operator) {
          case "==":
            return parseInt(v1) === parseInt(v2);
          case "===":
            return v1 === v2;
          case "!=":
            return parseInt(v1) !== parseInt(v2);
          case "!==":
            return v1 !== v2;
          case "<":
            return parseInt(v1) < parseInt(v2);
          case "<=":
            console.log(parseInt(v1), parseInt(v2));
            console.log(parseInt(v1) <= parseInt(v2));
            return parseInt(v1) <= parseInt(v2);
          case ">":
            return parseInt(v1) > parseInt(v2);
          case ">=":
            return parseInt(v1) >= parseInt(v2);
          case "&&":
            return v1 && v2;
          case "||":
            return v1 || v2;
          default:
            return false;
    }},
    or: (v1,v2) => v1||v2,
    math(v1, operator, v2) {
                        switch (operator) {
                            case "+":
                                return parseInt(v1) + parseInt(v2);
                            case "-":
                                return parseInt(v1) - parseInt(v2);
                            case "*":
                                return parseInt(v1) * parseInt(v2);
                            case "/":
                                return parseInt(v1) / parseInt(v2);
                            case "%":
                                return parseInt(v1) % parseInt(v2);
                            default:
                                return NaN;
                        }
                    },
        includes(list, value, ...keys) {
                            // Filter out Handlebars metadata
                            keys = keys.filter(key => typeof key === "string");
                            if (!Array.isArray(list) || typeof value !== "object") {
                                return false;
                            }
                           return keys.length === 0
                                                ? list.some(item =>
                                                    Object.keys(value).every(key => item[key] === value[key])
                                                )
                                                : list.some(item =>
                                                    keys.every(key => item[key] === value[key])
                                                );
                        },
    section: hbs_sections()
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

//====================
// Cookies, Session, Passport, Flash
//====================
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard_cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true, sameSite: 'lax', maxAge: 3600000 } // 1 hour, Đặt secure thành true nếu sử dụng HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Flash & user data for views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg   = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//====================
// CSRF protection
//====================
// Parse tất cả multipart/form-data cho mọi route (không tối ưu nếu nhiều route không cần file)
//  app.use(upload.any()); // Sử dụng multer để parse multipart/form-data
// Parse application/x-www-form-urlencoded và application/json cho mọi route
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// const csrfProtection = csurf({
//   cookie: {
//     httpOnly: true,         // Bật HttpOnly
//     sameSite: 'Strict',         // SameSite Strict
//     secure: process.env.NODE_ENV === 'production', // Secure cookie trong production
//   }
// });
// app.use(csrfProtection);
// app.use((req, res, next) => {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

//====================
// Routes
//====================
app.get("/", (req, res) => {
        if (!req.session.user) {
            return res.redirect("/home");
        } else if (req.session.user.role === "admin") {
            return res.redirect("/admin");
        } else if (req.session.user.role === "editor") {
            return res.redirect("/editor");
        } else if (req.session.user.role === "writer") {
            return res.redirect("/writer");
        } else {
            return res.redirect("/main");
        }
    });

app.use('/api',cors(apiCorsOptions), loginLimiter, authRoutes);
app.use('/home', homeRoutes);
app.use('/main',cors(apiCorsOptions), authMiddleware.isSubscriber, mainRoutes);
app.use('/writer', authMiddleware.isWriter, writerRoutes);
app.use('/editor', authMiddleware.isEditor, editorRoutes);
app.use('/admin', authMiddleware.isAdmin, adminRoutes);

// 404 & error handler
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        console.log('>>> csrf secret cookie:', req.cookies._csrf);
        console.log('>>> token client gửi:', req.body._csrf);
        return res.status(403).send('CSRF token invalid');
      }
        console.error('Lỗi xảy ra:', err); // Ghi nhật ký lỗi đầy đủ để dễ gỡ lỗi
        res.status(404).render('404', { error: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
    });

//====================
// Server start
//====================
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
