
# Usage
Install everything (including /public folder).
```bash
npm install
```
Run for live deployment of server and client.
Client files are packed into the /public folder.
```bash
npm run build:live
```
Build server and client.
```bash
npm run build
```
Start server (server hosts /public folder).
```bash
npm start
```

## Project Structure
```bash
- devDependencies # typescript dependencies
- public   # public available files
- src
  - client # client related logic
	- engine # basic game engine shared among server and client
	- game   # actual game
	- server # server logic
```



# Server
Server-side code is located in *src/server/*.

## Network Synchronization
The ServerNetworkController synchronizes server side world changes to the client.
Changes are detected using a world listener and distributed after a defined interval.
Changes are not sent directly after they happend but rather cached to not overload the network and client with messages.

## Interpolation

# Design
Colors from http://clrs.cc/.

# Development



## Timeline
### Test Alpha
Network communication:
1. [done] client connects to server
2. [done] server sends basic sprite
3. [done] client renders sprite

Framework:
* logic is separated into
  * World (Data)
  * Network (Synchronization)
  * Server & Client

ToDos:
- [done] add functionality to filter roles by class (use instanceof)
- add Phaser role that is called when added to node
