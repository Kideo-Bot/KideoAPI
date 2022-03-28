const sql = require("mysql");

class DbService {
    constructor() {
        this.con = sql.createConnection({
            host: "localhost",
            port: 3306,
            database: "kideo",
            user: "root",
            password: ""
        });

        this.con.connect((err) => {
            if(err){
                console.log(err);
            }
            console.log('db ' + this.con.state);
        })
    }

    async getAllData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM test`;

                this.con.query(query, (err, res) => {
                    if(err) reject(new Error(err.message));

                    resolve(res);
                })
            })

            return response;

        } catch (error) {
            console.log(err);
        }
    }

}

module.exports = DbService;