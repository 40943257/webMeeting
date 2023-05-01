const peers = []
var userName = ''
var messegeFlag = true
var staffFlag = false
const messegeButton = document.querySelector('#messegeButton')
const staffButton = document.querySelector('#staffButton')
const messege = document.querySelector('#messege')
const video = document.querySelector('#video')
video.volume = 0.5
const messegeShow = document.querySelector('#messegeShow')
const messegeInput = document.querySelector('#messegeInput')
const messegeSend = document.querySelector("#messegeSend")
const camera = document.querySelector('#camera')
const microphone = document.querySelector('#microphone')
const screen = document.querySelector('#screen')
const voiceZero = document.querySelector('#voiceZero')
const voiceRange = document.querySelector('#voiceRange')
const microphoneRange = document.querySelector('#microphoneRange')
const staff = document.querySelector('#staff')
const bottom_left = document.querySelector('#bottom_left')
const bottom_right = document.querySelector('#bottom_right')
const settingButton = document.querySelector('#settingButton')
const setting = document.querySelector('#setting')
const microphoneSelect = document.querySelector('#microphoneSelect')
const cameraSelect = document.querySelector('#cameraSelect')
const hornSelect = document.querySelector('#hornSelect')
const voteButton = document.querySelector('#voteButton')
const voteRooms = document.querySelector('#voteRooms')
const voteForm = document.querySelector('#voteForm')
var voteFlag = false
const createVote = document.querySelector('#createVote')
var createVoteFlag = false
const createVoteRoom = document.querySelector('#createVoteRoom')
const numOfVoteOptions = document.querySelector('#numOfVoteOptions')
const inputVoteOptions = document.querySelector('#inputVoteOptions')
var voteNum = 0
const SendcCeateVote = document.querySelector('#SendcCeateVote')
const voteName = document.querySelector('#voteName')
var voteRoomFlag = false
const returnVote = document.querySelector('#returnVote')
var voteChooseFlag = []
var votes = []
const fileButton = document.querySelector('#fileButton')
const filePage = document.querySelector('#filePage')
var filePageFlag = false
const uploadFile = document.querySelector('#uploadFile')
const sendFile = document.querySelector('#sendFile')
const captionButton = document.querySelector('#captionButton')
const caption = document.querySelector('#caption')
var captionFlag = false
var recognizing = false
var recognition = new webkitSpeechRecognition()
recognition.lang = 'zh-TW'
recognition.continuous = true
recognition.interimResults = true
const captionSelect = document.querySelector('#captionSelect')
const video_start = document.querySelector('#video_start')
var video_startFlag = false
var recorder
var chunks
var mixStream
var audioContext
var destination
var gainNode
var microphoneAudioContext
var microphoneGainNode
var microphoneDestination
var microphoneSource
var screenSource
const stopMeetingButton = document.querySelector('#stopMeetingButton')
var cameraStream
var screenStream
var shareId
var voiceFlag = true
var settingFlag = false
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
    messegeShow.rows = document.documentElement.clientHeight * 0.07 - 10
    messegeShow.cols = document.documentElement.clientWidth * 0.025 - 5
    messegeInput.size = document.documentElement.clientWidth * 0.018

}

change_size()
window.onresize = change_size

settingButton.addEventListener('click', () => {
    if (settingFlag) {
        settingFlag = false
        setting.style.display = 'none'
        settingButton.style.backgroundColor = 'white'
        settingButton.style.color = 'black'
    }
    else {
        settingFlag = true
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
        messegeFlag = true
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
        staffFlag = true
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
        voteFlag = true
        voteRooms.style.display = 'block'
        voteButton.style.backgroundColor = 'black'
        voteButton.style.color = 'white'
    }
    change_size()
})

createVote.addEventListener('click', () => {
    clearButtonRight()
    createVoteFlag = true
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
        filePageFlag = true
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
        socket.emit('uploadFile', fileName, fileType, e.target.result)
    }
})

captionButton.addEventListener('click', () => {
    if (captionFlag) {
        caption.style.display = 'none'
        captionButton.style.backgroundColor = 'white'
        captionButton.style.color = 'black'
        captionFlag = false
    }
    else {
        captionFlag = true
        caption.style.display = 'block'
        captionButton.style.backgroundColor = 'black'
        captionButton.style.color = 'white'
    }
})

recognition.onstart = () => { // 開始辨識
    recognizing = true // 設定為辨識中
};

recognition.onend = () => { // 辨識完成
    if (recognizing) {
        recognition.start()
        return
    }
    console.log('stop')
};

recognition.onresult = function (event) {
    // 將中間結果和最終結果分開處理
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (!event.results[i].isFinal) {
            socket.emit('caption', false, event.results[i][0].transcript)
        }
        else {
            socket.emit('caption', true, event.results[i][0].transcript)
        }

        if (captionSelect.value == 'my') {
            caption.innerHTML = event.results[i][0].transcript
        }
    }
}

const clearButtonRight = () => {
    messegeFlag = false
    messege.style.display = 'none'
    messegeButton.style.backgroundColor = 'white'
    messegeButton.style.color = 'black'
    staffFlag = false
    staff.style.display = 'none'
    staffButton.style.backgroundColor = 'white'
    staffButton.style.color = 'black'
    voteFlag = false
    voteRooms.style.display = 'none'
    voteButton.style.backgroundColor = 'white'
    voteButton.style.color = 'black'
    createVoteFlag = false
    createVoteRoom.style.display = 'none'
    fileButton.style.backgroundColor = 'white'
    fileButton.style.color = 'black'
    filePageFlag = false
    filePage.style.display = 'none'
    if (voteNum >= 1) {
        for (var i = 1; i <= voteNum; i++) {
            document.querySelector(`#voteRoom${i}`).style.display = 'none'
        }
    }
    voteRoomFlag = 0
}

stopMeetingButton.addEventListener('click', () => {
    socket.emit('stopMeeting')
})

socket.emit('sessionId', sessId);
socket.on('name', myName => {
    userName = myName
    console.log(myName)
    const option = document.createElement('option')
    option.value = 'my'
    option.id = 'option_my'
    option.text = userName
    captionSelect.appendChild(option)
    socket.emit('join-room', ROOM_ID, myPeer._id, cameraPeer._id)

    socket.on('connection', (userId, userCameraId, name) => {
        // console.log('user: ' + userId + ' connection')
        if (screenStream) {
            myPeer.call(userId, screenStream)
        }
        const userDiv = document.createElement('div')
        userDiv.id = userCameraId
        const cameraVideo = document.createElement('video')
        cameraVideo.srcObject = null
        cameraVideo.setSinkId(hornSelect.value)
        cameraVideo.volume = voiceRange.value / 100
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
            if (video_startFlag) {
                screenSource = audioContext.createMediaStreamSource(userStream)
                screenSource.connect(gainNode)
            }
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
            const n = peers.map(x => x.cameraId).indexOf(call.id)
            if (video_startFlag) {
                if (n != -1) {
                    peers[n].audioSource = audioContext.createMediaStreamSource(stream)
                    peers[n].audioSource.connect(gainNode)
                }
            }
            if (voiceFlag)
                stream.getAudioTracks().forEach(track => track.enabled = false)
            else
                stream.getAudioTracks().forEach(track => track.enabled = true)
            let playPromise = cameraVideo.play()
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    cameraVideo.play()
                }).catch(() => {

                })
            }
        })
    })

    socket.on('message', (message) => {
        // console.log(message)
        messegeShow.value = messegeShow.value + message + '\n'
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

    socket.on('courseFile', fileName => {
        const downloadFileButton = document.createElement('button')
        const br = document.createElement('br')
        downloadFileButton.id = fileName
        downloadFileButton.textContent = fileName
        filePage.appendChild(downloadFileButton)
        filePage.appendChild(br)

        downloadFileButton.addEventListener('click', () => {
            socket.emit('downloadFile', fileName)
        })
    })

    socket.on('downloadFile', (fileName, fileType, fileData) => {
        const blob = new Blob([fileData], { type: fileType })
        const downloadLink = document.createElement('a')
        downloadLink.href = window.URL.createObjectURL(blob)
        downloadLink.download = fileName
        downloadLink.click()
    })

    socket.on('stopStream', () => {
        video.srcObject = null
        if (screenSource) {
            screenSource.disconnect(gainNode)
        }
    })

    socket.on('stopCameraStream', (userCameraId) => {
        const userVideo = document.getElementById(userCameraId).querySelector('video')
        userVideo.srcObject = null

        if (video_startFlag) {
            const n = peers.map(x => x.cameraId).indexOf(userCameraId)
            if (n != -1) {
                peers[n].audioSource.disconnect(gainNode)
                peers[n].audioSource = null
            }
        }
    })

    socket.on('user-disconnected', userId => {
        const n = peers.map(x => x.id).indexOf(userId)
        if (n != -1) {
            cameraPeer._id = peers[n].cameraId
            peers.splice(n, 1)
            const disUser = document.getElementById(cameraPeer._id)
            disUser.remove()
            document.getElementById(`option_${userId}`).remove()
            if (shareId == userId) {
                video.srcObject = null
                shareId = null
            }
        }
        // console.log(peers)
    })

    socket.on('stopMeeting', () => {
        parent.window.location.assign(`http://${serverIp}/htmlPhp/user.php`)
    })

    socket.on('logout', () => {
        parent.window.location.assign(`http://${serverIp}/htmlPhp/loginpage.php`)
    })
})



messegeSend.addEventListener('click', () => {
    if (messegeInput.value == '') return
    let txt = userName + ': ' + messegeInput.value;
    socket.emit('message', txt)
    messegeInput.value = ''
})

messegeInput.addEventListener('keypress', event2 => {
    if (event2.keyCode === 13 || event2.which === 13) {
        if (messegeInput.value == '') return
        let txt = userName + ': ' + messegeInput.value;
        socket.emit('message', txt)
        messegeInput.value = ''
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
    options.video = false
    options.audio = false

    getDevices()
})

navigator.mediaDevices.addEventListener('devicechange', () => {
    getDevices()
})

const getDevices = () => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
        // console.log(devices)
        const selectCamera = cameraSelect.value
        const selectMicrophone = microphoneSelect.value
        const selectHorn = hornSelect.value
        cameraSelect.innerHTML = ''
        microphoneSelect.innerHTML = ''
        hornSelect.innerHTML = ''

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
            else if (device.kind === 'audiooutput') {
                option.text = device.label
                hornSelect.appendChild(option)
            }
        })

        if (selectCamera)
            cameraSelect.value = selectCamera

        if (selectMicrophone)
            microphoneSelect.value = selectMicrophone

        if (selectHorn)
            hornSelect.value = selectHorn
    })
}

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

hornSelect.addEventListener('change', () => {
    document.querySelectorAll('video').forEach(element => {
        element.setSinkId(hornSelect.value)
    })
})

const sendCameraStream = () => {
    if (options.video || options.audio) {
        navigator.mediaDevices.getUserMedia(options).then(stream => {
            cameraStream = new MediaStream()
            if (options.video) {
                cameraStream.addTrack(stream.getVideoTracks()[0])
                camera.style.backgroundColor = 'black'
                camera.style.color = 'white'
            }
            if (options.audio) {
                microphoneAudioContext = new AudioContext()
                microphoneGainNode = microphoneAudioContext.createGain()
                microphoneDestination = microphoneAudioContext.createMediaStreamDestination()
                microphoneGainNode.gain.value = microphoneRange.value / 100
                microphoneGainNode.connect(microphoneDestination)
                microphoneSource = microphoneAudioContext.createMediaStreamSource(stream)
                microphoneSource.connect(microphoneGainNode)
                cameraStream.addTrack(microphoneDestination.stream.getAudioTracks()[0])
                if (video_startFlag) {
                    audioContext.createMediaStreamSource(cameraStream).connect(gainNode)
                }
                if (recognizing == false) {
                    recognition.start()
                    recognizing = true
                }
                microphone.style.backgroundColor = 'black'
                microphone.style.color = 'white'
            }
            peers.forEach(user => {
                // console.log(user.cameraId)
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
    if (myPeer) {
        if (!screenStream) {
            if (video.srcObject) {
                return
            }
            navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            }).then(stream => {
                screenStream = stream
                video.srcObject = screenStream
                if (video_startFlag) {
                    screenSource = audioContext.createMediaStreamSource(stream)
                    screenSource.connect(gainNode)
                }
                video.muted = true
                video.play()
                sendStream(screenStream)
                screen.style.backgroundColor = 'black'
                screen.style.color = 'white'

                stream.getTracks()[0].addEventListener('ended', () => {
                    screen.click()
                })
            })
        }
        else {
            screenStop()
            socket.emit('stopStream');
        }
    }
})

video_start.addEventListener('click', () => {
    if (video_startFlag) {
        recorder.stop()
        video_startFlag = false
        video_start.style.backgroundColor = 'white'
        video_start.style.color = 'black'
    }
    else {
        navigator.mediaDevices.getDisplayMedia({ video: true }).then(stream => {
            mixStream = new MediaStream()
            audioContext = new AudioContext()
            destination = audioContext.createMediaStreamDestination()
            gainNode = audioContext.createGain()
            gainNode.gain.value = voiceRange.value / 100

            mixStream.addTrack(stream.getVideoTracks()[0])
            if (video.srcObject) {
                screenSource = audioContext.createMediaStreamSource(video.srcObject)
                screenSource.connect(gainNode)
            }
            if (cameraStream) {
                audioContext.createMediaStreamSource(cameraStream).connect(gainNode)
            }
            const userVideos = staff.querySelectorAll('video')
            userVideos.forEach(userVideo => {
                if (userVideo.srcObject != null) {
                    console.log('123')
                    audioContext.createMediaStreamSource(userVideo.srcObject).connect(gainNode)
                }
            })
            gainNode.connect(destination)
            mixStream.addTrack(destination.stream.getAudioTracks()[0])

            chunks = []
            recorder = new MediaRecorder(mixStream, {
                mimeType: 'video/webm',
                audioBitsPerSecond: 128000,
                videoBitsPerSecond: 2500000
            })

            recorder.ondataavailable = e => {
                chunks.push(e.data)
            }

            recorder.onstop = () => {
                stream.getTracks().forEach(track => {
                    track.stop()
                })
                const blob = new Blob(chunks, { type: 'video/webm' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'recoding.webm'
                a.click()
                URL.revokeObjectURL(url)
            }

            recorder.start()
            video_startFlag = true
            video_start.style.backgroundColor = 'black'
            video_start.style.color = 'white'
        })
    }
})

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
    if (microphoneSource) {
        microphoneSource.disconnect(microphoneGainNode)
        microphoneSource = null
    }
    recognition.stop()
    recognizing = false
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

voiceZero.addEventListener('click', () => {
    if (voiceFlag) {
        voiceFlag = 0
        voiceZero.style.backgroundColor = 'white'
        voiceZero.style.color = 'black'
        if (!screenStream) {
            video.muted = false
        }
        const userVideos = staff.querySelectorAll('video')
        userVideos.forEach(userVideo => {
            userVideo.muted = false
            userVideo.srcObject.getAudioTracks().forEach(track => track.enabled = true)
        })
    }
    else {
        voiceFlag = 1
        voiceZero.style.backgroundColor = 'black'
        voiceZero.style.color = 'white'
        video.muted = true
        const userVideos = staff.querySelectorAll('video')
        userVideos.forEach(userVideo => {
            userVideo.muted = true
            userVideo.srcObject.getAudioTracks().forEach(track => track.enabled = false)
        })
    }
})

voiceRange.addEventListener('input', () => {
    document.querySelectorAll('video').forEach(element => {
        element.volume = voiceRange.value / 100
    })
    if (video_startFlag) {
        gainNode.gain.value = voiceRange.value / 100
    }
})

microphoneRange.addEventListener('input', () => {
    microphoneGainNode.gain.value = microphoneRange.value / 100
})
