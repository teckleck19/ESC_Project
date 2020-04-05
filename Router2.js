let Webpage = require("./Webpage.js");
let Customer = require("./Customer.js");
let Connection = require("./Connection");
let Agent = require("./Agent.js");
let Rbwsdk = require("rainbow-node-sdk");


//constuctor
function Router2(Rainbow){
    
    this.rbwsdk = Rainbow;
    this.agents = this.createAgentList();
    this.availableAgents = this.createAvailableAgentList();
    this.unAvailableAgents = this.createUnavailableAgentList();
    this.offlineAgents = this.createOfflineAgentList();
    this.queuedCustomers = new Array();
    this.connections = new Array();
}

/**
 * Route Request Sent from webpage
 * @param customer_jid
 * @returns void or agent
 * @throws what kind of exception does this method throw
*/
Router2.prototype.routeRequest = function (customer){
    
    let notfound = true;
    let num = null;

    // Checks agent availability
    if (this.availableAgents.length === 0 && this.unAvailableAgents.length === 0){
        console.log("Router: Sorry! There's no available agent that is online!");
        return "No Agent At Work";   
    }
    
    else{
        
        var temp =1000;
        for (let i=0; i<this.availableAgents.length; i++){
            console.log(this.availableAgents[i].connections.length);
            if (this.availableAgents[i].task === customer.request.what && this.availableAgents[i].numOfConnections < temp){
                temp = this.availableAgents[i].numOfConnections;
                num = i;
                // this.availableAgents = this.availableAgents.filter(function(value, index, arr)
                // { return value !== agent;});
                // this.availableAgents.push(agent);
                notfound = false;

            
            }
        }
        
        if (notfound){
            //console.log("Routing to queue");
            //console.log(this.unAvailableAgents);
            for (let i=0; i<this.unAvailableAgents.length; i++){
                if (this.unAvailableAgents[i].task === customer.request.what){
                    console.log("Ask: Queue?");
                    return "Ask: Queue?";
                
                }
            }
        }
        
        if (notfound){
            return "No Agent For Your Specific Task";
        }

        if (agent!==null){

            this.availableAgents[num].numOfConnections = this.availableAgents[num].numOfConnections + 1;
            
            if (this.availableAgents[num].numOfConnections >= 3){
                this.availableAgents[num].status = "dnd";
                //TODO: set agents presence to dnd
                rbwsdk.im.sendMessageToJid("Set to dnd",this.availableAgents[num].id);
            }
            
            return this.availableAgents[num].id;
        }

        return "ERROR";

    }
};

/**
 * queue customer: put customer into queue
 * @param Customer
 * @returns void
 */
Router2.prototype.queueCustomer = function(customer){
    this.queuedCustomers.push(customer);
};

/**
 * route queued customer for available agent (from unavailable to available)
 * @param contact
 * @returns agent, customer
 */
Router2.prototype.routeAgent = function(contact){

    
    var agent = null;
    for(let i=0; i<this.availableAgents; i++){
        if (contact.jid === this.availableAgents[i].id){
            agent = this.availableAgents[i].id;
        }
    }
    for(let i=0; i<this.queueCustomer; i++){
        if (this.queuedCustomer[i].request.what===agent.task){
            

            //TODO: send to rahuls server
            return agent.id + " " + this.queuedCustomer[i].id;
        }
    }
}

Router2.prototype.updateAgentStatus = function(contact){


    //from away (unavailable) to online (available)
    if (contact.presence === "online"){
        for(let i=0; i<this.agents.length; i++){
            if(this.agents[i].id===contact.jid){
                this.agents[i]=new Agent(contact);
            }
        }
        for(let i=0; i<this.unAvailableAgents.length; i++){
            if(this.unAvailableAgents[i].id===contact.jid){
                this.unAvailableAgents.splice(i,i+1)
                this.availableAgents.push(new Agent(contact));
                
            }
        }
    }

    // from online to away
    else if (contact.presence === "away"){
        for(let i=0; i<this.agents.length; i++){
            if(this.agents[i].id===contact.jid){
                this.agents[i]=new Agent(contact);
            }
            
        }
        
        for(let i=0; i<this.availableAgents.length; i++){
            if(this.availableAgents[i].id===contact.jid){
                
                // this.availableAgents = this.availableAgents.filter(function(value, index, arr)
                // { return value !== this.availableAgents[i]});
                this.availableAgents.splice(i,i+1);
                
                this.unAvailableAgents.push(new Agent(contact));
                
            }
        }
        
    }
}


Router2.prototype.addAgentLogin = function(contact){
    
    for(let i = 0; i<this.offlineAgents.length;i++){
        if (contact.jid===this.offlineAgents[i].id){
            
            this.offlineAgents.splice(i,i+1);
            this.availableAgents.push(new Agent(contact));
        }
    }
    
    console.log("adding agent with id " + agent.id +  " on standby for task " + agent.task);
    //console.log(this.availableAgents);
}


// TODO
Router2.prototype.endConnection = function(contact){
    
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

Router2.prototype.receiveHangUp = function(CorA){

    this.endConnection(CorA.connection);

}



//Create List of Agents
Router2.prototype.createAgentList = function(){
    var A = new Array();
    console.log("------------Contacts------------");
    var contacts = this.rbwsdk.contacts.getAll();
    for(let i=0; i<contacts.length; i++){
        console.log(contacts[i].name.value + "---" + contacts[i].presence);
        if(contacts[i].name.value!=="Teck Leck Ma"){
            if(contacts[i].tags[0]==="Agent"){
                A.push(new Agent(contacts[i]));
            }
        }
    }
    return A;
}

Router2.prototype.createCustomerList = function(){
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

Router2.prototype.createAvailableAgentList = function(){
    let A = new Array();
    for(let i=0; i<this.agents.length; i++){
        if(this.agents[i].status==="online"){
            A.push(this.agents[i]);
        }
    }
    return A;
}

Router2.prototype.createUnavailableAgentList = function(){
    let A = new Array();
    for(let i=0; i<this.agents.length; i++){
        if(this.agents[i].status==="busy"||this.agents[i].status==="away"){
            A.push(this.agents[i]);
        }
    }
    return A;
}

Router2.prototype.createOfflineAgentList = function(){
    let A = new Array();
    for(let i=0; i<this.agents.length; i++){
        if(this.agents[i].status==="offline"){
            A.push(this.agents[i]);
        }
    }
    return A;
}




module.exports = Router2;