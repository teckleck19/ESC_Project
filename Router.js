let Webpage = require("./Webpage.js");
let Customer = require("./Customer.js");
let Connection = require("./Connection");
let Agent = require("./Agent.js");


//constuctor
function Router(Rainbow){
    this.rbwsdk = Rainbow;
    this.webpage = new Webpage(this);
    this.customers = this.createCustomerList();
    this.agents = this.createAgentList();
    
    this.availableAgents = this.createAvailableAgentList();
    this.unAvailableAgents = this.createUnavailableAgentList();
    this.queuedCustomers = new Array();
    this.connections = new Array();
}

/**
 * Route Request Sent from webpage
 * @param customer_jid
 * @returns void or agent
 * @throws what kind of exception does this method throw
*/
Router.prototype.routeRequest = function (customer){
    

    var msg = "";
    let agent = null;
    // Checks agent availability
    if (this.availableAgents.length === 0 && this.unAvailableAgents.length === 0){
        console.log("Router: Sorry! There's no available agent that is online!");
        this.sendZeroAgent();
        
    }
    
    else{
        
        var temp =1000;
        for (let i=0; i<this.availableAgents.length; i++){
            console.log(this.availableAgents[i].connections.length);
            if (this.availableAgents[i].task === customer.request.what && this.availableAgents[i].connections.length < temp){
                temp = this.availableAgents[i].connections.length;
                msg = this.sendAvailable();
                agent = this.availableAgents[i];
                this.availableAgents = this.availableAgents.filter(function(value, index, arr)
                { return value !== agent;});
                this.availableAgents.push(agent);
                console.log("Router: There's an available agent!");
            }
        }
        
        if (msg === ""){
            //console.log("Routing to queue");
            //console.log(this.unAvailableAgents);
            for (let i=0; i<this.unAvailableAgents.length; i++){
                if (this.unAvailableAgents[i].task === customer.request.what){
                    console.log("Router: Waiting for customer's response to queue request.");
                    msg = this.sendQueue(customer);
                }
            }
        }
        if (msg === ""){
            this.sendNoAgentForTask();
        }
    }
    
    if (msg===""){
        return;
    }

    else if (msg==="Cancel"){
        console.log("Request is cancelled!")
    }

    else if (msg==="Queue"){
        this.queueCustomer(customer);
    }

    else if (msg==="Create Connection" & agent!=null){
        //this.notifyAgent(customer.request);
        this.createConnection(customer,agent);
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

Router.prototype.sendQueue = function(customer){
    return this.webpage.receiveQueue(customer);
};

Router.prototype.sendSuccessfullyQueued = function(){
    this.webpage.receiveSuccessfullyQueued();
};

Router.prototype.sendNoAgentForTask = function(){
    this.webpage.receiveNoAgentForTask();
};
/**
 * queue customer for next available agent
 * @param Customer
 * @returns void
 */
Router.prototype.queueCustomer = function(customer){
    this.queuedCustomers.push(customer);
    this.sendSuccessfullyQueued();
};


/**
 * add agents who are ready to give response
 * @param  agent
 * @returns void
 */
Router.prototype.addAgentAvailable = function(agent){
    this.availableAgents.push(agent);
    console.log("adding agent with id " + agent.id +  " on standby for task " + agent.task);
    //console.log(this.availableAgents);
}

/**
 * add agents who login-ed
 * @param  agent
 * @returns void
 */
Router.prototype.addAgentLogin = function(agent){
    this.agents.push(agent);
    console.log("adding agent to login-ed list");
    //console.log(this.availableAgents);
}




/**
 * create connection between agent and customer, append new connection to connections array
 * @param customer, agent
 * @returns void
 */
Router.prototype.createConnection = function(customer, agent){
    let connection = new Connection(customer,agent,this.rbwsdk);
    customer.connection = connection;
    agent.connections.push(connection);
    
    // put agent in connection from available to unavailable if num of customers >= 3
    if (agent.connections.length>=3){
        this.unAvailableAgents.push(agent);
        this.availableAgents = this.availableAgents.filter(function(value, index, arr)
        { return value !== agent;}
        );
    }
    else{
        this.connections.push(connection);
        let a = new Array();
        
        //console.log(this.availableAgents);
        a.push(customer.contact.id);
        try{
            this.rbwsdk.contacts.joinContacts(agent.contact,a);
        }
        catch(err){};
        console.log("Connection created between customer" + customer.name + "----" + "agent" + agent.name);
    }

    
    
    
};

Router.prototype.endConnection = function(connection){
    
    for(let i = 0; i<this.connections.length; i++){
        if (this.connections[i]===connection){
            this.connections = this.connections.filter(function(value, index, arr)
            {return value !== connection;})
            connection.customer.connection=null;
            for (let i=0;i<connection.agent.connections.length;i++){
                if (connection.agent.connections[i]==connection){
                connection.agent.connection=null;
                }
            }
            console.log("Connection between customer" + connection.customer.name + " and agent" + connection.agent.name + " has ended");
        }
    }

    this.availableAgents.push(connection.agent);
    this.unAvailableAgents = this.unAvailableAgents.filter(function(value, index, arr)
    { return value !== connection.agent;});
    

}

Router.prototype.receiveHangUp = function(CorA){

    this.endConnection(CorA.connection);

}



//Create List of Agents
Router.prototype.createAgentList = function(){
    var A = new Array();
    var contacts = this.rbwsdk.contacts.getAll();
    for(let i=0; i<contacts.length; i++){
        console.log(contacts[i].name.value);
        if(contacts[i].name.value!=="Teck Leck Ma"){
            if(contacts[i].tags[0]==="Agent"){
                A.push(new Agent(contacts[i]));
            }
        }
    }
    return A;
}

Router.prototype.createCustomerList = function(){
    var A = new Array();
    var contacts = this.rbwsdk.contacts.getAll();
    
    for(let i=0; i<contacts.length; i++){
        //console.log(this.rbwsdk.admin.getAllUsers());
        if(contacts[i].name.value!=="Teck Leck Ma"){
            if(contacts[i].tags[0]==="Customer"){
                A.push(new Customer(contacts[i],this.webpage));
            }
        }
    }
    return A;
}

Router.prototype.createAvailableAgentList = function(){
    let A = new Array();
    for(let i=0; i<this.agents.length; i++){
        if(this.agents[i].status==="online"){
            A.push(this.agents[i]);
        }
    }
    return A;
}

Router.prototype.createUnavailableAgentList = function(){
    let A = new Array();
    for(let i=0; i<this.agents.length; i++){
        if(this.agents[i].status==="busy"||this.agents[i].status==="away"){
            A.push(this.agents[i]);
        }
    }
    return A;
}



module.exports = Router;