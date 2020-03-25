let Router = require("./Router.js");
let User = require("./User.js");


//constructor
function Webpage(router){
    this.router = router;
    this.allUsers = []
    this.operatingtime = [0700,1800];
}

Webpage.prototype.login = function(user){
    this.allUsers.push(user);
};

Webpage.prototype.logout = function(user){
    this.allUsers = this.allUsers.filter(function(value, index, arr)
    { return value !== user;}
    );
};

Webpage.prototype.sendRequest = function(user){
    this.router.routeRequest(user);
};

Webpage.prototype.receiveZeroAgent = function(){
    console.log("Webpage: Sorry No Agent!");
};

Webpage.prototype.receiveAvailable = function(){
    console.log("Webpage: Pls wait for us to connect u to an agent!");
    return "Create Connection";
};

Webpage.prototype.receiveQueue = function(user){
    let u = null;
    //console.log("webpage receiving queue");
    for (let i = 0; i < this.allUsers.length; i++){
        if (this.allUsers[i].id===user.id){
            console.log("any?");
            let msg = this.allUsers[i].receiveQueue();
            return msg;
        }
    }  
};

Webpage.prototype.receiveSuccessfullyQueued = function(){
    console.log("You are succesfully queued!");

};

Webpage.prototype.receiveNoAgentForTask = function(){
    console.log("Sorry! There's no agent for ypur specific request!");

};

Webpage.prototype.sendAvailable = function(user){
    for (let i = 0; i < this.allUsers.length; i++){
        if (this.allUsers[i].id===user.id){
            
        }
    }
}

Webpage.prototype.hangupButton = function(user){

    this.router.receiveHangUp(user);

}

module.exports = Webpage;


