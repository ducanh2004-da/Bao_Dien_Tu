const express = require("express");
const { engine } = require("express-handlebars");
const hbs_sections = require("express-handlebars-sections");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const numeral = require("numeral");
const path = require("path");

// Routes
const mainRoutes = require("./routes/main");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const editorRoutes = require("./routes/editor.js");
const homeRoutes = require("./routes/home.js");
const writerRoutes = require("./routes/writer.js");

// Initialize app and load environment variables
dotenv.config();
const app = express();
require("./config/passport"); // Passport configuration
const PORT = process.env.PORT || 5000;

// Middleware setup
const authMiddleware = require("./middlewares/auth");
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());

// Session setup
app.use(
    session({
        secret: process.env.SESSION_SECRET || "secret", // Use environment variable for session secret
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Set to true if using HTTPS
            maxAge: 1000 * 60 * 60, // 1 hour
        },
    })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Flash messages middleware
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// Static files
app.use("/public", express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

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
                return a === b ? options.fn(this) : options.inverse(this);
            },
            length(array) {
                return array.length;
            },
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
                }
            },
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
            section: hbs_sections(),
        },
    })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Redirect based on user role
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

// Define routes
app.use("/main", authMiddleware.isUser, authMiddleware.isSubscriber, mainRoutes);
app.use("/writer", authMiddleware.isUser, authMiddleware.isWriter, writerRoutes);
app.use("/editor", authMiddleware.isUser, authMiddleware.isEditor, editorRoutes);
app.use("/home", homeRoutes);
app.use("/api", authRoutes);
app.use("/admin", authMiddleware.isUser, authMiddleware.isAdmin, adminRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
