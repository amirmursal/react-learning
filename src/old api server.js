const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");
const multer = require("multer");
const fs = require("fs");
const User = require("./models/user");
const File = require("./models/file");

const isDev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 5000;

var storage = multer.diskStorage({
  //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, "./react-ui/public/");
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(
      null,
      file.fieldname +
        "-" +
        datetimestamp +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  },
});

var upload = multer({
  //multer settings
  storage: storage,
  fileFilter: function (req, file, callback) {
    //file filter
    if (
      ["pptx"].indexOf(
        file.originalname.split(".")[file.originalname.split(".").length - 1]
      ) === -1
    ) {
      return callback(new Error("Wrong extension type"));
    }
    callback(null, true);
  },
}).single("file");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const env = "local"; // prod local

const dburl =
  env === "prod"
    ? "mongodb://admin:admin123@ds033390.mlab.com:33390/project-insight"
    : "mongodb://localhost:27017/project-insight";

// create database connection
mongoose.connect(
  dburl,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, db) => {
    if (err) console.log(err);
  }
);

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, "../react-ui/build")));

// all other route will be prefixed with /api
// routes creation
const router = express.Router();
app.use("/api", router);

// All remaining requests return the React app, so it can handle routing.
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "../react-ui/build", "index.html"));
});

// login user
router.post("/login", (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) res.send(err);
    if (user && user.password === req.body.password) {
      res.json(user);
    } else {
      res.json(err);
    }
  });
});

// create user
router.post("/createUser", (req, res) => {
  const user = new User();
  user.name = req.body.name;
  user.username = req.body.username;
  user.password = req.body.password;
  user.email = req.body.email;
  user.role = req.body.role;
  user.save((err) => {
    if (err) res.send(err);
    res.json({ message: "User Created" });
  });
});

// get user info
router.get("/getUser/:user_id", (req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) res.send(err);
    res.json(user);
  });
});

// update user info
router.put("/updateUser/:user_id", (req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) res.send(err);
    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.role = req.body.role;
    user.save((err) => {
      if (err) res.send(err);
      res.json({ message: "User Updated" });
    });
  });
});

// delete user
router.delete("/deleteUser/:user_id", (req, res) => {
  User.remove({ _id: req.params.user_id }, (err, user) => {
    if (err) res.send(err);
    res.json({ message: "User Removed" });
  });
});

// get all users
router.get("/getUsers", (req, res) => {
  User.find((err, users) => {
    if (err) res.send(err);
    res.json(users);
  });
});

// upload file
app.post("/upload", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      res.json({ error_code: 1, err_desc: err });
      return;
    }
    /** Multer gives us file info in req.file object */
    if (!req.file) {
      res.json({ error_code: 1, err_desc: "No file passed" });
      return;
    }
    const file = new File();
    file.data = fs.readFileSync(req.file.path);
    file.filename = req.file.originalname;
    file.path = req.file.path;
    file.save((err) => {
      if (err) res.send(err);
      res.json({ message: "File Uploaded" });
    });
  });
});

router.get("/getFiles", (req, res) => {
  File.find({}, (err, files) => {
    if (err) res.send(err);
    res.json(files);
  });
});

// delete user
router.delete("/deleteFile/:_id", (req, res) => {
  File.remove({ _id: req.params._id }, (err, file) => {
    if (err) res.send(err);
    res.json({ message: "File Removed" });
  });
});

/* get leave info
 * @param user_id
 */
router.get("/getLeaves/:userId", (req, res) => {
  Leave.find({ userId: req.params.userId }, (err, leaves) => {
    if (err) res.send(err);
    res.json(leaves);
  });
});

/**
 * Delete leave request
 * @param leave_id
 */
router.delete("/deleteLeave/:leave_id", (req, res) => {
  Leave.remove({ _id: req.params.leave_id }, (err, leave) => {
    if (err) res.send(err);
    res.json({ message: "leave request removed" });
  });
});

/**
 * Get leave info
 * @param leave_id
 */
router.get("/getLeaveDetails/:leave_id", (req, res) => {
  Leave.findOne({ _id: req.params.leave_id }, (err, leave) => {
    if (err) res.send(err);
    res.json(leave);
  });
});

/**
 * Update Leave info
 * @param leave_id
 */
router.put("/updateLeave/:leave_id", (req, res) => {
  Leave.findById(req.params.leave_id, (err, leave) => {
    if (err) res.send(err);
    leave.appliedDate = req.body.appliedDate;
    leave.reuestedLeaveDays = req.body.reuestedLeaveDays;
    leave.reason = req.body.reason;
    leave.startDate = req.body.startDate;
    leave.endDate = req.body.endDate;
    leave.userId = req.body.userId;
    leave.name = req.body.name;
    leave.approved = req.body.approved;
    leave.rejected = req.body.rejected;
    leave.save((err) => {
      if (err) res.send(err);
      res.json({ message: "Leave Updated" });
    });
  });
});

/**
 * Get all users leave request
 */
router.get("/getLeaveRequests", (req, res) => {
  Leave.find({ rejected: false, approved: false }, (err, leaves) => {
    if (err) res.send(err);
    res.json(leaves);
  });
});

/**
 * Reject Leave
 * @param leave_id
 */
router.put("/rejectLeave/:leave_id", (req, res) => {
  Leave.findById(req.params.leave_id, (err, leave) => {
    if (err) res.send(err);
    leave.approved = false;
    leave.rejected = true;
    leave.save((err) => {
      if (err) res.send(err);
      res.json({ message: "Leave Rejected" });
    });
  });
});

/**
 * Approve Leave
 * @param leave_id
 */
router.put("/approveLeave/:leave_id", (req, res) => {
  Leave.findById(req.params.leave_id, (err, leave) => {
    if (err) res.send(err);
    leave.approved = true;
    leave.rejected = false;
    leave.save((err) => {
      if (err) res.send(err);
      res.json({ message: "Leave Approved" });
    });
  });
});

/**
 * Get all leave request
 * It will give only one month back data from current date
 */
router.get("/getRecentLeaveRequests", (req, res) => {
  let startDate = new Date().toISOString();
  let endDate = moment(new Date()).subtract(1, "months").toISOString();
  Leave.find(
    { appliedDate: { $gte: endDate, $lte: startDate } },
    (err, leaves) => {
      if (err) res.send(err);
      res.json(leaves);
    }
  );
});

/**
 * Get all leave request
 * @param user_id
 * @param startDate
 * @param endDate
 */
router.get("/getAllLeaveRequests/:user_id/:startDate/:endDate", (req, res) => {
  const leaveQuery =
    req.params.user_id !== "all"
      ? {
          userId: req.params.user_id,
          appliedDate: {
            $gte: moment(req.params.startDate).startOf("day"),
            $lte: moment(req.params.endDate).endOf("day"),
          },
        }
      : {
          appliedDate: {
            $gte: moment(req.params.startDate).startOf("day"),
            $lte: moment(req.params.endDate).endOf("day"),
          },
        };
  Leave.find(leaveQuery, (err, leaves) => {
    if (err) res.send(err);
    res.json(leaves);
  });
});

app.listen(PORT, function () {
  console.error(
    `Node ${
      isDev ? "dev server" : "cluster worker " + process.pid
    }: listening on port ${PORT}`
  );
});
