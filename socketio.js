var socketio = {}
var socket_io = require('socket.io')
var roomStaff = []
var clientSocket = []
var roomVote = []
let mysql = require('mysql');
let config = require('./config');
let connection = mysql.createConnection(config);
const fs = require('fs');
const path = require('path');
const cookie = require('cookie')
const { WritableStreamBuffer } = require('stream-buffers');
const filePath = './public/files'

if (!fs.existsSync(`${filePath}`))
    fs.mkdirSync(`${filePath}`)

socketio.getSocketio = (server) => {
    var io = socket_io(server, {
        maxHttpBufferSize: 1024 * 1024 * 1024
    })

    io.sockets.on('connection', socket => {
        const cookies = cookie.parse(socket.request.headers.cookie)
        const sessionId = cookies.PHPSESSID
        var chunks = []
        var recorderNum = 0

        let sql = `SELECT * FROM cookiedata WHERE phpSessionId = '${sessionId}'`
        connection.query(sql, [true], (error, results, fields) => {
            if (error) {
                return console.error(error.message);
            }
            // console.log(results[0]['userAccount']);

            const userAccount = results[0]["userAccount"]
            let sql = `SELECT * FROM userinfo WHERE userAccount = '${userAccount}'`
            connection.query(sql, [true], (error, results, fields) => {
                if (error) {
                    return console.error(error.message);
                }
                // console.log(results[0]['userName']);
                const name = results[0]['userName']
                socket.emit('name', name)
                socket.on('join-room', (roomId, userId, cameraId) => {

                    let sql2 = `SELECT * FROM courseInfo WHERE courseId = '${roomId}'`
                    connection.query(sql2, [true], (error, results, fields) => {
                        const now = new Date()

                        const courseDateEnd = new Date(`${results[0]['courseDateEnd']}`)
                        courseDateEnd.setDate(courseDateEnd.getDate() + 1)
                        const datePart2 = courseDateEnd.toISOString().split("T")[0];
                        const endTime = new Date(`${datePart2}T${results[0]['courseTimeEnd']}`)

                        setTimeout(
                            function () {
                                socket.emit('stopMeeting')
                                if (roomVote[roomId].voteNum > 0) {
                                    if (!fs.existsSync(`${filePath}/${roomId}/vote`))
                                        fs.mkdirSync(`${filePath}/${roomId}/vote`)
                                    const fileName = `vote_${Date.now()}.json`

                                    fs.writeFile(`${filePath}/${roomId}/vote/${fileName}`, JSON.stringify(roomVote[roomId]), err => {
                                        if (err) {
                                            console.error(err)
                                            return
                                        }

                                        let sql2 = `SELECT * FROM coursevote WHERE courseId = '${roomId}'`;
                                        connection.query(sql2, [true], (error, results, fields) => {
                                            if (error) {
                                                return console.error(error.message);
                                            }
                                            if (Object.keys(results).length == 0) {
                                                let sql = `INSERT INTO coursevote(courseId, fileName, filePath)
                                                                VALUES('${roomId}', '${fileName}', '${filePath}/${roomId}/vote')`
                                                connection.query(sql)
                                            }
                                        });
                                    })
                                }
                            },
                            endTime - now
                        )
                    })

                    socket.join(roomId)
                    socket.to(roomId).emit('connection', userId, cameraId, name)

                    if (!(roomStaff[roomId])) {
                        roomStaff[roomId] = []
                        roomStaff[roomId].sleepNum = 0
                        roomVote[roomId] = []
                        roomVote[roomId].voteNum = 0
                        if (!fs.existsSync(`${filePath}/${roomId}`))
                            fs.mkdirSync(`${filePath}/${roomId}`)
                    }
                    else {
                        roomStaff[roomId].forEach(element => {
                            socket.emit('connection', element.id, element.cameraId, element.name)
                        });

                        roomVote[roomId].forEach(element => {
                            element.option.forEach(element2 => {
                                socket.emit('vote', element.num, element.name, element2.voteOption, element2.numOfVotes)
                            })
                        })
                    }

                    const userInfo = {
                        name: name,
                        id: userId,
                        cameraId: cameraId,
                        isSleep: false
                    }
                    if (!clientSocket[sessionId])
                        clientSocket[sessionId] = []
                    clientSocket[sessionId].push(socket)
                    roomStaff[roomId].push(userInfo)
                    // console.log(roomStaff[roomId])

                    socket.emit('sleep', roomStaff[roomId].sleepNum)

                    let sql = `SELECT * FROM courseFile WHERE courseId='${roomId}'`;
                    connection.query(sql, [true], (error, results, fields) => {
                        if (error) {
                            return console.error(error.message);
                        }

                        results.forEach(result => {
                            socket.emit('courseFile', result['fileName'])
                        })
                    });

                    socket.on('message', (message) => {
                        // console.log(message)
                        io.to(roomId).emit('message', message)
                        const date = new Date()
                        message = `${date.toLocaleTimeString()} ${message}\n`
                        fs.writeFile(`${filePath}/${roomId}/messege.txt`, message, { flag: 'a' }, err => {
                            if (err) {
                                console.log(err)
                            }
                        })
                    })

                    socket.on('getVoteNum', (voteName) => {
                        const num = ++roomVote[roomId].voteNum
                        socket.emit('voteNum', num)
                        roomVote[roomId][num] = {}
                        roomVote[roomId][num].num = num
                        roomVote[roomId][num].name = voteName
                        roomVote[roomId][num].option = []
                    })

                    socket.on('vote', (n, vote_option) => {
                        io.to(roomId).emit('vote', n, roomVote[roomId][n].name, vote_option, 0)

                        var voteOption = {
                            voteOption: vote_option,
                            numOfVotes: 0
                        }
                        roomVote[roomId][n].option.push(voteOption)
                        // console.log(roomVote[roomId])
                    })

                    socket.on('voteChoose', (n, choose) => {
                        // console.log(n + ' ' + vote_name + ' ' + choose)
                        const num = roomVote[roomId][n].option.map(x => x.voteOption).indexOf(choose)
                        if (num != -1) {
                            roomVote[roomId][n].option[num].numOfVotes++
                            socket.to(roomId).emit('voteChoose', n, roomVote[roomId][n].name, choose, roomVote[roomId][n].option[num].numOfVotes)
                        }
                    })

                    socket.on('caption', (isFinal, captionText) => {
                        socket.to(roomId).emit('caption', userId, captionText)

                        if (isFinal) {
                            if (!fs.existsSync(`${filePath}/${roomId}/caption`))
                                fs.mkdirSync(`${filePath}/${roomId}/caption`)

                            fs.writeFile(`${filePath}/${roomId}/caption/${userAccount}.txt`, captionText, { flag: 'a' }, err => {
                                if (err) {
                                    console.log(err)
                                }
                            })

                            let sql = `SELECT * FROM speachrecognitionresults WHERE courseId = '${roomId}' && userAccount = '${userAccount}'`;
                            connection.query(sql, [true], (error, results, fields) => {
                                if (error) {
                                    return console.error(error.message);
                                }
                                if (Object.keys(results).length == 0) {
                                    let sql = `INSERT INTO speachrecognitionresults(courseId, userAccount, fileName, filePath)
                                                    VALUES('${roomId}', '${userAccount}', '${userAccount}.txt', '${filePath}/${roomId}/caption')`
                                    connection.query(sql);
                                }
                            });
                        }
                    })

                    socket.on('uploadFile', (fileName, fileType, fileData) => {
                        // console.log(fileName)
                        // console.log(fileData)
                        if (fs.existsSync(`${filePath}/${roomId}/${fileName}`)) {
                            const parsed = path.parse(fileName)
                            var fileNum = 1
                            var newFileName = `${parsed.name}(${fileNum})${parsed.ext}`
                            while (fs.existsSync(`${filePath}/${roomId}/${newFileName}`)) {
                                fileNum++
                                newFileName = `${parsed.name}(${fileNum})${parsed.ext}`
                            }
                            fileName = newFileName
                        }
                        // console.log(fileName)
                        fs.writeFile(`${filePath}/${roomId}/${fileName}`, fileData, err => {
                            if (err) {
                                console.log(err)
                            }
                            let sql = `INSERT INTO coursefile(courseId, fileName, fileType, filePath)
                                                    VALUES('${roomId}', '${fileName}', '${fileType}', '${filePath}/${roomId}')`
                            connection.query(sql)
                            io.to(roomId).emit('courseFile', fileName)
                        })
                    })

                    socket.on('downloadFile', fileName => {
                        fs.readFile(`${filePath}/${roomId}/${fileName}`, (err, data) => {
                            if (err) {
                                console.error(err)
                                return
                            }

                            let sql = `SELECT * FROM courseFile WHERE courseId = '${roomId}' && fileName = '${fileName}'`;
                            connection.query(sql, [true], (error, results, fields) => {
                                if (error) {
                                    return console.error(error.message);
                                }
                                if (Object.keys(results).length == 1) {
                                    socket.emit('downloadFile', fileName, results['fileType'], data)
                                }
                            });
                        })
                    })

                    socket.on('recordStart', () => {
                        recorderNum++
                    })

                    socket.on('recordStop', (recordStartTime, recordEndTime) => {
                        if (chunks.length > 0) {
                            const chunks2 = chunks
                            chunks = []

                            const buffer = new WritableStreamBuffer();

                            for (const chunk of chunks2) {
                                buffer.write(chunk);
                            }
                            buffer.end(); // 結束寫入

                            // 取得完整的 Blob
                            const blob = buffer.getContents();

                            if (!fs.existsSync(`${filePath}/${roomId}/record`))
                                fs.mkdirSync(`${filePath}/${roomId}/record`)

                            fs.writeFile(`${filePath}/${roomId}/record/record${recorderNum}.webm`, blob, err => {
                                if (err) {
                                    console.error(err)
                                    return
                                }

                                let sql = `INSERT INTO courseRecord(courseId, fileName, recordStart, recordEnd, filePath)
                                                    VALUES('${roomId}', 'record${recorderNum}.webm', '${recordStartTime}', '${recordEndTime}', '${filePath}/${roomId}/record')`
                                connection.query(sql);
                            })
                        }
                    })

                    socket.on('chunks', (data) => {
                        socket.emit('gotChunks')
                        chunks.push(data)
                    })

                    socket.on('sleep', () => {
                        var n = roomStaff[roomId].map(x => x.id).indexOf(userId)
                        if (n != -1) {
                            if (!roomStaff[roomId][n].isSleep) {
                                roomStaff[roomId].sleepNum++
                                io.to(roomId).emit('sleep', roomStaff[roomId].sleepNum)
                                roomStaff[roomId][n].isSleep = true
                            }
                        }
                    })

                    socket.on('unSleep', () => {
                        var n = roomStaff[roomId].map(x => x.id).indexOf(userId)
                        if (n != -1) {
                            if (roomStaff[roomId][n].isSleep) {
                                roomStaff[roomId].sleepNum--
                                io.to(roomId).emit('sleep', roomStaff[roomId].sleepNum)
                                roomStaff[roomId][n].isSleep = false
                            }
                        }
                    })

                    socket.on('stopStream', () => {
                        socket.to(roomId).emit('stopStream')
                    })

                    socket.on('stopCameraStream', () => {
                        socket.to(roomId).emit('stopCameraStream', cameraId)
                    })

                    socket.on('disconnect', () => {
                        var n = roomStaff[roomId].map(x => x.id).indexOf(userId)
                        if (n != -1) {
                            if (roomStaff[roomId][n].isSleep) {
                                roomStaff[roomId].sleepNum--
                                io.to(roomId).emit('sleep', roomStaff[roomId].sleepNum)
                            }

                            roomStaff[roomId].splice(n, 1)
                        }
                        // console.log(roomStaff[roomId])
                        var n = 0
                        clientSocket.forEach(element => {
                            if (element == socket)
                                clientSocket[sessionId].splice(n, 1)
                            n++
                        })
                        socket.to(roomId).emit('user-disconnected', userId)
                    })

                    socket.on('stopMeeting', () => {
                        io.to(roomId).emit('stopMeeting')
                        if (roomVote[roomId].voteNum > 0) {
                            if (!fs.existsSync(`${filePath}/${roomId}/vote`))
                                fs.mkdirSync(`${filePath}/${roomId}/vote`)
                            const fileName = `vote_${Date.now()}.json`

                            fs.writeFile(`${filePath}/${roomId}/vote/${fileName}`, JSON.stringify(roomVote[roomId]), err => {
                                if (err) {
                                    console.error(err)
                                    return
                                }

                                let sql2 = `SELECT * FROM coursevote WHERE courseId = '${roomId}'`;
                                connection.query(sql2, [true], (error, results, fields) => {
                                    if (error) {
                                        return console.error(error.message);
                                    }
                                    if (Object.keys(results).length == 0) {
                                        let sql = `INSERT INTO coursevote(courseId, fileName, filePath)
                                                                VALUES('${roomId}', '${fileName}', '${filePath}/${roomId}/vote')`
                                        connection.query(sql)
                                    }
                                });
                            })
                        }

                    })
                })
            })
        })

        socket.on('logout', sessId => {
            // console.log(sessId)
            socket.emit('access')
            if (clientSocket[sessId] != null) {
                clientSocket[sessId].forEach(element => {
                    element.emit('logout')
                })
                clientSocket[sessId] = null

                let sql = `DELETE FROM cookiedata where phpSessionId = '${sessId}'`;
                connection.query(sql, 1, (error, results, fields) => {
                    if (error)
                        return console.error(error.message);
                })
            }
        })
    })
}

module.exports = socketio
