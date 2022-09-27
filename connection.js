/*
module to encapsulate the connetion credentials and the connection string from index.js 
*/

module.exports = function () {
    this.username = "" ;
    this.password = "fG0Y6p8Lmd9QNZCd" ;
    this.database = "Roster" ;
    this.getURL = function () {
        return `mongodb+srv://rosterDev:${this.password}@roster-scheduler-cluste.mcmll6m.mongodb.net/${this.database}?retryWrites=true&w=majority`
    }
} 
