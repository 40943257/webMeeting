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

const courseId = 1


if (!fs.existsSync(`./public/files`))
    fs.mkdirSync(`./public/files`)

socketio.getSocketio = (server) => {
    var io = socket_io(server, {
        maxHttpBufferSize: 1024 * 1024 * 1024
    })

    io.sockets.on('connection', socket => {
        const cookies = cookie.parse(socket.request.headers.cookie)
        const sessionId = cookies.PHPSESSID

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

                    socket.join(roomId)
                    socket.to(roomId).emit('connection', userId, cameraId, name)

                    if (!(roomStaff[roomId])) {
                        roomStaff[roomId] = []
                        roomStaff[roomId].sleepNum = 0
                        roomVote[roomId] = []
                        roomVote[roomId].voteNum = 0
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

                    let sql = `SELECT * FROM courseFile WHERE courseId='${courseId}' and courseLink = '${roomId}'`;
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
                            if (!fs.existsSync(`./public/files/${courseId}`))
                                fs.mkdirSync(`./public/files/${courseId}`)
                            if (!fs.existsSync(`./public/files/${courseId}/${roomId}`))
                                fs.mkdirSync(`./public/files/${courseId}/${roomId}`)
                            if (!fs.existsSync(`./public/files/${courseId}/${roomId}/caption`))
                                fs.mkdirSync(`./public/files/${courseId}/${roomId}/caption`)

                            fs.writeFile(`./public/files/${courseId}/${roomId}/caption/${userAccount}.txt`, captionText, { flag: 'a' }, err => {
                                if (err) {
                                    console.log(err)
                                }
                            })

                            let sql = `SELECT * FROM speachrecognitionresults WHERE courseId = '${courseId}' && userAccount = '${userAccount}'`;
                            connection.query(sql, [true], (error, results, fields) => {
                                if (error) {
                                    return console.error(error.message);
                                }
                                if (Object.keys(results).length == 0) {
                                    let sql = `INSERT INTO speachrecognitionresults(courseId, courseLink, userAccount, filePath)
                                                    VALUES('${courseId}', '${roomId}', '${userAccount}', './public/files/${roomId}/${courseId}/caption/${userAccount}.txt')`
                                    connection.query(sql);
                                }
                            });
                        }
                    })

                    socket.on('uploadFile', (fileName, fileType, fileData) => {
                        // console.log(fileName)
                        // console.log(fileData)
                        if (!fs.existsSync(`./public/files/${courseId}`))
                            fs.mkdirSync(`./public/files/${courseId}`)
                        if (!fs.existsSync(`./public/files/${courseId}/${roomId}`))
                            fs.mkdirSync(`./public/files/${courseId}/${roomId}`)
                        if (fs.existsSync(`./public/files/${courseId}/${roomId}/${fileName}`)) {
                            const parsed = path.parse(fileName)
                            var fileNum = 1
                            var newFileName = `${parsed.name}(${fileNum})${parsed.ext}`
                            while (fs.existsSync(`./public/files/${courseId}/${roomId}/${newFileName}`)) {
                                fileNum++
                                newFileName = `${parsed.name}(${fileNum})${parsed.ext}`
                            }
                            fileName = newFileName
                        }
                        // console.log(fileName)
                        fs.writeFile(`./public/files/${courseId}/${roomId}/${fileName}`, fileData, err => {
                            if (err) {
                                console.log(err)
                            }
                            let sql = `INSERT INTO coursefile(courseId, courseLink, fileName, fileType, filePath)
                                                    VALUES('${courseId}', '${roomId}', '${fileName}', '${fileType}', './public/files/${courseId}/${roomId}/${fileName}')`
                            connection.query(sql)
                            io.to(roomId).emit('courseFile', fileName)
                        })
                    })

                    socket.on('downloadFile', fileName => {
                        fs.readFile(`./public/files/${courseId}/${roomId}/${fileName}`, (err, data) => {
                            if (err) {
                                console.error(err)
                                return
                            }

                            let sql = `SELECT * FROM courseFile WHERE courseId = '${courseId}' && courseLink = '${roomId}' && fileName = '${fileName}'`;
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

                    socket.on('sleep', () => {
                        var n = roomStaff[roomId].map(x => x.id).indexOf(userId)
                        if (n != -1) {
                            if(!roomStaff[roomId][n].isSleep) {
                                roomStaff[roomId].sleepNum++
                                io.to(roomId).emit('sleep', roomStaff[roomId].sleepNum)
                                roomStaff[roomId][n].isSleep = true
                            }
                        }
                    })
        
                    socket.on('unSleep', () => {
                        var n = roomStaff[roomId].map(x => x.id).indexOf(userId)
                        if (n != -1) {
                            if(roomStaff[roomId][n].isSleep) {
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
                            if(roomStaff[roomId][n].isSleep) {
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
                        // console.log(roomVote[roomId])
                        if (roomVote[roomId].voteNum > 0) {
                            if (!fs.existsSync(`./public/files/${courseId}`))
                                fs.mkdirSync(`./public/files/${courseId}`)
                            if (!fs.existsSync(`./public/files/${courseId}/${roomId}`))
                                fs.mkdirSync(`./public/files/${courseId}/${roomId}`)
                            if (!fs.existsSync(`./public/files/${courseId}/${roomId}/vote`))
                                fs.mkdirSync(`./public/files/${courseId}/${roomId}/vote`)
                            const fileName = `vote_${Date.now()}.json`

                            fs.writeFile(`./public/files/${courseId}/${roomId}/vote/${fileName}`, JSON.stringify(roomVote[roomId]), err => {
                                if (err) {
                                    console.error(err)
                                    return
                                }

                                let sql = `INSERT INTO coursevote(courseId, courseLink, fileName, filePath)
                                                        VALUES('${courseId}', '${roomId}', '${fileName}', './public/files/${courseId}/${roomId}/vote')`
                                connection.query(sql)
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