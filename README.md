#### ESC Project (Routing Part)

---

1. Pressing (submit) button in Rahul's frontend, this server will send a String back, String can be:

   - "You are not signed up (not in admin's contacts)" - customer have'nt signed up

   - "No Agent At Work" - no agent at all online busy away, all agents are offline
   - "No Agent for your specific task" - means there are agents (busy or away) but is not attending to that task
   - "Ask: Queue?" - have agent with the same task, but busy or away
   - "ERROR" - routing problem
   - An agent's jid - there is an available agent **!!! Create Connection here !!!**

2. If received "Ask: Queue?", customer can choose (Queue) or (Cancel),

   - If (Queue), user will be push to a list (queuedCustomers)
   - If (Cancel), nothing will happen

3. When one of the agents comes online from (offline, busy, away)

   - Main server is able to listen to that event (onContactPresenceChanged)
   - And route the agent to the one of the customer in queuedCustomers (tasks have to match)
   - It tasks matches, it will then send a String of customer's Jid and agent's Jid to Rahul's server. **!!! Implement a way to send the string to your server. To get the string, refer to router2.routeAgent(contact) method !!!**

4. Ending Connection **!!! Figure a way to trigger an end of connection !!!**
   - then use router.endConnection(jid) -- jid = agent's jid
   - the function will set an agent back to online if he was busy  (>3 connections)