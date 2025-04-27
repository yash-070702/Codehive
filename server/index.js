const express = require("express");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const mongoSanitize = require("express-mongo-sanitize"); // sanitizing input data to prevent security vulnerabilities such as cross-site scripting (XSS) or SQL injection.
const fileUpload = require("express-fileupload");
const {cloudinaryConnect}=require("./config/cloudinary");
const authRoutes = require("./routes/Auth.routes");
const questionRoutes = require("./routes/Question.routes");
const answerRoutes = require("./routes/Answer.routes");
const commentRoutes = require("./routes/Comment.routes");
const userRoutes = require("./routes/User.routes");
const notificationsRoutes = require("./routes/Notifications.routes");
const app = express();

const PORT = process.env.PORT || 4000;

dotenv.config();

database.connect();

app.use(express.json());
// Middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

cloudinaryConnect();

app.use(mongoSanitize());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/question", questionRoutes);
app.use("/api/v1/answer", answerRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/notifications", notificationsRoutes);


app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ...",
  });
});

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
