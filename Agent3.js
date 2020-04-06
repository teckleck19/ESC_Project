let RainbowSDK = require("rainbow-node-sdk");

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
        "login": "agent3@c03g14company.com", // To replace by your developer credendials
        "password": 'Agent3password!' // To replace by your developer credentials
    },
    // Application identifier
    "application": {
        "appID": "7c9015906de411eaa8fbfb2c1e16e226",
        "appSecret": "c9JRxoP3dwnBF4R0siuK5LCqHnbQrnLHxl0HU6L9jyi2RGJbjHjaOuQhoPmRH7QJ"
    },
    // Logs options
    "logs": {
        "enableConsoleLogs": false,
        "enableFileLogs": false,
        "color": true,
        "level": 'debug',
        "customLabel": "agent3",
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

let rainbowSDK = new RainbowSDK(options);

rainbowSDK.start().then(()=>{

});

rainbowSDK.events.on('rainbow_onstarted', () => {
    console.log("started");
});

rainbowSDK.events.on("rainbow_onconnected",()=>{
    
    console.log("connected");
    
});

rainbowSDK.events.on('rainbow_onready', () => {
        
        
    console.log("Agent 1 is online");

    rainbowSDK.events.on('rainbow_onmessagereceived', (message) => {
    
        if (message.type==="chat"){
            // Check if the message comes from admin
            if(message.fromJid === "5e0d870daebd4ad7bff9a9b34fd53bfe@sandbox-all-in-one-rbx-prod-1.rainbow.sbg") {
                // Do something with the message       
                if (message.content==="Set to Busy"){
                    //rainbowSDK.presenceService.setPresenceTo("dnd");
                    //console.log(rainbowSDK.presenceService.getUserConnectedPresence());
                    rainbowSDK.presence.setPresenceTo("dnd");
                }
                if (message.content==="Set to Online"){
                    rainbowSDK.presence.setPresenceTo("online");
                }                console.log("msg from admin!!");
                console.log(message.content);
                
            }
            
        }
        
    });
    
    rainbowSDK.events.on('rainbow_oncontactpresencechanged', (contact) => {
        
        
    });


});



rainbowSDK.events.on('rainbow_onstopped', () => {
    
});