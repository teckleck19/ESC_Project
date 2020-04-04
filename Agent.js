let Router = require("./Router.js");
let A = Agent.prototype;

function Agent(contact){
    
    this.contact=contact;
    this.name = this.contact.name.value;
    this.id = this.contact.jid;
    this.status = this.contact.presence;
    this.task = this.contact.tags[1];
    this.numOfConnections = 0;

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