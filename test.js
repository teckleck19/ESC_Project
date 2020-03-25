let Router = require("./Router");
let User = require("./User");
let Agent = require("./Agent");
const prompt = require('prompt-sync')({sigint: true});

// Instantiate the router and webpage
let router = new Router();
let webpage = router.webpage;

// Create Users
let user1 = new User(0001,"pw01",webpage);
let user2 = new User(0002,"pw02",webpage);
let user3 = new User(0003,"pw03",webpage);
let user4 = new User(0004,"pw04",webpage);

// Users login
webpage.login(user1);
webpage.login(user2);
webpage.login(user3);
webpage.login(user4);

// Create Users' Requests
user1.createRequest("a","chat");
user2.createRequest("b","chat");
user3.createRequest("c","call");
user4.createRequest("a","call");

// Create Agents
let agent1 = new Agent(0001,"pw_A");
let agent2 = new Agent(0002,"pw_B");
let agent3 = new Agent(0003,"pw_C");

// Agents login to rainbow and standby for task;
agent1.loginToRainbow(router);
agent2.loginToRainbow(router);
agent3.loginToRainbow(router);
agent1.standbyForTask("a");
agent2.standbyForTask("b");
agent3.standbyForTask("c");

user1.sendRequest();
user2.sendRequest();
user3.sendRequest();
user1.userEndConnection();
console.log(user1.connection);
user4.sendRequest();
console.log(router.queuedUsers);
console.log(".............");



