const fs = require('fs');
const {PeerServer} = require('peer');

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

const peerServer = PeerServer({
    port: 3002,
    debug: false,
    secure: true,
    path: '/',
    ssl: options,
});