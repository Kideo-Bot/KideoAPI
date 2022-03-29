const http = require("http");

const DbService = require("./DbService");

const sql = new DbService();

const server = http.createServer((req, res) => {

    let body = "";

    req.on("data", chunk => {
        body+=chunk;
    }).on("end", async () => {

        if(req.method === "POST"){
            body = JSON.parse(body);
        }

        if(req.url === "/api/guild"){
            if(req.method === "POST"){
                if(body.ServerID !== undefined || body.XP !== undefined){
                    if(await sql.createServer({ServerID: body.ServerID, XP: body.XP})){
                        console.log("Server created !");
                    }
                }
            }
        }

        if(req.url === "/api/deleteGuild"){
            if(req.method === "POST"){
                if(body.ServerID !== undefined){
                    if(await sql.deleteGuildWithID(body.ServerID)){
                        console.log("Server deleted !");
                    }
                }
            }
        }

    })

}).listen({port: 5000, host: "0.0.0.0"}, () => {
    console.log("API started, go to http://localhost:5000/api");
})