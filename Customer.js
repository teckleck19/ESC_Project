let Request = require("./Request.js");
let Webpage = require("./Webpage.js")
const prompt = require('prompt-sync')({sigint: true});

let u = Customer.prototype;

function Customer(contact, webpage){
    
    this.contact=contact;
    this.name = this.contact.name.value;
    this.id = this.contact.jid;
    this.connection = null;
    this.request = null;
    this.webpage = webpage;
}

u.createRequest = function(what,how){
    this.request = new Request(what,how);
}

u.sendRequest = function (){
    console.log("\n\n" + this.name+ " is sending Request");
    if (this.request !== null){
        return this.webpage.sendRequest(this);
    }
    else{
        console.log("U have not configure your request!");
    }
}

/* u.customerEndConnection = function(){
    console.log("\n\ncustomer"+ this.name+" hung up");
    this.webpage.hangupButton(this);
} */

/* u.receiveQueue = function(){
    msg = prompt("To customer with id " + this.name + ": Queue or Cancel? ");
    return msg;
} */
module.exports = Customer;