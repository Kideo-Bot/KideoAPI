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

    /**
     *
     * @return {Promise<string>}
     */
    async getAllData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM test`;

                this.con.query(query, (err, res) => {
                    if(err) reject(new Error(err.message));

                    resolve(res);
                })
            })

            return JSON.stringify(response);

        } catch (error) {
            console.log(err);
        }
    }

    /**
     * @param options {{ServerID: string, XP: Number}};
     * @return {Promise<boolean>};
     */
    async createServer(options){
        try {
            const response = new Promise((resolve, reject) => {

                const query = `INSERT INTO test VALUES ('${options.ServerID}','${options.XP}')`;

                this.con.query(query, (err, res) => {

                    if(err)  reject(new Error(err.message));

                    resolve(true);

                })

            })

            if(response){
                return response;
            }

            return false;

        } catch (err) {
            console.log(err);
        }
    }

    /**
     * @param guidID {string};
     * @return {Promise<boolean>}
     */
    async deleteGuildWithID(guidID){
        try {
            const response = new Promise((resolve, reject) => {

                const query = `DELETE FROM test WHERE ServerID = '${guidID}'`;

                this.con.query(query, (err, res) => {

                    if(err) reject(new Error(err.message));

                    resolve(true);

                })

            })

            if(response){
                return response
            }

            return false;
        } catch (err) {
            console.log(err);
        }
    }

}

module.exports = DbService;