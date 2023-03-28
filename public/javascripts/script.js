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

const ip = '127.0.0.1'
const peers = []
var userName = ''
var messegeFlag = 1
var staffFlag = 0
const messegeButton = document.querySelector('#messegeButton')
const staffButton = document.querySelector('#staffButton')
const messege = document.querySelector('#messege')
const video = document.querySelector('#video')
const txtShow = document.querySelector('#txtShow')
const txtInput = document.querySelector('#txtInput')
const btnSend = document.querySelector("#btnSend")
const camera = document.querySelector('#camera')
const microphone = document.querySelector('#microphone')
const screen = document.querySelector('#screen')
const voice = document.querySelector('#voice')
const staff = document.querySelector('#staff')
const bottom_left = document.querySelector('#bottom_left')
const bottom_right = document.querySelector('#bottom_right')
const settingButton = document.querySelector('#settingButton')
const setting = document.querySelector('#setting')
const microphoneSelect = document.querySelector('#microphoneSelect')
const cameraSelect = document.querySelector('#cameraSelect')
const voteButton = document.querySelector('#voteButton')
const voteRooms = document.querySelector('#voteRooms')
const voteForm = document.querySelector('#voteForm')
var voteFlag = 0
const createVote = document.querySelector('#createVote')
var createVoteFlag = 0
const createVoteRoom = document.querySelector('#createVoteRoom')
const numOfVoteOptions = document.querySelector('#numOfVoteOptions')
const inputVoteOptions = document.querySelector('#inputVoteOptions')
var voteNum = 0
const SendcCeateVote = document.querySelector('#SendcCeateVote')
const voteName = document.querySelector('#voteName')
var voteRoomFlag = 0
const returnVote = document.querySelector('#returnVote')
var voteChooseFlag = []
var votes = []
const fileButton = document.querySelector('#fileButton')
const filePage = document.querySelector('#filePage')
var filePageFlag = 0
const uploadFile = document.querySelector('#uploadFile')
const sendFile = document.querySelector('#sendFile')
const captionButton = document.querySelector('#captionButton')
const caption = document.querySelector('#caption')
var captionFlag = 0
var recognizing = false
var recognition = new webkitSpeechRecognition()
recognition.lang = 'zh-TW'
recognition.continuous = true
recognition.interimResults = true
const captionSelect = document.querySelector('#captionSelect')
const video_start = document.querySelector('#video_start')
var cameraStream
var screenStream
var shareId
var voiceFlag = 1
var settingFlag = 0
var options = {
    video: true,
    audio: true
}

const change_size = () => {
    if (messegeFlag || staffFlag || voteFlag || createVoteFlag || voteRoomFlag || filePageFlag) {
        bottom_left.style.width = document.documentElement.clientWidth * 0.8 + 'px'
        video.width = document.documentElement.clientWidth * 0.8

    }
    else {
        bottom_left.style.width = document.documentElement.clientWidth - 10 + 'px'
        video.width = document.documentElement.clientWidth - 10
    }
    bottom_right.style.width = document.documentElement.clientWidth * 0.2 + 'px'
    const staffVideos = staff.querySelectorAll('video')
    staffVideos.forEach(staffVideo => {
        staffVideo.width = document.documentElement.clientWidth * 0.18
    })
    bottom_left.style.height = document.documentElement.clientHeight - 40 + 'px'
    bottom_right.style.height = document.documentElement.clientHeight - 40 + 'px'
    voteRooms.style.height = bottom_right.style.height
    voteRooms.style.width = bottom_right.style.width
    createVoteRoom.style.height = bottom_right.style.height
    createVoteRoom.style.width = bottom_right.style.width
    filePage.style.height = bottom_right.style.height
    filePage.style.width = bottom_right.style.width
    for (var i = 1; i <= voteNum; i++) {
        document.querySelector(`#voteRoom${i}`).style.height = bottom_right.style.height
        document.querySelector(`#voteRoom${i}`).style.width = bottom_right.style.width
    }
    video.height = document.documentElement.clientHeight - 40
    txtShow.rows = document.documentElement.clientHeight * 0.07 - 10
    txtShow.cols = document.documentElement.clientWidth * 0.025 - 5
    txtInput.size = document.documentElement.clientWidth * 0.018

}

// const inputName = () => {
//     while (userName == null || userName == '') {
//         userName = window.prompt('你的名子')
//     }
//     const option = document.createElement('option')
//     option.value = 'my'
//     option.text = userName
//     captionSelect.appendChild(option)
// }

change_size()
window.onresize = change_size
// inputName()

settingButton.addEventListener('click', () => {
    if (settingFlag) {
        settingFlag = 0
        setting.style.display = 'none'
        settingButton.style.backgroundColor = 'white'
        settingButton.style.color = 'black'
    }
    else {
        settingFlag = 1
        setting.style.display = 'block'
        settingButton.style.backgroundColor = 'black'
        settingButton.style.color = 'white'
    }
})

messegeButton.addEventListener('click', () => {
    if (messegeFlag) {
        clearButtonRight()
    }
    else {
        clearButtonRight()
        messegeFlag = 1
        messege.style.display = 'block'
        messegeButton.style.backgroundColor = 'black'
        messegeButton.style.color = 'white'
    }
    change_size()
})

staffButton.addEventListener('click', () => {
    if (staffFlag) {
        clearButtonRight()
    }
    else {
        clearButtonRight()
        staffFlag = 1
        staff.style.display = 'block'
        staffButton.style.backgroundColor = 'black'
        staffButton.style.color = 'white'
    }
    change_size()
})

voteButton.addEventListener('click', () => {
    if (voteFlag) {
        clearButtonRight()
    }
    else {
        clearButtonRight()
        voteFlag = 1
        voteRooms.style.display = 'block'
        voteButton.style.backgroundColor = 'black'
        voteButton.style.color = 'white'
    }
    change_size()
})

createVote.addEventListener('click', () => {
    clearButtonRight()
    createVoteFlag = 1
    createVoteRoom.style.display = 'block'
    change_size()
})

numOfVoteOptions.addEventListener('change', () => {
    inputVoteOptions.innerHTML = ''
    var count = numOfVoteOptions.value
    for (var i = 0; i < count; i++) {
        var input = document.createElement('input')
        var br = document.createElement('br')
        input.type = 'text'
        input.id = 'vote_option'
        inputVoteOptions.append(`選項${i + 1}: `)
        inputVoteOptions.appendChild(input)
        inputVoteOptions.appendChild(br)
    }
})

SendcCeateVote.addEventListener('click', () => {
    socket.emit('getVoteNum', voteName.value)
})

returnVote.addEventListener('click', () => {
    voteButton.click()
})

fileButton.addEventListener('click', () => {
    if (filePageFlag) {
        clearButtonRight()
    }
    else {
        clearButtonRight()
        filePageFlag = 1
        filePage.style.display = 'block'
        fileButton.style.backgroundColor = 'black'
        fileButton.style.color = 'white'
    }
    change_size()
})

sendFile.addEventListener('click', () => {
    // console.log(uploadFile.files[0].name)
    let fileName = uploadFile.files[0].name
    let fileType = uploadFile.files[0].type
    let fileReader = new FileReader()
    fileReader.readAsArrayBuffer(uploadFile.files[0])
    fileReader.onload = (e) => {
        // console.log(e.target.result)
        socket.emit('uploadFile', fileName, fileType, e.target.result)
        // const blob = new Blob([e.target.result], {type: fileType})
        // const downloadLink = document.createElement('a')
        // downloadLink.href = window.URL.createObjectURL(blob)
        // downloadLink.download = fileName
        // downloadLink.click()
    }
})

captionButton.addEventListener('click', () => {
    if (captionFlag) {
        caption.style.display = 'none'
        captionButton.style.backgroundColor = 'white'
        captionButton.style.color = 'black'
        captionFlag = 0
    }
    else {
        captionFlag = 1
        caption.style.display = 'block'
        captionButton.style.backgroundColor = 'black'
        captionButton.style.color = 'white'
    }
})

recognition.onstart = () => { // 開始辨識
    recognizing = true // 設定為辨識中
};

recognition.onend = () => { // 辨識完成
    recognizing = false // 設定為「非辨識中」
};

recognition.onresult = function (event) {
    // var interimTranscript = ''

    // 將中間結果和最終結果分開處理
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (!event.results[i].isFinal) {
            socket.emit('caption', event.results[i][0].transcript)
            if (captionSelect.value == 'my') {
                console.log('123')
                caption.innerHTML = event.results[i][0].transcript
            }
        }
    }
}

const clearButtonRight = () => {
    messegeFlag = 0
    messege.style.display = 'none'
    messegeButton.style.backgroundColor = 'white'
    messegeButton.style.color = 'black'
    staffFlag = 0
    staff.style.display = 'none'
    staffButton.style.backgroundColor = 'white'
    staffButton.style.color = 'black'
    voteFlag = 0
    voteRooms.style.display = 'none'
    voteButton.style.backgroundColor = 'white'
    voteButton.style.color = 'black'
    createVoteFlag = 0
    createVoteRoom.style.display = 'none'
    fileButton.style.backgroundColor = 'white'
    fileButton.style.color = 'black'
    filePageFlag = 0
    filePage.style.display = 'none'
    if (voteNum >= 1) {
        for (var i = 1; i < voteNum; i++) {
            document.querySelector(`#voteRoom${i}`).style.display = 'none'
        }
    }
    voteRoomFlag = 0
}

myPeer.on('open', id => {
    cameraPeer.on('open', cameraId => {
        // console.log('myId: ' + id + ' cameraId: ' + cameraId)
        var sessionId = document.cookie.replace(/(?:(?:^|.*;\s*)PHPSESSID*\=\s*([^;]*).*$)|^.*$/, "$1")
        if(sessionId == '') {
            parent.window.location.assign(`http://${ip}/htmlPhp/loginpage.php`)
        }
        socket.emit('sessionId', sessionId);
        socket.on('name', myName => {
            userName = myName
            console.log(userName)
            const option = document.createElement('option')
            option.value = 'my'
            option.id = 'option_my'
            option.text = userName
            captionSelect.appendChild(option)
            socket.emit('join-room', ROOM_ID, id, cameraId)
    
            socket.on('connection', (userId, userCameraId, name) => {
                // console.log('user: ' + userId + ' connection')
                if (screenStream) {
                    myPeer.call(userId, screenStream)
                }
                const userDiv = document.createElement('div')
                userDiv.id = userCameraId
                const cameraVideo = document.createElement('video')
                if (voiceFlag) {
                    cameraVideo.muted = true
                }
                else {
                    cameraVideo.muted = false
                }
                var br = document.createElement("br");
                userDiv.append(name)
                userDiv.append(br)
                userDiv.append(cameraVideo)
                staff.append(userDiv)
                if (cameraStream) {
                    cameraPeer.call(userCameraId, cameraStream)
                }
                const option = document.createElement('option')
                option.value = userId
                option.id = `option_${userId}`
                option.text = name
                captionSelect.appendChild(option)
                const userInfo = {
                    name: name,
                    id: userId,
                    cameraId: userCameraId
                }
                peers.push(userInfo)
                // console.log(peers)
            })
    
            myPeer.on('call', call => {
                call.answer()
                call.on('stream', userStream => {
                    video.srcObject = userStream
                    let playPromise = video.play()
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            video.play()
                        }).catch(() => {
    
                        })
                    }
                    if (!voiceFlag) {
                        video.muted = false
                    }
                })
            })
    
            cameraPeer.on('call', call => {
                call.answer()
                const cameraVideo = (document.getElementById(call.peer)).querySelector('video')
                call.on('stream', stream => {
                    cameraVideo.srcObject = stream
                    let playPromise = cameraVideo.play()
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            cameraVideo.play()
                        }).catch(() => {
    
                        })
                    }
    
                    socket.on('stopCameraStream', () => {
                        cameraVideo.srcObject = null
                    })
                })
            })
    
            socket.on('message', (message) => {
                // console.log(message)
                txtShow.value = txtShow.value + message + '\n'
            })
    
            socket.on('shareId', userId => {
                shareId = userId
            })
    
            socket.on('voteNum', num => {
                const voteOptions = document.querySelectorAll('#vote_option')
                voteOptions.forEach(voteOption => {
                    var radio = document.createElement('input')
                    radio.type = 'radio'
                    radio.id = `vote${num}_option`
                    radio.name = `vote${num}_option`
                    radio.value = voteOption.value
                    socket.emit('vote', num, radio.value)
                })
                socket.emit('vote', num, 'end')
                voteName.value = ''
                inputVoteOptions.innerHTML = ''
                numOfVoteOptions[0].selected = true
                voteButton.click()
            })
    
            socket.on('vote', (num, vote_name, vote__option, numOf_Votes) => {
                // console.log(n + ' ' + vote__option)
                if (vote__option == 'end') {
                    var sendVote = document.createElement('button')
                    sendVote.id = 'sendVote'
                    sendVote.textContent = '送出'
                    const voteRoom = document.querySelector(`#voteRoom${num}`)
                    voteRoom.appendChild(sendVote)
                    sendVote.addEventListener('click', () => {
                        document.querySelectorAll(`#vote${num}_option`).forEach(choose => {
                            if (choose.checked) {
                                voteChooseFlag[num] = 1
                                socket.emit('voteChoose', num, choose.value)
                                voteButton.click()
                                const n = votes[num].option.map(x => x.name).indexOf(choose.value)
                                if (n != -1) {
                                    votes[num].option[n].numOfVotes++
                                }
                            }
                        })
                    })
                }
                else {
                    if (voteNum < num) {
                        votes[num] = []
                        votes[num].name = vote_name
                        votes[num].option = []
                        var vote = document.createElement('button')
                        var br = document.createElement('br')
                        vote.id = `vote${num}`
                        vote.textContent = vote_name
                        voteForm.appendChild(vote)
                        voteForm.appendChild(br)
                        voteNum = num
                        var returnButton = document.createElement('button')
                        var br2 = document.createElement('br')
                        returnButton.id = 'return'
                        returnButton.textContent = '返回'
                        var voteRoom = document.createElement('div')
                        voteRoom.id = `voteRoom${num}`
                        voteRoom.className = 'voteRoom'
                        voteRoom.style.display = 'none'
                        voteRoom.appendChild(returnButton)
                        voteRoom.appendChild(br2)
                        bottom_right.appendChild(voteRoom)
                        vote.addEventListener('click', () => {
                            if (voteChooseFlag[num] != 1) {
                                clearButtonRight()
                                voteRoom.style.display = 'block'
                                voteRoomFlag = 1
                                change_size()
                            }
                            else {
                                document.querySelectorAll(`#vote${num}_option`).forEach(choose => {
                                    if (choose.checked) {
                                        let alertText = `你已投了: ${choose.value}`
                                        votes[num].option.forEach(element => {
                                            alertText += `\n${element.name}: ${element.numOfVotes}`
                                        })
                                        alert(alertText)
                                    }
                                })
                            }
                        })
                        returnButton.addEventListener('click', () => {
                            voteButton.click()
                        })
                        voteChooseFlag[num] = 0
                    }
                    var radio = document.createElement('input')
                    var br = document.createElement('br')
                    radio.type = 'radio'
                    radio.id = `vote${num}_option`
                    radio.name = `vote${num}_option`
                    radio.value = vote__option
                    const vote__Room = document.querySelector(`#voteRoom${num}`)
                    vote__Room.appendChild(radio)
                    vote__Room.append(vote__option)
                    vote__Room.appendChild(br)
                    var voteOptionContext = {
                        name: vote__option,
                        numOfVotes: numOf_Votes
                    }
                    votes[num].option.push(voteOptionContext)
                }
            })
    
            socket.on('voteChoose', (num, vote_name, choose, numOfVotes) => {
                // console.log(num + ' ' + vote_name + ' ' + choose + ' ' + numOfVotes)
                const n = votes[num].option.map(x => x.name).indexOf(choose)
                if (n != -1) {
                    votes[num].option[n].numOfVotes = numOfVotes
                }
            })
    
            socket.on('caption', (userId, captionText) => {
                if (captionSelect.value == userId) {
                    caption.innerHTML = captionText
                }
            })
    
            socket.on('stopStream', () => {
                video.srcObject = null
            })
    
            socket.on('user-disconnected', userId => {
                const n = peers.map(x => x.id).indexOf(userId)
                if (n != -1) {
                    cameraId = peers[n].cameraId
                    peers.splice(n, 1)
                    document.getElementById(cameraId).remove()
                    document.getElementById(`option_${userId}`).remove()
                    if (shareId == userId) {
                        video.srcObject = null
                        shareId = null
                    }
                }
                // console.log(peers)
            })
        })
            
    })
})

btnSend.addEventListener('click', () => {
    if (txtInput.value == '') return
    let txt = userName + ': ' + txtInput.value;
    socket.emit('message', txt)
    txtInput.value = ''
})

txtInput.addEventListener('keypress', event2 => {
    if (event2.keyCode === 13 || event2.which === 13) {
        if (txtInput.value == '') return
        let txt = userName + ': ' + txtInput.value;
        socket.emit('message', txt)
        txtInput.value = ''
    }
})

camera.addEventListener('click', () => {
    if (cameraPeer) {
        if (cameraStream) {
            cameraStop()
            microphoneStop()
        }
        if (options.video === false) {
            options.video = { deviceId: cameraSelect.value }
        }
        else {
            options.video = false
        }
        sendCameraStream()
    }
})

microphone.addEventListener('click', () => {
    if (cameraPeer) {
        if (cameraStream) {
            cameraStop()
            microphoneStop()
        }
        if (options.audio === false) {
            options.audio = { deviceId: microphoneSelect.value }
        }
        else {
            options.audio = false
        }
        sendCameraStream()
    }
})

navigator.mediaDevices.getUserMedia(options).then(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
        // console.log(devices)

        devices.forEach(device => {
            if (device.deviceId === 'default' || device.deviceId === 'communications') {
                return
            }
            const option = document.createElement('option')
            option.value = device.deviceId
            if (device.kind === 'audioinput') {
                option.text = device.label
                microphoneSelect.appendChild(option)
            }
            else if (device.kind === 'videoinput') {
                option.text = device.label
                cameraSelect.appendChild(option)
            }
        })

        options.video = false
        options.audio = false
    })
})

microphoneSelect.addEventListener('change', () => {
    if (cameraStream) {
        cameraStop()
        microphoneStop()
        if (options.audio != false) {
            options.audio = { deviceId: microphoneSelect.value }
        }
        sendCameraStream()
    }
})

cameraSelect.addEventListener('change', () => {
    if (cameraStream) {
        cameraStop()
        microphoneStop()
        if (options.video != false) {
            options.video = { deviceId: cameraSelect.value }
        }
        sendCameraStream()
    }
})

const sendCameraStream = () => {
    if (options.video || options.audio) {
        navigator.mediaDevices.getUserMedia(options).then(stream => {
            cameraStream = stream
            if (options.video) {
                camera.style.backgroundColor = 'black'
                camera.style.color = 'white'
            }
            if (options.audio) {
                if (recognizing == false) {
                    recognition.start()
                    recognizing = true
                }
                microphone.style.backgroundColor = 'black'
                microphone.style.color = 'white'
            }
            peers.forEach(user => {
                console.log(user.cameraId)
                cameraPeer.call(user.cameraId, cameraStream)
            })
        })
    }
    else if (recognizing) {
        recognition.stop()
        recognizing = false
    }
}

screen.addEventListener('click', () => {
    if (true) {
        if (!screenStream) {
            if (video.srcObject) {
                return
            }
            navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            }).then(stream => {
                video.srcObject = stream
                screenStream = stream
                video.muted = true
                video.play()
                sendStream(stream)
                screen.style.backgroundColor = 'black'
                screen.style.color = 'white'
            })
        }
        else {
            screenStop()
            socket.emit('stopStream');
        }
    }
})

// video.addEventListener('loadedmetadata', () => {
//     video.play()
//     if ((video.videoWidth / video.videoHeight) < (video.width / video.height)) {
//         var new_width, new_height
//         new_height = video.height
//         new_width = (new_height * video.videoWidth) / video.videoHeight
//         canvas.width = new_width
//         canvas.height = new_height
//     }
//     else {
//         var new_width, new_height
//         new_width = video.width
//         new_height = (new_width * video.videoHeight) / video.videoWidth
//         canvas.width = new_width
//         canvas.height = new_height
//     }
//     canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height)
//     // console.log(canvas.toDataURL("image/png"))
//     console.log(canvasContext.getImageData(0,0,canvas.width, canvas.height).data)
//     // socket.emit('img', canvas.toDataURL("image/png"))
//     if (!video.srcObject) {
//         return
//     }
// })

const sendStream = (stream) => {
    peers.forEach(user => {
        myPeer.call(user.id, stream)
    })
    socket.emit('shareId')
}

const cameraStop = () => {
    socket.emit('stopCameraStream')
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => {
            track.stop()
        })
        cameraStream = null
    }
    camera.style.backgroundColor = 'white'
    camera.style.color = 'black'
}

const microphoneStop = () => {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => {
            track.stop()
        })
        cameraStream = null
    }
    microphone.style.backgroundColor = 'white'
    microphone.style.color = 'black'
}

const screenStop = () => {
    if (screenStream) {
        screenStream.getTracks().forEach(track => {
            track.stop()
        })
        screenStream = null
        video.srcObject = null
        screen.style.backgroundColor = 'white'
        screen.style.color = 'black'
    }
}

voice.addEventListener('click', () => {
    if (voiceFlag) {
        voiceFlag = 0
        voice.style.backgroundColor = 'white'
        voice.style.color = 'black'
        if (!screenStream) {
            video.muted = false
        }
        const userVideos = staff.querySelectorAll('video')
        userVideos.forEach(userVideo => {
            userVideo.muted = false
        })
    }
    else {
        voiceFlag = 1
        voice.style.backgroundColor = 'black'
        voice.style.color = 'white'
        video.muted = true
        const userVideos = staff.querySelectorAll('video')
        userVideos.forEach(userVideo => {
            userVideo.muted = true
        })
    }
})