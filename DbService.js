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

                const query = `INSERT INTO test VALUES ('${options.ServerID}','${options.XP}', '+')`;

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

    /**
     * @param ID {string}
     * @return {Promise<JSON>}
     */
    async getDataWithID(ID){
        try {

            const response = new Promise((resolve, reject) => {

                const query = `SELECT * FROM test WHERE ServerID = '${ID}'`;

                this.con.query(query, (err, res) => {
                    if(err) reject(new Error(err.message));

                    resolve(res);
                })

            })

            const json = JSON.stringify(await response);

            return JSON.parse(json);

        } catch (err) {
            console.log(err);
        }
    }

    /**
     * @param newPrefix {string};
     * @param guildID {string};
     * @return {Promise<boolean>};
     */
    async changePrefix(newPrefix, guildID){

        try {

            const response = new Promise((resolve, reject) => {

                if(newPrefix.length !== 1){
                    resolve(false);
                    return;
                }

                const query = `UPDATE test SET PREFIX='${newPrefix}' WHERE ServerID = '${guildID}'`;

                this.con.query(query, (err, res) => {
                    if(err) {
                        reject(new Error(err.message));
                        return;
                    }

                    resolve(true);

                })

            })

            return response;

        } catch (err) {
            console.log(err);
        }

    }

}

module.exports = DbService;