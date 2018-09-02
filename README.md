


# Server
Server-side code is located in *src/server/*.

## Network Synchronization
The ServerNetworkController synchronizes server side world changes to the client.
Changes are detected using a world listener and distributed after a defined interval.
Changes are not sent directly after they happend but rather cached to not overload the network and client with messages.

## Interpolation


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
