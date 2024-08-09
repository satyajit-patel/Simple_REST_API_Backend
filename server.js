const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const DB_CONNECT = process.env.DB_CONNECT;

// db connection
mongoose.connect(DB_CONNECT)
.then(() => console.log("db connected"))
.catch((err) => console.log("db_connect err", err));
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    roll: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String
    }
}, {timestamps: true});
const students = mongoose.model("studentColl", studentSchema);

// middleware's
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(async (req, res, next) => {
    const body = req.body;
    if(!body || !body.name || !body.roll || !body.email) {
        return res.status(400).json({msg: "all fields are req.."});
    }

    const count = await students.countDocuments();
    if(count == 0) {
        console.log("db is empty");
        return res.status(400).json({msg: "empty database.. first fill some data"});
    }

    next();
});
// api's
app.get("/", (req, res) => {
    res.send("<h1>HOME PAGE</h1>");
});
app.post("/api/students", async (req, res) => {
    try {
        const body = req.body;
        const result = await students.create({
            name: body.name,
            roll: body.roll,
            email: body.email
        });
        console.log("data created");
        return res.status(200).json({msg: result});
    } catch(err) {
        console.log("data creation err", err);
        return res.status(500).json({msg: err.message});
    }
});
app.get("/api/students", async (req, res) => {
    try {
        const result = await students.find({});
        console.log("all data sent");
        return res.status(200).json({msg: result});
    } catch(err) {
        console.log("all data fetching err", err.message);
        return res.status(500).json({msg: err.message});
    }
});
app.route("/api/students/:id")
.get((req, res) => {
    try {
        const roll = Number(req.params.id);
        const student = students.find((student) => student.roll == roll);
        console.log("one data sent");
        return res.status(200).json({msg: student});
    } catch(err) {
        console.log("one data fetching err", err.message);
        return res.status(500).json({msg: err.message});
    }
})
.patch((req, res) => {
    try {
        const roll = Number(req.params.id);
        const student = students.find((student) => student.roll == roll);
        console.log("one data updated");
        return res.status(200).json({msg: student});
    } catch(err) {
        console.log("one data updation err", err.message);
        return res.status(500).json({msg: err.message});
    }
})
.delete((req, res) => {
    try {
        const roll = Number(req.params.id);
        const student = students.find((student) => student.roll == roll);
        console.log("one data deleted");
        return res.status(200).json({msg: student});
    } catch(err) {
        console.log("one data deletion err", err.message);
        return res.status(500).json({msg: err.message});
    }
});
/*
    status
        200-299 -> success
        400-499 -> client side error
        500-599 -> server side error
*/


app.listen(PORT, () => {
    console.log(`server started at ${PORT}`);
});