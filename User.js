let Request = require("./Request.js");
let Webpage = require("./Webpage.js")
const prompt = require('prompt-sync')({sigint: true});

let u = User.prototype;

function User(id, passwd, webpage){
    this.id = id;
    this.passwd = passwd;
    this.connection = null;
    this.request = null;
    this.webpage = webpage;
    this.connection = null;
}

u.createRequest = function(what,how){
    this.request = new Request(what,how);
}

u.sendRequest = function (){
    console.log("\n\nuser"+ this.id+" is sending Request");
    if (this.request !== null){
        this.webpage.sendRequest(this);
    }
    else{
        console.log("U have not configure your request!");
    }
}

u.userEndConnection = function(){
    console.log("\n\nuser"+ this.id+" hung up");
    this.webpage.hangupButton(this);
}

u.receiveQueue = function(){
    msg = prompt("To user with id " + this.id + ": Queue or Cancel? ");
    return msg;
}
module.exports = User;