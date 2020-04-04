let Router = require("./Router.js");
let Customer = require("./Customer.js");
// Load the SDK
let RainbowSDK = require("rainbow-node-sdk");
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
        "customLabel": "vincent01",
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


// Start the SDK
rainbowSDK.start().then(()=>{
    
    console.log("----Starting----");
    router = new Router(rainbowSDK);
    /* // Instantiate the router and webpage
    
    let webpage = router.webpage;

    // Create Users
    let user1 = new User(0001,"pw01",webpage);
    let user2 = new User(0002,"pw02",webpage);
    let user3 = new User(0003,"pw03",webpage);
    let user4 = new User(0004,"pw04",webpage);

    // Create User Requests
    user1.createRequest("a","chat");
    user2.createRequest("b","chat");
    user3.createRequest("c","call");
    user4.createRequest("a","call");

    // sending requests
    user1.sendRequest(); */

    
    
    /* //create agents 
    let userEmailAccount = "agent2@C03G14company.com";
    let userPassword = "Agent2password!";
    let userFirstname = "Agent";
    let userLastname = "002";

    rainbowSDK.admin.createUserInCompany(userEmailAccount, userPassword, userFirstname, userLastname).then((user) => {
        // Do something when the user has been created and added to that company
        
    }).catch((err) => {
        // Do something in case of error
        
    }); */

    /* //create customer 
    let userEmailAccount = "customer2@C03G14company.com";
    let userPassword = "Customer2password!";
    let userFirstname = "Customer";
    let userLastname = "002";

    rainbowSDK.admin.createUserInCompany(userEmailAccount, userPassword, userFirstname, userLastname).then((user) => {
        // Do something when the user has been created and added to that company
        console.log("Customer Created");
    }).catch((err) => {
        // Do something in case of error
        console.log("Error: " + err);
    });
 */

    /* //create guests
    let guestFirstname = "Guest";
    let guestLastname = "001";
    let language = "en-US";
    let ttl = 86400 // active for a day

    rainbowSDK.admin.createGuestUser(guestFirstname, guestLastname, language, ttl).then((guest) => {
        // Do something when the guest has been created and added to that company
        console.log(guest);
    }).catch((err) => {
        // Do something in case of error
        console.log("Guest already exists");
    }); */
    
   
    
    
    

    //rainbowSDK.im.sendMessageToJid("Hi Welcome to C03G14 company","1121e8d678d04685a4e782d8bcadbbe4@sandbox-all-in-one-rbx-prod-1.rainbow.sbg");
    //rainbowSDK.im.sendMessageToJid("Hi Welcome to C03G14 company","39e4211276844febaee596ae90f4e4f8@sandbox-all-in-one-rbx-prod-1.rainbow.sbg");

});

rainbowSDK.events.on("rainbow_onready", () => {

    /* // Get your network's list of contacts
    var contacts = rainbowSDK.contacts.getAll();
    
    // Do something with this list
    var a = 'Task A';
    //console.log(contacts[0].tags[0]);
    for(let i = 0; i<contacts.length-1; i++ ){
        if (contacts[i].tags[0]===a){
            console.log("found");
            console.log(contacts[i].tags[0]);
            console.log(contacts[i].jid);
            rainbowSDK.im.sendMessageToJid("Found You!",contacts[i].jid);
        }
    }  */
    
    //let a = rainbowSDK.contacts.getAll();
    //console.log(a);
    //console.log(router.unAvailableAgents);
    //console.log(router.availableAgents[0].name);
    //console.log(router.availableAgents[1].name);
    /* var router = new Router(rainbowSDK);
    router.customers[0].createRequest("Task A","call");
    router.customers[0].sendRequest();
    router.customers[1].createRequest("Task B","call");
    router.customers[1].sendRequest(); */
    
    // TODO ask "debug: vincent01 - XMPP/HNDL/CONV - (_onMessageReceived) with no message text, so ignore it! hasATextMessage :  false"
    rainbowSDK.im.sendMessageToJid("Set to Busy","007b8ad5894143b89cb9e834de1695ba@sandbox-all-in-one-rbx-prod-1.rainbow.sbg");
}); 

/* rainbowSDK.events.on('rainbow_onmessagereceived', (message) => {
    
    //TODO: Check if the message comes from an agent

    // Check if the message comes from admin
    
    
}); */

rainbowSDK.events.on("rainbow_oncontactpresencechanged", (contact) => {
    
    console.log("---" + contact.name.value + " is changing presence to " + contact.presence );
    //Check if it is an agent
    if (contact.tags[0]==="Agent"){
        
        // if it turns to online
        if (contact.presence==="online"){
            //check if it just log-ed in or come back from away
            for(let i=0; i<router.unAvailableAgent.length; i++){

                //if from away
                if (contact.jid === router.unAvailableAgent[i].id){
                    router.updateAgentStatus(contact);
                    router.routeAgent(contact);
                    break;
                }
            }
            // if just log-ed in
            router.addAgentLogin(contact);
            router.routeAgent(contact);
        }

        // if it turns to away
        if (contact.presence==="away"){
            for(let i=0; i<router.availableAgent.length; i++){

                //if from away
                if (contact.jid === router.availableAgent[i].id){
                    router.updateAgentStatus(contact);
                    break;
                }
            }
        }
    }

    
    
});
    