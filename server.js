const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT;

const users = require("./MOCK_DATA.json"); // ./ means current directory

// routes
app.get("/", (req, res) => {
    res.send("<h1>HOME PAGE</h1>");
});
app.get("/users", (req, res) => {
    // res.send(users);
    const html = `
        <ul>
            ${users.map((user) => `<li>${user.first_name} <br> ${user.email}<li/>`).join("")}
        <ul/>
    `;
    res.send(html); // returns and continues with the funtion
});
// REST API
app.get("/api/users/:id", (req, res) => { // :something means any dynamic id is coming
    const id = Number(req.params.id);
    const user = users.find((user) => user.id == id);
    return res.json(user); // returns and exist the function
});
app.post("/api/users", (req, res) => {
    return res.json({status: "pending"});
});
app.patch("/api/users/:id", (req, res) => {
    return res.json({status: "pending"});
});
app.delete("/api/users/:id", (req, res) => {
    return res.json({status: "pending"});
});


app.listen(PORT, () => {
    console.log(`server started at ${PORT}`);
});