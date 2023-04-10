var socketio = {}
var socket_io = require('socket.io')
var roomStaff = []
var roomVote = []
let mysql = require('mysql');
let config = require('./config');
let connection = mysql.createConnection(config);
const fs = require('fs');
const path = require('path')

const courseId = 1

socketio.getSocketio = (server) => {
    var io = socket_io(server)

    io.sockets.on('connection', socket => {
        socket.on('sessionId', (sessionId) => {
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
                            cameraId: cameraId
                        }
                        roomStaff[roomId].push(userInfo)
                        // console.log(roomStaff[roomId])

                        let sql = `SELECT * FROM courseFile WHERE courseId='1'`;
                        connection.query(sql, [true], (error, results, fields) => {
                            if (error) {
                                return console.error(error.message);
                            }

                            results.forEach(result => {
                                socket.emit('courseFile', result['fileName'])
                            })
                        });

                        socket.on('message', (message) => {
                            console.log(message)
                            io.to(roomId).emit('message', message)
                        })

                        socket.on('shareId', () => {
                            socket.to(roomId).emit('shareId', userId)
                        })

                        socket.on('getVoteNum', (voteName) => {
                            const num = ++roomVote[roomId].voteNum
                            socket.emit('voteNum', num)
                            roomVote[roomId][num] = []
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
                            console.log(roomVote[roomId])
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
                                        let sql = `INSERT INTO speachrecognitionresults(courseId, userAccount, filePath)
                                                    VALUES('${courseId}', '${userAccount}', './public/files/${roomId}/${courseId}/caption/${userAccount}.txt')`
                                        connection.query(sql);
                                    }
                                });
                            }
                        })

                        socket.on('uploadFile', (fileName, fileType, fileData) => {
                            // console.log(fileName + ' ' + fileType)
                            // console.log(fileData)
                            if (!fs.existsSync(`./public/files/${courseId}`))
                                fs.mkdirSync(`./public/files/${courseId}`)
                            if (!fs.existsSync(`./public/files/${courseId}/${roomId}`))
                                fs.mkdirSync(`./public/files/${courseId}/${roomId}`)
                            if (fs.existsSync(`./public/files/${courseId}/${roomId}/${fileName}`)) {
                                const parsed = path.parse(fileName)
                                fileName = `${parsed.name}_${Date.now()}${parsed.ext}`
                                console.log(fileName)
                            }
                            fs.writeFile(`./public/files/${courseId}/${roomId}/${fileName}`, fileData, err => {
                                if (err) {
                                    console.log(err)
                                }
                                let sql = `INSERT INTO coursefile(courseId, fileName, fileType, filePath)
                                                    VALUES('${courseId}', '${fileName}', '${fileType}', './public/files/${courseId}/${roomId}/${fileName}')`
                                connection.query(sql);
                                io.to(roomId).emit('courseFile', fileName)
                            })
                        })

                        socket.on('downloadFile', fileName => {
                            fs.readFile(`./public/files/${courseId}/${roomId}/${fileName}`, (err, data) => {
                                if (err) {
                                    console.error(err)
                                    return
                                }

                                let sql = `SELECT * FROM courseFile WHERE courseId = '${courseId}' && fileName = '${fileName}'`;
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

                        socket.on('stopStream', () => {
                            socket.to(roomId).emit('stopStream')
                        })

                        socket.on('stopCameraStream', () => {
                            socket.to(roomId).emit('stopCameraStream')
                        })

                        socket.on('disconnect', () => {
                            const n = roomStaff[roomId].map(x => x.id).indexOf(userId)
                            if (n != -1) {
                                roomStaff[roomId].splice(n, 1)
                            }
                            console.log(roomStaff[roomId])
                            socket.to(roomId).emit('user-disconnected', userId)
                        })
                    })
                })
            })
        })
    })
}

module.exports = socketio