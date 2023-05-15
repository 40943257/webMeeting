﻿(function () {
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

    myPeer.on('open', id => {
        if (cameraPeer._id && !access) {
            access = true
            linkSuss()
        }
    })

    cameraPeer.on('open', id => {
        if (myPeer._id && !access) {
            access = true
            linkSuss()
        }
    })

    const linkSuss = () => {
        const socket = io('/')
        const peers = []
        var userName = ''
        const mic_on = '<path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"></path><path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"></path>'
        const mic_off = '<path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3-9v4.879L5.158 2.037A3.001 3.001 0 0 1 11 3z"></path><path d="M9.486 10.607 5 6.12V8a3 3 0 0 0 4.486 2.607zm-7.84-9.253 12 12 .708-.708-12-12-.708.708z"></path>'
        const svgNs = 'http://www.w3.org/2000/svg'
        const screenButtonm = document.querySelector('#screenButtonm')
        var screenStream
        const cameraButtonm = document.querySelector('#cameraButtonm')
        const microphoneButtonm = document.querySelector('#microphoneButtonm')
        var cameraStream
        var shareId
        const video_startButtonm = document.querySelector('#video_startButtonm')
        var video_startFlag = false
        const stopMeetingButton = document.querySelector('#stopMeetingButton')
        const microphoneSelect = document.querySelector('#microphoneSelect')
        const cameraSelect = document.querySelector('#cameraSelect')
        const hornSelect = document.querySelector('#hornSelect')
        const messegeButton = document.querySelector('#messegeButton')
        const staffButton = document.querySelector('#staffButton')
        const voteButton = document.querySelector('#voteButton')
        const createVote = document.querySelector('#createVote')
        const returnVoteRoom = document.querySelector('#returnVoteRoom')
        const fileButton = document.querySelector('#fileButton')
        const messege = document.querySelector('#messege')
        const messegeShow = document.querySelector('#messegeShow')
        const messegeInput = document.querySelector('#messegeInput')
        const messegeSend = document.querySelector("#messegeSend")
        const staff = document.querySelector('#staff')
        const staffInner = document.querySelector('#staffInner')
        const votePage = document.querySelector('#votePage')
        const createVoteRoom = document.querySelector('#createVoteRoom')
        const filePage = document.querySelector('#filePage')
        const voiceZeroButton = document.querySelector('#voiceZeroButton')
        var voiceZeroFlag = true
        const voiceRange = document.querySelector('#voiceRange')
        const microphoneRange = document.querySelector('#microphoneRange')
        const video = document.querySelector('#video')
        video.volume = 0.5
        var messegeFlag = true
        var staffFlag = false
        var voteRoomsFlag = false
        var createVoteRoomFlag = false
        var filePageeFlag = false
        var options = {
            video: true,
            audio: true
        }
        var microphoneAudioContext
        var microphoneGainNode
        var microphoneDestination
        var microphoneSource
        const voteForm = document.querySelector('#voteForm')
        const voteName = document.querySelector('#voteName')
        const numOfVoteOptions = document.querySelector('#numOfVoteOptions')
        const inputVoteOptions = document.querySelector('#inputVoteOptions')
        const sendcCeateVote = document.querySelector('#sendcCeateVote')
        var voteChooseFlag = []
        var votes = []
        var voteNum = 0
        const voteRoomsPage = document.querySelector('#voteRoomsPage')
        const voteRooms = document.querySelector('#voteRooms')
        const returnVoteRoom2 = document.querySelector('#returnVoteRoom2')
        const uploadFile = document.querySelector('#uploadFile')
        const sendFile = document.querySelector('#sendFile')
        const file = document.querySelector('#file')
        const captionButton = document.querySelector('#captionButton')
        const caption = document.querySelector('#caption')
        var captionFlag = false
        var recognizing = false
        var recognition = new webkitSpeechRecognition()
        recognition.lang = 'zh-TW'
        recognition.continuous = true
        recognition.interimResults = true
        const captionSelect = document.querySelector('#captionSelect')
        const body = document.body
        const bodyCanvas = document.createElement('canvas')
        const bodyCtx = bodyCanvas.getContext('2d')
        const myP = document.querySelector('#myP')
        const myVideo = document.querySelector('#myVideo')
        const mySvg = document.querySelector('#mySvg')
        var showSleepNum = document.querySelector('#showSleepNum')
        sleepNum = 0

        const clearBottomRight = () => {
            messege.classList.add('visually-hidden')
            messegeButton.classList.remove('btn-dark')
            messegeButton.classList.add('btn-secondary')
            messegeFlag = false

            staff.classList.add('visually-hidden')
            staffButton.classList.remove('btn-dark')
            staffButton.classList.add('btn-secondary')
            staffFlag = false

            votePage.classList.add('visually-hidden')
            voteButton.classList.remove('btn-dark')
            voteButton.classList.add('btn-secondary')
            voteRoomsFlag = false

            createVoteRoom.classList.add('visually-hidden')
            createVoteRoomFlag = false

            filePage.classList.add('visually-hidden')
            fileButton.classList.remove('btn-dark')
            fileButton.classList.add('btn-secondary')
            filePageeFlag = false

            voteRoomsPage.classList.add('visually-hidden')
            if (voteNum >= 1) {
                for (var i = 1; i <= voteNum; i++) {
                    document.querySelector(`#voteRoom${i}`).classList.add('visually-hidden')
                }
            }
        }

        messegeButton.addEventListener('click', () => {
            if (!messegeFlag) {
                clearBottomRight()
                messege.classList.remove('visually-hidden')
                messegeButton.classList.remove('btn-secondary')
                messegeButton.classList.add('btn-dark')
                messegeFlag = true
            }
        })

        staffButton.addEventListener('click', () => {
            if (staffFlag) {
                clearBottomRight()
                messegeButton.click()
            }
            else {
                clearBottomRight()
                staff.classList.remove('visually-hidden')
                staffButton.classList.remove('btn-secondary')
                staffButton.classList.add('btn-dark')
                staffFlag = true
            }
        })

        voteButton.addEventListener('click', () => {
            if (voteRoomsFlag) {
                clearBottomRight()
                messegeButton.click()
            }
            else {
                clearBottomRight()
                votePage.classList.remove('visually-hidden')
                voteButton.classList.remove('btn-secondary')
                voteButton.classList.add('btn-dark')
                voteRoomsFlag = true
            }
        })

        createVote.addEventListener('click', () => {
            if (createVoteRoomFlag) {
                clearBottomRight()
                messegeButton.click()
            }
            else {
                clearBottomRight()
                createVoteRoom.classList.remove('visually-hidden')
                voteButton.classList.remove('btn-secondary')
                voteButton.classList.add('btn-dark')
                createVoteRoomFlag = true
            }
        })

        returnVoteRoom.addEventListener('click', () => {
            voteName.value = ''
            inputVoteOptions.innerHTML = ''
            numOfVoteOptions[0].selected = true
            voteButton.click()
        })

        returnVoteRoom2.addEventListener('click', () => {
            voteButton.click()
        })

        numOfVoteOptions.addEventListener('change', () => {
            inputVoteOptions.innerHTML = ''
            var count = numOfVoteOptions.value
            for (var i = 0; i < count; i++) {
                var label = document.createElement('label')
                var input = document.createElement('input')
                label.classList.add('form-label')
                label.innerHTML = `選項${i + 1}`
                label.setAttribute('for', `vote_option_${i}`)
                input.id = `vote_option_${i}`
                input.classList.add('form-control')
                inputVoteOptions.append(label)
                inputVoteOptions.append(input)
            }
        })

        sendcCeateVote.addEventListener('click', () => {
            socket.emit('getVoteNum', voteName.value)
        })

        fileButton.addEventListener('click', () => {
            if (filePageeFlag) {
                clearBottomRight()
                messegeButton.click()
            }
            else {
                clearBottomRight()
                filePage.classList.remove('visually-hidden')
                fileButton.classList.remove('btn-secondary')
                fileButton.classList.add('btn-dark')
                filePageeFlag = true
            }
        })

        sendFile.addEventListener('click', () => {
            // console.log(uploadFile.files[0].name)
            let fileName = uploadFile.files[0].name
            let fileType = uploadFile.files[0].type
            let fileReader = new FileReader()
            fileReader.readAsArrayBuffer(uploadFile.files[0])
            fileReader.onload = (e) => {
                socket.emit('uploadFile', fileName, fileType, e.target.result)
                uploadFile.value = null
            }
        })

        captionButton.addEventListener('click', () => {
            if (captionFlag) {
                caption.classList.add('visually-hidden')
                captionButton.classList.remove('btn-dark')
                captionButton.classList.add('btn-secondary')
                captionFlag = false
            }
            else {
                captionFlag = true
                caption.classList.remove('visually-hidden')
                captionButton.classList.remove('btn-secondary')
                captionButton.classList.add('btn-dark')
            }
        })

        messegeSend.addEventListener('click', () => {
            if (messegeInput.value == '') return
            let txt = userName + ': ' + messegeInput.value;
            socket.emit('message', txt)
            messegeInput.value = ''
        })

        messegeInput.addEventListener('keypress', event => {
            if (event.keyCode === 13 || event.which === 13) {
                messegeSend.click()
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
                var defaultCamera
                var defaultMicrophone
                var defaultHorn
                const selectCamera = cameraSelect.value
                const selectMicrophone = microphoneSelect.value
                const selectHorn = hornSelect.value
                cameraSelect.innerHTML = ''
                microphoneSelect.innerHTML = ''
                hornSelect.innerHTML = ''

                devices.forEach(device => {
                    if (device.deviceId === 'communications')
                        return;

                    if (device.deviceId === 'default') {
                        if (device.kind === 'audioinput')
                            defaultMicrophone = device.groupId
                        else if (device.kind === 'videoinput')
                            defaultCamera = device.groupId
                        else if (device.kind === 'audiooutput')
                            defaultHorn = device.groupId
                        return
                    }
                    const option = document.createElement('option')
                    option.value = device.deviceId
                    if (device.kind === 'audioinput') {
                        option.text = device.label
                        microphoneSelect.appendChild(option)
                        if (!selectMicrophone && device.groupId === defaultMicrophone)
                            microphoneSelect.value = device.deviceId
                    }
                    else if (device.kind === 'videoinput') {
                        option.text = device.label
                        cameraSelect.appendChild(option)
                        if (!selectCamera && device.groupId === defaultCamera)
                            cameraSelect.value = device.deviceId
                    }
                    else if (device.kind === 'audiooutput') {
                        option.text = device.label
                        hornSelect.appendChild(option)
                        if (!selectHorn && device.groupId === defaultHorn)
                            hornSelect.value = device.deviceId
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
                if (options.audio != false) {
                    options.audio = { deviceId: microphoneSelect.value }
                }
                sendCameraStream()
            }
        })

        cameraSelect.addEventListener('change', () => {
            if (cameraStream) {
                cameraStop()
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

        socket.on('name', myName => {
            userName = myName
            // console.log(myName)
            const option = document.createElement('option')
            option.value = 'my'
            option.id = 'option_my'
            option.text = userName
            captionSelect.appendChild(option)
            socket.emit('join-room', ROOM_ID, myPeer._id, cameraPeer._id)
            myP.innerHTML = myName

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
                    shareId = call.peer
                    if (!voiceZeroFlag) {
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
                    if (voiceZeroFlag)
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

                    if (stream.getAudioTracks().length != 0) {
                        const userSvg = document.getElementById(call.peer).querySelector('svg')
                        userSvg.innerHTML = mic_on
                    }
                })
            })


            socket.on('message', (message) => {
                const p = document.createElement('p')
                p.innerHTML = message
                messegeShow.appendChild(p)
            })

            socket.on('connection', (userId, userCameraId, name) => {
                // console.log('user: ' + userId + ' connection')
                if (screenStream) {
                    myPeer.call(userId, screenStream)
                }
                const userDiv = document.createElement('div')
                userDiv.id = userCameraId
                userDiv.classList.add('my-1')
                userDiv.classList.add('border')
                userDiv.classList.add('border-dark')
                const userDiv2 = document.createElement('div')
                userDiv2.classList.add('d-flex')
                const userSvg = document.createElementNS(svgNs, 'svg')
                userSvg.classList.add('bi')
                userSvg.classList.add('bi-mic-mute-fill')
                userSvg.classList.add('mx-1')
                userSvg.classList.add('my-1')
                userSvg.setAttribute('width', '16')
                userSvg.setAttribute('height', '16')
                userSvg.setAttribute('fill', 'currentColor')
                userSvg.setAttribute('viewBox', '0 0 16 16')
                userSvg.innerHTML = mic_off
                const p = document.createElement('p')
                p.classList.add('text-center')
                p.classList.add('margin-bottom-0')
                p.innerHTML = name
                const radioDiv = document.createElement('div')
                radioDiv.classList.add('ratio')
                radioDiv.classList.add('ratio-16x9')
                const cameraVideo = document.createElement('video')
                cameraVideo.classList.add('bg-dark')
                cameraVideo.srcObject = null
                cameraVideo.setSinkId(hornSelect.value)
                cameraVideo.volume = voiceRange.value / 100
                if (voiceZeroFlag) {
                    cameraVideo.muted = true
                }
                else {
                    cameraVideo.muted = false
                }
                userDiv2.append(userSvg)
                userDiv2.append(p)
                userDiv.append(userDiv2)
                radioDiv.append(cameraVideo)
                userDiv.append(radioDiv)
                staffInner.append(userDiv)
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

            socket.on('voteNum', num => {
                for (var i = 0; i < numOfVoteOptions.value; i++) {
                    const option_value = document.getElementById(`vote_option_${i}`).value
                    socket.emit('vote', num, option_value)
                }
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
                    sendVote.classList.add('btn')
                    sendVote.classList.add('btn-dark')
                    sendVote.classList.add('my-1')
                    sendVote.classList.add('mx-3')
                    const voteRoom = document.querySelector(`#voteRoom${num}`)
                    voteRoom.appendChild(sendVote)
                    console.log(votes[num])

                    sendVote.addEventListener('click', () => {
                        for (var i = 0; i < votes[num].num; i++) {
                            const choose = document.querySelector(`#vote${num}_option${i}`)
                            if (choose.checked) {
                                voteChooseFlag[num] = 1
                                socket.emit('voteChoose', num, choose.value)
                                voteButton.click()
                                votes[num].option[i].numOfVotes++
                            }
                        }
                    })
                }
                else {
                    if (voteNum < num) {
                        votes[num] = []
                        votes[num].name = vote_name
                        votes[num].option = []
                        var vote = document.createElement('button')
                        var br = document.createElement('br')
                        vote.classList.add('btn')
                        vote.classList.add('btn-secondary')
                        vote.classList.add('my-1')
                        vote.id = `vote${num}`
                        vote.textContent = vote_name
                        voteForm.appendChild(vote)
                        voteForm.appendChild(br)
                        voteNum = num
                        var voteRoom = document.createElement('div')
                        voteRoom.id = `voteRoom${num}`
                        voteRoom.classList.add('visually-hidden')
                        voteRoom.classList.add('p-3')
                        voteRoom.classList.add('mb-3')
                        voteRoom.classList.add('mb-md-0')
                        voteRoom.classList.add('me-md-3')
                        voteRoom.style.height = 84 + 'vh'
                        voteRooms.appendChild(voteRoom)
                        vote.addEventListener('click', () => {
                            if (voteChooseFlag[num] != 1) {
                                clearBottomRight()
                                voteRoomsPage.classList.remove('visually-hidden')
                                voteRoom.classList.remove('visually-hidden')
                            }
                            else {
                                for (var i = 0; i < votes[num].num; i++) {
                                    const choose = document.querySelector(`#vote${num}_option${i}`)
                                    if (choose.checked) {
                                        let alertText = `你已投了: ${choose.value}`
                                        votes[num].option.forEach(element => {
                                            alertText += `\n${element.name}: ${element.numOfVotes}`
                                        })
                                        alert(alertText)
                                    }
                                }
                            }
                        })
                        voteChooseFlag[num] = 0
                        votes[num].num = 0
                    }
                    var div = document.createElement('div')
                    var radio = document.createElement('input')
                    var label = document.createElement('label')
                    var optionNum = votes[num].num++
                    div.classList.add('form-check')
                    radio.type = 'radio'
                    radio.id = `vote${num}_option${optionNum}`
                    radio.name = `vote${num}_option`
                    radio.value = vote__option
                    radio.classList.add('form-chack-input')
                    label.classList.add('form-check-label')
                    label.setAttribute('for', `vote${num}_option${optionNum}`)
                    label.innerHTML = vote__option
                    div.append(radio)
                    div.append(label)
                    const vote__Room = document.querySelector(`#voteRoom${num}`)
                    vote__Room.append(div)
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

            socket.on('courseFile', fileName => {
                const downloadFileButton = document.createElement('button')
                const br = document.createElement('br')
                downloadFileButton.id = fileName
                downloadFileButton.textContent = fileName
                downloadFileButton.classList.add('btn')
                downloadFileButton.classList.add('btn-secondary')
                downloadFileButton.classList.add('my-1')
                file.appendChild(downloadFileButton)
                file.appendChild(br)

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

            socket.on('caption', (userId, captionText) => {
                if (captionSelect.value == userId) {
                    caption.innerHTML = captionText
                }
            })

            socket.on('sleep', () => {
                sleepNum++
                showSleepNum.innerHTML = sleepNum
            })

            socket.on('inSleep', () => {
                sleepNum--
                if(sleepNum)
                    showSleepNum.innerHTML = sleepNum
                else 
                    showSleepNum = ''
            })


            socket.on('stopStream', () => {
                video.srcObject = null
                // if (screenSource) {
                //     screenSource.disconnect(gainNode)
                // }
            })

            socket.on('stopCameraStream', (userCameraId) => {
                const userVideo = document.getElementById(userCameraId).querySelector('video')
                userVideo.srcObject = null
                const userSvg = document.getElementById(userCameraId).querySelector('svg')
                userSvg.innerHTML = mic_off

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
                    // console.log(userId)
                    if (shareId == userId) {
                        // console.log('stop')
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

        screenButtonm.addEventListener('click', () => {
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

                        if (video_startFlag && stream.getAudioTracks()[0]) {
                            screenSource = audioContext.createMediaStreamSource(stream)
                            screenSource.connect(gainNode)
                        }
                        video.muted = true
                        video.play()
                        sendStream(screenStream)
                        screenButtonm.classList.remove('btn-primary')
                        screenButtonm.classList.add('btn-dark')

                        stream.getTracks()[0].addEventListener('ended', () => {
                            screenButtonm.click()
                        })
                    })
                }
                else {
                    screenStream.getTracks().forEach(track => {
                        track.stop()
                    })
                    screenStream = null
                    video.srcObject = null
                    screenButtonm.classList.remove('btn-dark')
                    screenButtonm.classList.add('btn-primary')
                    socket.emit('stopStream');
                }
            }
        })

        const sendStream = (stream) => {
            peers.forEach(user => {
                myPeer.call(user.id, stream)
            })
        }

        cameraButtonm.addEventListener('click', () => {
            if (cameraPeer) {
                if (cameraStream) {
                    cameraStop()
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

        microphoneButtonm.addEventListener('click', () => {
            if (cameraPeer) {
                if (cameraStream) {
                    cameraStop()
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

        const cameraStop = () => {
            if (cameraStream) {
                socket.emit('stopCameraStream')
                cameraStream.getTracks().forEach(track => {
                    track.stop()
                })
                if (microphoneSource) {
                    microphoneSource.disconnect(microphoneGainNode)
                    microphoneSource = null
                }
                cameraStream = null
                myVideo.srcObject = null
                mySvg.innerHTML = mic_off
                cameraButtonm.classList.remove('btn-dark')
                cameraButtonm.classList.add('btn-primary')
                microphoneButtonm.classList.remove('btn-dark')
                microphoneButtonm.classList.add('btn-primary')
            }
        }

        const sendCameraStream = () => {
            if (options.video || options.audio) {
                navigator.mediaDevices.getUserMedia(options).then(stream => {
                    cameraStream = new MediaStream()
                    if (options.video) {
                        cameraStream.addTrack(stream.getVideoTracks()[0])
                        cameraButtonm.classList.remove('btn-primary')
                        cameraButtonm.classList.add('btn-dark')
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
                        mySvg.innerHTML = mic_on
                        microphoneButtonm.classList.remove('btn-primary')
                        microphoneButtonm.classList.add('btn-dark')
                    }
                    myVideo.srcObject = cameraStream
                    myVideo.play()
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

        recognition.onstart = () => { // 開始辨識
            recognizing = true // 設定為辨識中
        }

        recognition.onend = () => { // 辨識完成
            if (recognizing) {
                recognition.start()
                return
            }
            // console.log('stop')
        }

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

        voiceZeroButton.addEventListener('click', () => {
            if (voiceZeroFlag) {
                voiceZeroFlag = false
                voiceZeroButton.classList.remove('btn-dark')
                voiceZeroButton.classList.add('btn-secondary')
                if (!screenStream) {
                    video.muted = false
                }
                const userVideos = staff.querySelectorAll('video')
                userVideos.forEach(userVideo => {
                    if (userVideo.id != 'myVideo') {
                        userVideo.muted = false
                        if (userVideo.srcObject && userVideo.srcObject.getAudioTracks().length) {
                            userVideo.srcObject.getAudioTracks().forEach(track => track.enabled = true)
                        }
                    }

                })
            }
            else {
                voiceZeroFlag = true
                voiceZeroButton.classList.remove('btn-secondary')
                voiceZeroButton.classList.add('btn-dark')
                video.muted = true
                const userVideos = staff.querySelectorAll('video')
                userVideos.forEach(userVideo => {
                    if (userVideo.id != 'myVideo') {
                        userVideo.muted = true
                        if (userVideo.srcObject && userVideo.srcObject.getAudioTracks().length) {
                            userVideo.srcObject.getAudioTracks().forEach(track => track.enabled = true)
                        }
                    }
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
            if (microphoneSource)
                microphoneGainNode.gain.value = microphoneRange.value / 100
        })

        const draw = () => {
            html2canvas(body).then((img) => {
                bodyCanvas.width = img.width + 1
                bodyCanvas.height = img.height + 1
                const imgCtx = img.getContext('2d')
                const imageData = imgCtx.getImageData(0, 0, img.width, img.height)
                bodyCtx.putImageData(imageData, 0, 0)

                // var width
                // var height
                // if ((video.videoWidth / video.videoHeight) < (video.offsetWidth / video.offsetHeight)) {
                //     height = video.offsetHeight
                //     width = (height * video.videoWidth) / video.videoHeight
                // }
                // else {
                //     width = video.offsetWidth
                //     height = (width * video.videoHeight) / video.videoWidth
                // }

                // var rect = video.getBoundingClientRect();
                // var x = rect.left + (video.offsetWidth - width) / 2
                // var y = rect.top + (video.offsetHeight - height) / 2

                // bodyCtx.drawImage(video, x, y, width, height)

                // html2canvas(caption).then((img2) => {
                //     rect = caption.getBoundingClientRect()
                //     x = rect.left
                //     y = rect.top
                //     // console.log(x)
                //     // console.log(y)
                //     bodyCtx.drawImage(img2, x, y, img2.width, img2.height)
                // })
            })


            if (video_startFlag)
                setTimeout(draw, 10)
        }

        video_startButtonm.addEventListener('click', () => {
            if (video_startFlag) {
                recorder.stop()
                video_startFlag = false
                video_startButtonm.classList.remove('btn-dark')
                video_startButtonm.classList.add('btn-primary')
            }
            else {
                video_startFlag = true
                draw()
                mixStream = new MediaStream()
                audioContext = new AudioContext()
                destination = audioContext.createMediaStreamDestination()
                gainNode = audioContext.createGain()
                gainNode.gain.value = voiceRange.value / 100

                mixStream.addTrack(bodyCanvas.captureStream().getVideoTracks()[0])
                if (video.srcObject) {
                    if (video.srcObject.getAudioTracks()[0]) {
                        screenSource = audioContext.createMediaStreamSource(video.srcObject)
                        screenSource.connect(gainNode)
                    }
                }
                if (cameraStream) {
                    audioContext.createMediaStreamSource(cameraStream).connect(gainNode)
                }
                const userVideos = staff.querySelectorAll('video')
                userVideos.forEach(userVideo => {
                    if (userVideo.srcObject != null && userVideo.srcObject.getAudioTracks().length != 0) {
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
                    const blob = new Blob(chunks, { type: 'video/webm' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'recoding.webm'
                    a.click()
                    URL.revokeObjectURL(url)
                }

                recorder.start()
                video_startButtonm.classList.remove('btn-primary')
                video_startButtonm.classList.add('btn-dark')
            }
        })

        stopMeetingButton.addEventListener('click', () => {
            socket.emit('stopMeeting')
        })
    }
})();