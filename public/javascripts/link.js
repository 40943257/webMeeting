const socket = io('/')
const myPeer = new Peer(undefined, {
    host: '/',
    path: '/',
    secure: true,
    port: '3002',
})
const cameraPeer = new Peer(undefined, {
    host: '/',
    path: '/',
    secure: true,
    port: '3003',
})

socket.on('connect', () => {
    console.log('connect')
    if(myPeer._id && cameraPeer._id)
        linkSuss()
})

myPeer.on('open', id => {
    if(cameraPeer._id && socket.connecte)
        linkSuss()
})

cameraPeer.on('open', id => {
    if(myPeer._id && socket.connecte)
        linkSuss()
})
const linkSuss = () => {
    var script = document.createElement('script')
    script.src = '/javascripts/script.js'
    document.body.appendChild(script)
}