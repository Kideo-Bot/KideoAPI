const http = require("http");

const DbService = require("./DbService");

const sql = new DbService();

const server = http.createServer((req, res) => {

    let body = "";

    req.on("data", chunk => {
        body+=chunk;
    }).on("end", async () => {

        res.writeHead(200, {"Content-Type": "application/json"});

        if(req.method === "POST"){
            body = JSON.parse(body);
        }

        if(req.url === "/api/guild"){
            if(req.method === "POST"){
                if(body.ServerID !== undefined || body.XP !== undefined){
                    if(await sql.createServer({ServerID: body.ServerID, XP: body.XP})){
                        res.end(JSON.stringify({message: "Server created in the table", succeed: true}))
                    }else {
                        res.end(JSON.stringify({message: "An error has current", succeed: false}))
                    }
                }
            }

            if(req.method === "GET"){
                await sql.getAllData().then(data => {
                    res.end(JSON.stringify({content: JSON.parse(data), succeed: true}))
                }).catch(err => {
                    console.log(err.message);
                    res.end(JSON.stringify({message: "An error has current", succeed: false}));
                })

            }

        }

        if(req.url === "/api/deleteGuild"){
            if(req.method === "POST"){
                if(body.ServerID !== undefined){
                    if(await sql.deleteGuildWithID(body.ServerID)){
                        res.end(JSON.stringify({message: "Server created in the table", succeed: true}))
                    }else {
                        res.end(JSON.stringify({message: "An error has current", succeed: false}))
                    }
                }
            }
        }

        if(req.url === "/api/guildID"){
            if(req.method === "POST"){
                if(body.ServerID !== undefined){
                    const guild = await sql.getDataWithID(body.ServerID);
                    if(guild !== undefined){
                        res.end(JSON.stringify({message: guild, succeed: true}));
                    }else {
                        res.end(JSON.stringify({message: "An error has current", succeed: false}));
                    }
                }
            }
        }

        if(req.url === "/api/guildPrefix"){
            if(req.method === "POST"){
                if(body.ServerID !== undefined && body.Prefix !== undefined){
                    if(await sql.changePrefix(body.Prefix, body.ServerID)){
                        res.end(JSON.stringify({message: "Data sent", succeed: true}));
                    }else {
                        res.end(JSON.stringify({message: "An error has current", succeed: false}));
                    }
                }
            }
        }

        if(req.url === "/api/xpGuild"){
            if(req.method === "POST"){
                if(body.ServerID !== undefined){
                    if(await sql.addXpPoint(body.ServerID)){
                        res.end(JSON.stringify({message: "Data sent", succeed: true}));
                    }else {
                        res.end(JSON.stringify({message: "An error has current", succeed: false}));
                    }
                }
            }
        }

        if(req.url === "/api/getLevel") {
            if(req.method === "POST") {
                const number = await sql.getLevel(body.ServerID);
                if(number !== undefined)  {
                    res.end(JSON.stringify({message: number, succeed: true}));
                } else {
                    res.end(JSON.stringify({message: "An error has current", succeed: false}));

                }
            }
        }

        if(req.url === "/api/getExperience") {
            if(req.method === "POST") {
                const number = await sql.getExperience(body.ServerID);
                if(number !== undefined)  {
                    res.end(JSON.stringify({message: number, succeed: true}));
                } else {
                    res.end(JSON.stringify({message: "An error has current", succeed: false}));

                }
            }
        }

    })

}).listen({port: 5000, host: "0.0.0.0"}, () => {
    console.log("API started, go to http://localhost:5000/api");
})