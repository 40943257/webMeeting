var link = (function () {
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
    var access = false

    socket.on('connect', () => {
        console.log('connect')
        if (myPeer._id && cameraPeer._id && !access) {
            access = true
            linkSuss()
        }
    })

    myPeer.on('open', id => {
        if (cameraPeer._id && socket.connected && !access) {
            access = true
            linkSuss()
        }
    })

    cameraPeer.on('open', id => {
        if (myPeer._id && socket.connected && !access) {
            access = true
            linkSuss()
        }
    })
    const linkSuss = () => {
        console.log('access')
        var script = document.createElement('script')
        script.src = '/javascripts/script.js'
        document.body.appendChild(script)
    }

    const getSocket = () => {
        return socket
    }

    const getMyPeer = () => {
        return myPeer
    }

    const getCameraPeer = () => {
        return cameraPeer
    }

    return {
        getSocket: getSocket,
        getMyPeer: getMyPeer,
        getCameraPeer: getCameraPeer
    }
})();