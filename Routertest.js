let Webpage = require("./Webpage.js");
let Customer = require("./Customer.js");
let Connection = require("./Connection");
let Agent = require("./Agent.js");
let Rbwsdk = require("rainbow-node-sdk");


//constuctor
function Routertest(Rainbow){
    
    this.rbwsdk = Rainbow;
    this.webpage = new Webpage(this);
    this.customers = this.createCustomerList();
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
Routertest.prototype.routeRequest = function (customer){
    

    
    var notfound = true;
    var num = null;
    
    
    // Checks agent availability
    if (this.availableAgents.length === 0 && this.unAvailableAgents.length === 0){
        console.log("Router: Sorry! There's no available agent that is online!");
        return "No Agent At Work";   
    }
    
    else{
        
        var temp =1000;
        for (let i=0; i<this.availableAgents.length; i++){
            console.log(this.availableAgents[i].numOfConnections);
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
                    console.log("PleaseQueue");
                    this.queueCustomer(customer);
                    return "PleaseQueue";
                
                }
            }
        }
        
        if (notfound){
            console.log("Agents that are busy or away, none of them are attending to your specific task");
            return "No Agent For Your Specific Task";
        }

        var agent = this.availableAgents[num];
        if (num!==null){
            
            
       this.availableAgents[num].numOfConnections = this.availableAgents[num].numOfConnections + 1;
                let temporary= this.availableAgents[num].id;

            console.log("Found An Agent");
 
           if (this.availableAgents[num].numOfConnections >= 3){
                //THIS . STATUS?
                //TODO: set agents presence to dnd
                this.rbwsdk.im.sendMessageToJid("Set to Busy",this.availableAgents[num].id);
                this.unAvailableAgents.push(this.availableAgents[num]);
                this.availableAgents.splice(num,1);
            }
   return "Found An Agent";

      }

        console.log("error");
        return "ERROR";

    }
};


/**
 * route queued customer for available agent (from unavailable to available)
 * @param contact
 * @returns agent, customer
 */
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatnomechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
Routertest.prototype.routeAgent = function(contact){

    var num = null
    var agent = null;
    for(let i=0; i<this.availableAgents.length; i++){
        if (contact.jid === this.availableAgents[i].id){
            agent = this.availableAgents[i];
            num = i;
        }
    }console.log("QUEEUEDD CUSOTMERS");
console.log(this.queuedCustomers);
console.log("IN THE ROUTE AGENT");
    for(let i=0; i<this.queuedCustomers.length; i++){
        if (this.queuedCustomers[i].request.what===agent.task){
            this.availableAgents[num].numOfConnections = this.availableAgents[num].numOfConnections + 1;
            if (this.availableAgents[num].numOfConnections >= 3){
                
                //TODO: set agents presence to dnd
                this.rbwsdk.im.sendMessageToJid("Set to Busy",this.availableAgents[num].id);
                this.unAvailableAgents.push(this.availableAgents[num]);
                this.availableAgents.splice(num,1);
            }
            this.rbwsdk.im.sendMessageToJid("Hey you can message now! Happy to assist you.",this.queuedCustomers[i].id);
            this.kickCustomer(this.queuedCustomers[i].id);
            httpGetAsync("http://ec2-18-223-16-89.us-east-2.compute.amazonaws.com:3002/updatejid?cid="+this.queuedCustomers[i].id+"&aid="+agent.id,(res)=>{console.log(res)});
            console.log("UPDATINGGGGGGGGG");         
            break;            

            //TODO: send to rahuls server
        //    return agent.id + " " + this.queuedCustomer[i].id;
        }
    }
}



/**
 * queue customer: put customer into queue
 * @param Customer
 * @returns void
 */
Routertest.prototype.queueCustomer = function(customer){
    this.queuedCustomers.push(customer);
};

Routertest.prototype.kickCustomer = function(customer_jid){
    
    for (let i=0;i<this.queuedCustomers.length;i++){

        if (customer_jid==this.queuedCustomers[i].id){
            this.queuedCustomers.splice(i,1);
            console.log("kick customer with jid: " + customer_jid);
        }
    }
};








Routertest.prototype.updateAgentStatus = function(contact){


    //from away (unavailable) OR offline to online (available)
    if (contact.presence === "online"){
        for(let i=0; i<this.agents.length; i++){
            if(this.agents[i].id===contact.jid){
                this.agents[i]=new Agent(contact);
            }
        }
        for(let i=0; i<this.unAvailableAgents.length; i++){
            if(this.unAvailableAgents[i].id===contact.jid){
                this.availableAgents.push(this.unAvailableAgents[i]);
                this.unAvailableAgents.splice(i,1);

                
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
                this.availableAgents.splice(i,1);
                this.unAvailableAgents.push(new Agent(contact));
                
            }
        }
        
    }

    

}


Routertest.prototype.addAgentLogin = function(contact){
    
    for(let i = 0; i<this.offlineAgents.length;i++){
        if (contact.jid===this.offlineAgents[i].id){
            
            this.offlineAgents.splice(i,1);
            this.availableAgents.push(new Agent(contact));
        }
    }
    
    //console.log("adding agent with id " + agent.id +  " on standby for task " + agent.task);
    //console.log(this.availableAgents);
}

Routertest.prototype.addAgentLogout = function(contact){
    
    for(let i = 0; i<this.availableAgents.length;i++){
        if (contact.jid===this.availableAgents[i].id){
            console.log("found online going offline");
            this.availableAgents.splice(i,1);
            //console.log("spliced");
            this.offlineAgents.push(new Agent(contact));
            //console.log("push");
        }
    }

    for(let i = 0; i<this.unAvailableAgents.length;i++){
        if (contact.jid===this.unAvailableAgents[i].id){
            console.log("found away going offline");
            this.unAvailableAgents.splice(i,1);
            this.offlineAgents.push(new Agent(contact));
        }
    }
    
    //console.log("adding agent with id " + agent.id +  "logging out from " + agent.task);
    //console.log(this.availableAgents);
}

















// TODO
Routertest.prototype.endConnection = function(jid){
    
    /* for(let i = 0; i<this.connections.length; i++){
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
    { return value !== connection.agent;}); */
    for (let i=0; i<this.availableAgents.length; i++){
        if (jid===this.availableAgents[i].id){
            this.availableAgents[i].numOfConnections =  this.availableAgents[i].numOfConnections - 1;
        }
    }
    for (let i=0; i<this.unAvailableAgents.length; i++){
        if (jid===this.unAvailableAgents[i].id){
            this.unAvailableAgents[i].numOfConnections =  this.unAvailableAgents[i].numOfConnections - 1;
            this.rbwsdk.im.sendMessageToJid("Set to Online",this.unAvailableAgents[i].id);
            //this.availableAgents.push(this.unAvailableAgents[i]);
            //this.unAvailableAgents.splice(i,1);
            
        }
    }
    

}

Routertest.prototype.receiveHangUp = function(CorA){

    this.endConnection(CorA.connection);

}

















//Create List of Agents
Routertest.prototype.createAgentList = function(){
    var A = new Array();
    console.log("------------Contacts------------");
    var contacts = this.rbwsdk.contacts.getAll();
    for(let i=0; i<contacts.length; i++){
        console.log(contacts[i].name.value + "---" + contacts[i].presence);
        if(contacts[i].name.value!=="Teck Leck Ma"){
            if(typeof contacts[i].tags !== 'undefined' && contacts[i].tags[0]==="Agent"){
                A.push(new Agent(contacts[i]));
            }
        }
    }
    return A;
}

Routertest.prototype.createCustomerList = function(){
    var A = new Array();
    var contacts = this.rbwsdk.contacts.getAll();
    
    for(let i=0; i<contacts.length; i++){
        console.log(contacts[i].name.value);
        //console.log(this.rbwsdk.admin.getAllUsers());
        if(contacts[i].name.value!=="Teck Leck Ma"){
            if(typeof contacts[i].tags === 'undefined' || contacts[i].tags[0]!=="Agent" ){//||typeof(contacts[i].tags[0])===undefined){
                A.push(new Customer(contacts[i],this.webpage));
            }
        }
    }
    return A;
}

Routertest.prototype.createAvailableAgentList = function(){
    let A = new Array();
    for(let i=0; i<this.agents.length; i++){
        if(this.agents[i].status==="online"){
            A.push(this.agents[i]);
        }
    }
    return A;
}

Routertest.prototype.createUnavailableAgentList = function(){
    let A = new Array();
    for(let i=0; i<this.agents.length; i++){
        if(this.agents[i].status==="busy"||this.agents[i].status==="away"){
            A.push(this.agents[i]);
        }
    }
    return A;
}

Routertest.prototype.createOfflineAgentList = function(){
    let A = new Array();
    for(let i=0; i<this.agents.length; i++){
        if(this.agents[i].status==="offline" || this.agents[i].status==="unknown"){
            A.push(this.agents[i]);
        }
    }
    return A;
}

Routertest.prototype.createCustomerRequest = function(jid, task, type){
    var customerNum = null;
    for (let i = 0; i<this.customers.length; i++){
        if (jid===this.customers[i].id){

            customerNum = i;

        }
    }
    if (customerNum===null){
        return "You are not signed up (not in admin's contacts)"
    }
    else{
        this.customers[customerNum].createRequest(task, type);
        return this.customers[customerNum].sendRequest();
    }
}

module.exports = Routertest;