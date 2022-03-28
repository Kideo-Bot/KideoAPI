const express = require("express");

const server = new express();

const DbService = require("./DbService");

const sql = new DbService();

server.get("/api", async (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(await sql.getAllData()));
})

server.listen(5000, "0.0.0.0", () => {
    console.log("The API is listening on http://localhost:5000/api");
})