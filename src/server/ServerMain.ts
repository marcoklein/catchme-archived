
const express = require('express');
const path = require('path');

const app = express();

// use public from cmd dir
app.use(express.static(path.join('', 'public')));

app.use(function (req: any, res: any, next: any) {
    // link not found
    res.status(200).sendFile(__dirname + "/public/index.html");
});


app.listen(4680, function () {
    console.log('Listening on port 4680!');
});


/**
 * Server of a game.
 */
export class ServerMain {

}

export default new ServerMain();
