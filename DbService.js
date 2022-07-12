const sql = require("mysql");

const config = require("./config.json")

class DbService {
    constructor() {

        this.con = sql.createConnection({
            user: "root",
            password: "",
            database: config.database,
            port: 3306,
            host: config.host
        })



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

            const response = await new Promise(async (resolve, reject) => {
                const query = `SELECT * FROM guild`;

                await this.con.query(query, (err, res) => {
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

            const response = new Promise(async (resolve, reject) => {

                const query = `INSERT INTO guild VALUES ('${options.ServerID}','${options.XP}', '+', 1)`;

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

                const query = `DELETE FROM guild WHERE ServerID = '${guidID}'`;

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

                const query = `SELECT * FROM guild WHERE ServerID = '${ID}'`;

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

                const query = `UPDATE guild SET PREFIX='${newPrefix}' WHERE ServerID = '${guildID}'`;

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

    /**
     * @param ServerID {string}
     * @return {Promise<boolean>}
     */
    async addXpPoint(ServerID){

        try {

            const response = new Promise((resolve, reject) => {

                const query2 = `SELECT EXP FROM guild WHERE ServerID = '${ServerID}'`;

                this.con.query(query2, async (err, number) => {
                    if (err) {
                        reject(new Error(err.message));
                    }

                    let point = number[0].EXP + 1;

                    const query = `UPDATE guild SET EXP = ${point} WHERE ServerID = '${ServerID}'`;

                    const var1 = 120 * await this.getLevel(ServerID);

                    if (point === var1) {
                        await this.addLevel(ServerID);
                    }

                    this.con.query(query, (err, res) => {

                        if (err) {
                            reject(new Error(err.message));
                        }

                        resolve(true);
                    })
                })
            })

            return !!response;

        } catch (err) {
            console.log(err);
        }

    }

    async getLevel(ServerID) {
        try {
            const response = new Promise((resolve, reject) => {

                const query = `SELECT LEVEL from guild WHERE ServerID='${ServerID}'`;
                this.con.query(query, (err, number) => {
                   if(err) {
                       reject(new Error(err.message));
                   }
                   resolve(number);
                });
            });



            const data = await (await response)[0].LEVEL
            return data;

        } catch(err) {
            console.log(err);
        }
    }

    async getExperience(ServerID) {
        try {
            const response = new Promise((resolve, reject) => {

                const query = `SELECT EXP from guild WHERE ServerID='${ServerID}'`;
                this.con.query(query, (err, number) => {
                    if(err) {
                        reject(new Error(err.message));
                    }
                    resolve(number);
                });
            });

            const data = await (await response)[0].EXP;
            return data;

        } catch(err) {
            console.log(err);
        }
    }

    async addLevel(ServerID) {
        try {
            const response = new Promise((resolve, reject) => {
               const query = `SELECT LEVEL from guild WHERE ServerID='${ServerID}'`;

               this.con.query(query, (err, number) => {
                   if(err) {
                       reject(new Error(err.message));
                   }

                   let newLevel = parseInt(number[0].LEVEL) + 1;

                   const query2 = `UPDATE guild SET LEVEL = ${newLevel} where ServerID = '${ServerID}'`;

                   this.con.query(query2, (err, res) => {
                        if(err) {
                            reject(new Error(err.message));
                        }
                        resolve(true);
                   });

               });

            });

            return !!response;

        } catch (err) {
            console.log(err);
        }
    }

    async getWarns(UserID, GuildID){

        try {

            return new Promise(async (resolve, reject) => {

                const query = `SELECT WARNS FROM userwarn WHERE USERID='${UserID}' AND GUILDID = '${GuildID}'`;

                this.con.query(query, (err, number) => {
                    if(err){
                        reject(err);
                        return;
                    }
                    
                    if(number[0] === undefined){
                        resolve(false)
                    }else {
                        resolve(number[0].WARNS);
                    }
                })

            })

        } catch (err) {

        }


    }

    async setWarns(UserID, number, GuildID){

        try {

            return !!new Promise(async (resolve, reject) => {

                const query = `UPDATE userwarn SET WARNS = ${number} WHERE USERID = '${UserID}' AND GUILDID = '${GuildID}'`;

                this.con.query(query, (err, number) => {
                    if(err){
                        reject(err);
                        return;
                    }

                    resolve(number);

                })

            })

        } catch (err) {

        }


    }

    async createWarnsUser(UserID, GuildID){
        try {

            return !!new Promise(async (resolve, reject) => {

                const query = `INSERT INTO userwarn VALUES ('${UserID}','1', '${GuildID}')`;

                this.con.query(query, (err, number) => {
                    if(err){
                        reject(err);
                        return;
                    }

                    resolve(number);

                })

            })

        } catch (err) {

        }
    }
    
    async deleteWarnsUser(UserID, GuildID){
        try {

            return !!new Promise(async (resolve, reject) => {

                const query = `DELETE FROM userwarn WHERE USERID = '${UserID}' AND GUILDID = '${GuildID}'`;

                this.con.query(query, (err, number) => {
                    if(err){
                        reject(err);
                        return;
                    }

                    resolve(number);

                })

            })

        } catch (err) {

        }
    }

    async getUserTempMute(UserID, GuildID){

        try {

            return new Promise(async (resolve, reject) => {

                const query = `SELECT TIME FROM usertempmute WHERE USERID='${UserID}' AND GUILDID = '${GuildID}'`;

                this.con.query(query, (err, number) => {
                    if(err){
                        reject(err);
                        return;
                    }
                    
                    if(number[0] === undefined){
                        resolve(false)
                    }else {
                        resolve(number[0].TIME);
                    }
                })

            })

        } catch (err) {

        }


    }

    async setUserTempMute(UserID, number, GuildID){

        try {

            return !!new Promise(async (resolve, reject) => {

                const query = `UPDATE usertempmute SET TIME = ${number} WHERE USERID = '${UserID}' AND GUILDID = '${GuildID}'`;

                this.con.query(query, (err, number) => {
                    if(err){
                        reject(err);
                        return;
                    }

                    resolve(number);

                })

            })

        } catch (err) {

        }


    }

    async createUserTempMute(UserID, GuildID, Time){
        try {

            return !!new Promise(async (resolve, reject) => {

                const query = `INSERT INTO usertempmute VALUES ('${UserID}','${GuildID}','${Time}')`;

                this.con.query(query, (err, number) => {
                    if(err){
                        reject(err);
                        return;
                    }

                    resolve(number);

                })

            })

        } catch (err) {

        }
    }
    
    async deleteUserTempMute(UserID, GuildID){
        try {

            return !!new Promise(async (resolve, reject) => {

                const query = `DELETE FROM usertempmute WHERE USERID = '${UserID}' AND GUILDID = '${GuildID}'`;

                this.con.query(query, (err, number) => {
                    if(err){
                        reject(err);
                        return;
                    }

                    resolve(number);

                })

            })

        } catch (err) {

        }
    }

    async getUsersTempMute(){

        try {

            return new Promise(async (resolve, reject) => {

                const query = `SELECT * FROM usertempmute`;

                this.con.query(query, (err, number) => {
                    if(err){
                        reject(err);
                        return;
                    }
                    
                    if(number[0] === undefined){
                        resolve(false)
                    }else {
                        resolve(number);
                    }
                })

            })

        } catch (err) {

        }


    }

}

module.exports = DbService;