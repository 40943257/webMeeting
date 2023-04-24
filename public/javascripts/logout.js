const socket = io('/')

const ip = '127.0.0.1'
var sessionId = document.cookie.replace(/(?:(?:^|.*;\s*)PHPSESSID*\=\s*([^;]*).*$)|^.*$/, "$1")

socket.emit('logout', sessionId)
socket.on('access', () => {
    parent.window.location.assign(`http://${ip}/htmlPhp/loginpage.php`)
})