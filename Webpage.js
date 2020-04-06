let Router = require("./Router.js");
let Customer = require("./Customer.js");


//constructor
function Webpage(router){
    this.router = router;
    this.allCustomers = []
    this.operatingtime = [0700,1800];
}

Webpage.prototype.login = function(customer){
    this.allCustomers.push(customer);
};

Webpage.prototype.logout = function(customer){
    this.allCustomers = this.allCustomers.filter(function(value, index, arr)
    { return value !== customer;}
    );
};

Webpage.prototype.sendRequest = function(customer){
    return this.router.routeRequest(customer);
};

Webpage.prototype.receiveZeroAgent = function(){
    console.log("Webpage: Sorry No Agent!");
};

Webpage.prototype.receiveAvailable = function(){
    console.log("Webpage: Pls wait for us to connect u to an agent!");
    return "Create Connection";
};

Webpage.prototype.receiveQueue = function(customer){
    let u = null;
    //console.log("webpage receiving queue");
    for (let i = 0; i < this.allCustomers.length; i++){
        if (this.allCustomers[i].id===customer.id){
            //console.log("any?");
            let msg = this.allCustomers[i].receiveQueue();
            return msg;
        }
    }  
};

Webpage.prototype.receiveSuccessfullyQueued = function(){
    console.log("You are succesfully queued!");

};

Webpage.prototype.receiveNoAgentForTask = function(){
    console.log("Sorry! There's no agent for your specific request!");

};

Webpage.prototype.sendAvailable = function(customer){
    for (let i = 0; i < this.allCustomers.length; i++){
        if (this.allCustomers[i].id===customer.id){
            
        }
    }
}

Webpage.prototype.hangupButton = function(customer){

    this.router.receiveHangUp(customer);

}

module.exports = Webpage;


