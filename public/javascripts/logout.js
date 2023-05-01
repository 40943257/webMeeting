const socket = io('/')

var sessionId = document.cookie.replace(/(?:(?:^|.*;\s*)PHPSESSID*\=\s*([^;]*).*$)|^.*$/, "$1")

socket.emit('logout', sessionId)
socket.on('access', () => {
    parent.window.location.assign(`http://${serverIp}/htmlPhp/loginpage.php`)
})