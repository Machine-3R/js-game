//process.env.DEBUG = 'express:*';
const pem = require('pem');
const path = require('path');
const https = require('https');
const express = require('express');
const socketio = require('socket.io');
const expressWs = require('express-ws');

pem
    .createCertificate({days: 1, selfSigned: true}, async (err, keys) => {
        if (err) {
            throw err;
        }

        let app = express();
        app.use(express.static('public'));

        let server = https
            .createServer({
                key: keys.serviceKey,
                cert: keys.certificate
            }, app)
            .listen(443, data => {
                console.log('Server started listening...');
            });

        let io = socketio(server);
        io.on('connection', socket => {

            socket
                .on('hello', message => {
                    console.log(message);
                })
                .on('disconnect', () => {
                    console.log('client disconnected');
                });

            socket.emit('hi', 'Server says "hi".');
        });
    });
