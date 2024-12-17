const express = require("express");
const { engine } = require("express-handlebars");
const hbs_sections = require("express-handlebars-sections");
const cookieParser = require("cookie-parser");
const app = express();
const dotenv = require("dotenv");
const passport = require("passport");
const mainRoutes = require("./routes/main");
const path = require("path");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const session = require("express-session");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const numeral = require("numeral");
const postRoutes = require("./routes/post.js");
const editorRoutes = require("./routes/editor.js");
const profileRoutes = require("./routes/profile.js");
const homeRoutes = require("./routes/home.js");
const writerRoutes = require("./routes/writer.js");
require("./config/passport"); // Passport configuration should be required here

dotenv.config(); // Load environment variables from .env file
const PORT = process.env.PORT || 5000;

// // Middleware setup
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(express.json()); // To parse JSON bodies

// Set up Handlebars view engine

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "/views/layouts"),
    helpers: {
      format_number(value) {
        return numeral(value).format("0,0") + "d"; // Format number with commas and suffix 'd'
      },
      eq(a, b) {
        return a === b;
      },
      ifEquals(a, b, options) {
        if (a === b) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
      length(array) {
        return array.length;
      },
      ifCond(v1, operator, v2) {
        switch (operator) {
          case "==":
            return v1 == v2;
          case "===":
            return v1 === v2;
          case "!=":
            return v1 != v2;
          case "!==":
            return v1 !== v2;
          case "<":
            return v1 < v2;
          case "<=":
            return v1 <= v2;
          case ">":
            return v1 > v2;
          case ">=":
            return v1 >= v2;
          case "&&":
            return v1 && v2;
          case "||":
            return v1 || v2;
          default:
            return false;
        };
      },
      section: hbs_sections(),
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views")); // Use path.join for cross-platform compatibility
app.use("/public", express.static("public"));
// // Static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, "public")));
// // Use cookie-parser middleware
app.use(cookieParser());
// // Session setup (Express session with flash messages)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret", // Use environment variable for session secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60, // 1 giờ
    }, // Đặt secure thành true nếu sử dụng HTTPS
  })
);

// // Passport initialization
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
// // Flash messages middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.get('/', (req, res) => {
    res.redirect('/home/view');
});

// // Define routes
app.use("/main", mainRoutes);
app.use("/writer", writerRoutes);
app.use("/editor", editorRoutes);
app.use("/home", homeRoutes);
app.use("/api", authRoutes);
app.use("/admin", adminRoutes);
app.use("/profile", profileRoutes);

// Start the server

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
