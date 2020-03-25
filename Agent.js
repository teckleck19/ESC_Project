let Router = require("./Router.js");
let A = Agent.prototype;

function Agent(id, passwd){
    
    this.id = id;
    this.passwd = passwd;
    this.router = null;
    this.task = null;
    this.connection = null;

}

A.loginToRainbow = function(router){
    this.router = router;
    this.router.addAgentLogin(this);
}

A.standbyForTask = function(task){
    this.task = task;
    this.router.addAgentAvailable(this);
}

module.exports = Agent;