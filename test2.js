const express = require('express')
const app = express()
const port = 3000 //ipadreess:port/
var startTimeout = function(timeout, i){
    setTimeout(function() {
        myAsyncFunc(i).then(function(data){
            console.log(data);
        })
    }, timeout);
}

let Router = require("./Routertest.js");
let Customer = require("./Customer.js");
// Load the SDK
let RainbowSDK = require("rainbow-node-sdk");
var Mutex = require('async-mutex').Mutex;
var router = null;

// Define your configuration
let options = {
    "rainbow": {
        "host": "sandbox", // Can be "sandbox" (developer platform), "official" or any other hostname when using dedicated AIO
        "mode": "xmpp" // The event mode used to receive the events. Can be `xmpp` or `s2s` (default : `xmpp`)
    },
    "s2s": {
        "hostCallback": "http://3d260881.ngrok.io", // S2S Callback URL used to receive events on internet
        "locallistenningport": "4000" // Local port where the events must be forwarded from S2S Callback Web server.
    },
    "credentials": {
        "login": "codmtl19@gmail.com", // To replace by your developer credendials
        "password": 'cH{Kg=OzVy"9' // To replace by your developer credentials
    },
    // Application identifier
    "application": {
        "appID": "7c9015906de411eaa8fbfb2c1e16e226",
        "appSecret": "c9JRxoP3dwnBF4R0siuK5LCqHnbQrnLHxl0HU6L9jyi2RGJbjHjaOuQhoPmRH7QJ"
    },
    // Logs options
    "logs": {
        "enableConsoleLogs": true,
        "enableFileLogs": false,
        "color": true,
        "level": 'debug',
        "customLabel": "Admin (TeckLeck)",
        "system-dev": {
            "internals": false,
            "http": false,
        }, 
        "file": {
            path: "/var/tmp/rainbowsdk/",
            customFileName: "R-SDK-Node-Sample2",
            level: "debug",
            zippedArchive : false/*,
            maxSize : '10m',
            maxFiles : 10 // */
        }
    },
    "testOutdatedVersion": true, //Parameter to verify at startup if the current SDK Version is the lastest published on npmjs.com.
    // IM options
    "im": {
        "sendReadReceipt": true, // If it is setted to true (default value), the 'read' receipt is sent automatically to the sender when the message is received so that the sender knows that the message as been read.
        "messageMaxLength": 1024, // the maximum size of IM messages sent. Note that this value must be under 1024.
        "sendMessageToConnectedUser": false, // When it is setted to false it forbid to send message to the connected user. This avoid a bot to auto send messages.
        "conversationsRetrievedFormat": "small", // It allows to set the quantity of datas retrieved when SDK get conversations from server. Value can be "small" of "full"
        "storeMessages": false, // Define a server side behaviour with the messages sent. When true, the messages are stored, else messages are only available on the fly. They can not be retrieved later.
        "nbMaxConversations": 15, // parameter to set the maximum number of conversations to keep (defaut value to 15). Old ones are removed from XMPP server. They are not destroyed. The can be activated again with a send to the conversation again.
        "rateLimitPerHour": 1000, // Set the maximum count of stanza messages of type `message` sent during one hour. The counter is started at startup, and reseted every hour.
        //"messagesDataStore": DataStoreType.NoPermanentStore // Parameter to override the storeMessages parameter of the SDK to define the behaviour of the storage of the messages (Enum DataStoreType in lib/config/config , default value "DataStoreType.UsestoreMessagesField" so it follows the storeMessages behaviour)<br>
                              // DataStoreType.NoStore Tell the server to NOT store the messages for delay distribution or for history of the bot and the contact.<br>
                              // DataStoreType.NoPermanentStore Tell the server to NOT store the messages for history of the bot and the contact. But being stored temporarily as a normal part of delivery (e.g. if the recipient is offline at the time of sending).<br>
                              // DataStoreType.StoreTwinSide The messages are fully stored.<br>
                              // DataStoreType.UsestoreMessagesField to follow the storeMessages SDK's parameter behaviour. 
    },

    // Services to start. This allows to start the SDK with restricted number of services, so there are less call to API.
    // Take care, severals services are linked, so disabling a service can disturb an other one.
    // By default all the services are started. Events received from server are not filtered.
    // So this feature is realy risky, and should be used with much more cautions.
    /* "servicesToStart": {
        "bubbles":  {
            "start_up":true,
        }, //need services : 
        "telephony":  {
            "start_up":true,
        }, //need services : _contacts, _bubbles, _profiles
        "channels":  {
            "start_up":true,
        }, //need services :  
        "admin":  {
            "start_up":true,
        }, //need services :  
        "fileServer":  {
            "start_up":true,
        }, //need services : _fileStorage
        "fileStorage":  {
            "start_up":true,
        }, //need services : _fileServer, _conversations
        "calllog":  {
            "start_up":true,
        }, //need services :  _contacts, _profiles, _telephony
        "favorites":  {
            "start_up":true,
        }
    } */
};

// Instantiate the SDK
let rainbowSDK = new RainbowSDK(options);
const mutex = new Mutex;

// Start the SDK
rainbowSDK.start().then(()=>{
});

rainbowSDK.events.on("rainbow_onready", () => {
    console.log("----Ready----");
    router = new Router(rainbowSDK);
    
    console.log("\n\n--online agents--");
    for(let i = 0; i < router.availableAgents.length; i++){
        console.log(router.availableAgents[i].name + "-----" + router.availableAgents[i].contact.presence);
    }


    console.log("--unavailable agents--")
    for(let i = 0; i < router.unAvailableAgents.length; i++){
        console.log(router.unAvailableAgents[i].name + "-----" + router.unAvailableAgents[i].contact.presence);
    }

    console.log("--offline agents--");
    for(let i = 0; i < router.offlineAgents.length; i++){
        console.log(router.offlineAgents[i].name + "-----" + router.offlineAgents[i].contact.presence);
    }

    console.log("--all agents--");
    for(let i = 0; i < router.agents.length; i++){
        console.log(router.agents[i].name + "-----" + router.agents[i].contact.presence);
    }

    for (let i=0; i<router.agents.length;i++){
        console.log(router.agents[i].name + "---" + router.agents[i].id);
    }

    //set customers
    console.log("we have 20 number of customers, check: ", router.customers.length);
    //2a, 1b, 2c, 1d, 6 agents:
    var chat = "chat";
    router.customers[0].createRequest("Task A", chat);
    router.customers[1].createRequest("Task B", chat);
    router.customers[2].createRequest("Task C", chat);
    router.customers[3].createRequest("Task D", chat);
    for (let i = 0; i < 20; i++) {
        router.customers[0].sendRequest();
        console.log(router.customers[0].name + " sends request for task A for the " + i+1+ "th time.");
        router.customers[1].sendRequest();
        console.log(router.customers[1].name + " sends request for task B for the " + i+1 + "th time.");
        router.customers[2].sendRequest();
        console.log(router.customers[2].name + " sends request for task C for the " + i+1 + "th time.");
        router.customers[3].sendRequest();
        console.log(router.customers[3].name + " sends request for task D for the " + i+1 + "th time.");
    }
    console.log("spam complete.");

});

rainbowSDK.events.on("rainbow_oncontactpresencechanged", (contact) => {

//    console.log("\n\nPresence: " + contact.tags + "---" +contact.presence);
    //console.log(contact);
    var x = contact;
//    console.log("success");
    if (x !== undefined && x.presence!=="unknown"){
//        console.log("---" + x.name.value + " is changing presence to " + x.presence + "---");
        //Check if it is an agent
        if (x.tags[0]==="Agent"){
//            console.log("Yeap it's an agent");
            // if it turns to online
            if (x.presence==="online"){
                //console.log();
                //console.log(router.offlineAgents);
                //console.log(router.availableAgents);
                
                //check if it just log-ed in or come back from away
                for(let i=0; i<router.unAvailableAgents.length; i++){

                    //if from away
                    if (x.jid === router.unAvailableAgents[i].id){
                        router.updateAgentStatus(x);
                        router.routeAgent(x);
                    }
                }
                
                for(let i=0; i<router.offlineAgents.length; i++){
                    
                    // if just log-ed in
                    if (x.jid === router.offlineAgents[i].id){
                        router.addAgentLogin(x);
                        router.routeAgent(x);
                    }
                }
            }
            
            // if agent logout
            if (x.presence==="offline"){
                router.addAgentLogout(x);
            }
            
            // if it turns to away
            if (x.presence==="away"){
                for(let i=0; i<router.availableAgents.length; i++){

                    //if from online                    
                    if (x.jid === router.availableAgents[i].id){
                        router.updateAgentStatus(x);
                    }
                }
            }
            
        }

        console.log("\n\n---After Change---");
        console.log("--online agents--");
        for(let i = 0; i < router.availableAgents.length; i++){
            console.log(router.availableAgents[i].name + "-----" + router.availableAgents[i].contact.presence);
        }


        console.log("--unavailable agents--")
        for(let i = 0; i < router.unAvailableAgents.length; i++){
            console.log(router.unAvailableAgents[i].name + "-----" + router.unAvailableAgents[i].contact.presence);
        }

        console.log("--offline agents--");
        for(let i = 0; i < router.offlineAgents.length; i++){
            console.log(router.offlineAgents[i].name + "-----" + router.offlineAgents[i].contact.presence);
        }

        console.log("--all agents--");
        for(let i = 0; i < router.agents.length; i++){
            console.log(router.agents[i].name + "-----" + router.agents[i].contact.presence);
        }

    }
});

/* rainbowSDK.events.on('rainbow_onmessagereceived', (message) => {
    
    //TODO: Check if the message comes from an agent

    // Check if the message comes from admin
    
    
}); */
app.get("/disconnect",(req,res)=>{
    let djid = req.query["djid"];
    let daid = req.query["daid"];
    console.log("xxxxxxx");
    router.kickCustomer(djid);
    res.send("DISCONNECTED");
});
app.get('/', (req, res)=> {
    let task = req.query["task"]; //TASK A OR B OR C OR D
    let type= req.query["type"];
    let jid = req.query["jid"]; // text OR call By defaul lets make it text
    
    task = "Task " + task
    console.log(task);
    console.log(type);
    console.log(jid);
    
    let z = router.createCustomerRequest(jid, task, type);
    console.log("z:");
    console.log(z);
    
     //SEND REQUEST USING TASK AND TYPE
    
     //userLastname = "ssss";
    // router.customer.sendrequest(task);
    /*
    x can be:
    1. "You are not signed up (not in admin's contacts)" - customer havent signed up
    2. "No Agent At Work" - no agent at all online busy away, all agents are offline
    3. "No Agent for your specific task" - means there are agents (busy or away) but is not attending to that task
    4. "Ask: Queue?" - have agent with the same task, but busy or away
    5. "ERROR" - routing problem
    6. agents jid - there is an available agent
    */
    res.send(z);
 });
 app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));