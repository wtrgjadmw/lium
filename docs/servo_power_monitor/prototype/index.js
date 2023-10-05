import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import {spawn} from 'child_process';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    console.log(req.socket.remoteAddress);
  res.sendFile(new URL('./index.html', import.meta.url).pathname);
});

io.on('connection', (socket) => {
    socket.on('msg receive', (msg) => {
        console.log(msg);
        // exec(msg, (err, stdout, stderr) => {
        //     if (err) {
        //         console.error(err);
        //         return;
        //     }
        //     if (stderr) {
        //         console.error(stderr);
        //         return;
        //     }
        //     io.emit('msg send', stdout);
        // });
        const bat = spawn('lium', ['dut', 'shell', '--dut', 'droid_NXHKDSJ003138124257611', '--', 'restart', 'ui']);

        bat.stdout.on('data', (data) => {
            io.emit('msg send', data.toString());
        });

        bat.stderr.on('data', (data) => {
            io.emit('msg send', data.toString());
        });

        bat.on('exit', (code) => {
            io.emit('msg send', code.toString());
        }); 
    });
  });


server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});