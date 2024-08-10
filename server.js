const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const DB_CONNECT = process.env.DB_CONNECT;

// db connection
const dbConnect = async () => {
    try {
        await mongoose.connect(DB_CONNECT);
        console.log("db connected");
    } catch(err) {
        console.log("db_connect err\n", err.message);
        process.exit(1);
        // return -> terminate's funtion and returns back to calling funtion
        // process.exit -> terminate's NODE.js process. with sign 0->success, non_zero->failure
    }
}
dbConnect();
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

async function isContailsAnyLetter(s) { // own funtion
    for(let i=0; i<s.length; i++) {
        if(s[i] <= 'z' && s[i] >= 'a') {
            return true;
        }
    }
    return false;
}

// middleware's
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(async (req, res, next) => {
    if(req.method === 'POST' || req.method == "PATCH") {
        const body = req.body;
        if (!body || !body.name || !body.roll || !body.email) {
            console.log("All fields are required");
            return res.status(400).json({ msg: "All fields are required"});
        }
    } else if(['GET', 'DELETE'].includes(req.method)) {
        const count = await students.countDocuments();
        if (count === 0) {
            console.log("collection is empty");
            return res.status(400).json({msg: "empty collection. First fill some data"});
        }
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
        return res.status(201).json({msg: result});
    } catch(err) {
        console.log("data creation err\n", err.message);
        return res.status(500).json({msg: err.message});
    }
});
app.get("/api/students", async (req, res) => {
    try {
        const result = await students.find({});
        console.log("all data sent");
        return res.status(200).json({msg: result});
    } catch(err) {
        console.log("all data fetching err\n", err.message);
        return res.status(500).json({msg: err.message});
    }
});
app.delete("/api/students", async (req, res) => {
    try {
        await students.deleteMany({});
        console.log("all dta deleted");
        res.status(200).json({msg: "all data deleted"});
    } catch(err) {
        console.log("all data deletion err\n", err.message);
        res.status(500).json({msg: err.message});
    }
});
app.route("/api/students/:id")
.get(async (req, res) => {
    try {
        const id = req.params.id;
        flag = await isContailsAnyLetter(id);
        if(flag) {
            if(mongoose.Types.ObjectId.isValid(id)) {
                const result = await students.findById(id);
                if(!result) {
                    console.log("student not found");
                    return res.status(404).json({msg: "student not found"});
                }
                console.log("one data sent");
                return res.status(200).json({msg: result});
            }
            console.log("student not found");
            return res.status(404).json({msg: "student not found"});
        } else {
            const roll = Number(id);
            const result = await students.findOne({roll: roll});
            if(!result || roll == NaN) {
                console.log("student not found");
                return res.status(404).json({msg: "student not found"});
            }
            console.log("one data sent");
            return res.status(200).json({msg: result});
        }
    } catch(err) {
        console.log("one data fetching err\n", err.message);
        return res.status(500).json({msg: err.message});
    }
})
.patch(async (req, res) => {
    try {
        const roll = Number(req.params.id);
        const body = req.body;
        const result = await students.findOneAndUpdate(
            {roll: roll},
            {$set: body},
            {new: true, runValidator: true}
            // Options: `new` returns the updated document, `runValidators` ensures validation
        );
        if (!result) {
            console.log("student not found");
            return res.status(404).json({msg: "student not found"});
        }
        console.log("one data updated");
        return res.status(200).json({msg: result});
    } catch(err) {
        console.log("one data updation err\n", err.message);
        return res.status(500).json({msg: err.message});
    }
})
.delete(async (req, res) => {
    try {
        const roll = Number(req.params.id);
        const result = await students.findOneAndDelete({roll: roll});
        if (!result) {
            console.log("student not found");
            return res.status(404).json({msg: "student not found"});
        }
        console.log("one data deleted");
        return res.status(200).json({msg: result});
    } catch(err) {
        console.log("one data deletion err\n", err.message);
        return res.status(500).json({msg: err.message});
    }
});


app.listen(PORT, () => {
    console.log(`server started at ${PORT}`);
});