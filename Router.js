let Webpage = require("./Webpage.js");
let User = require("./User.js");
let Connection = require("./Connection");
//constuctor
function Router(){
    this.webpage = new Webpage(this);
    this.users = new Array();
    this.agents = new Array();
    this.queuedUsers = new Array();
    this.availableAgents = new Array();
    this.unAvailableAgents = new Array();
    this.connections = new Array();
}

/**
 * Route Request Sent from webpage
 * @param User
 * @returns void or agent
 * @throws what kind of exception does this method throw
*/
Router.prototype.routeRequest = function (user){
    
    var msg = "";
    let agent = null;
    // Checks agent availability
    if (this.agents.length === 0){
        
        this.sendZeroAgent();
        
    }
    else{
        console.log("Routing......");
        for (let i=0; i<this.availableAgents.length; i++){
            
            if (this.availableAgents[i].task === user.request.what){
                msg = this.sendAvailable();
                agent = this.availableAgents[i];
            }
        }
        
        if (msg === ""){
            console.log("Routing to queue");
            //console.log(this.unAvailableAgents);
            for (let i=0; i<this.unAvailableAgents.length; i++){
                if (this.unAvailableAgents[i].task === user.request.what){
                    msg = this.sendQueue(user);
                }
            }
        }
    }
    
    if (msg===""){
        return;
    }

    else if (msg === "Cancel"){
        console.log("Request is cancelled!")
    }

    else if (msg==="Queue"){
        this.queueUser(user);
    }

    else if (msg==="Create Connection" & agent!=null){
        //this.notifyAgent(user.request);
        this.createConnection(user,agent);
    }
};



/**
 * 3 methods of sending routing result to webpage
 */
Router.prototype.sendZeroAgent = function(){
    return this.webpage.receiveZeroAgent();
};

Router.prototype.sendAvailable = function(){
    return this.webpage.receiveAvailable();
};

Router.prototype.sendQueue = function(user){
    return this.webpage.receiveQueue(user);
};

Router.prototype.sendSuccessfullyQueued = function(){
    this.webpage.receiveSuccessfullyQueued();
};
/**
 * queue user for next available agent
 * @param User
 * @returns void
 */
Router.prototype.queueUser = function(user){
    this.queuedUsers.push(user);
    this.sendSuccessfullyQueued();
};


/**
 * add agents who are ready to give response
 * @param  agent
 * @returns void
 */
Router.prototype.addAgentAvailable = function(agent){
    this.availableAgents.push(agent);
    console.log("adding agents on standby for task");
    //console.log(this.availableAgents);
}

/**
 * add agents who login-ed
 * @param  agent
 * @returns void
 */
Router.prototype.addAgentLogin = function(agent){
    this.agents.push(agent);
    console.log("adding agents on standby for task");
    //console.log(this.availableAgents);
}




/**
 * create connection between agent and user, append new connection to connections array
 * @param user, agent
 * @returns void
 */
Router.prototype.createConnection = function(user, agent){
    let connection = new Connection(user,agent);
    user.connection = connection;
    agent.connection = connection;
    
    // put agent in connection from available to unavailable
    this.unAvailableAgents.push(agent);
    this.availableAgents = this.availableAgents.filter(function(value, index, arr)
    { return value !== agent;}
    );

    this.connections.push(connection);
    console.log("Connection created between user" + user.id + "----" + "agent" + agent.id)
};

Router.prototype.endConnection = function(connection){
    
    for(let i = 0; i<this.connections.length; i++){
        if (this.connections[i]===connection){
            this.connections = this.connections.filter(function(value, index, arr)
            {return value !== connection;})
            connection.user.connection=null;
            connection.agent.connection=null;
            console.log("Connection has ended");
        }
    }
    

}

Router.prototype.receiveHangUp = function (user){

    this.endConnection(user.connection);

}



module.exports = Router;