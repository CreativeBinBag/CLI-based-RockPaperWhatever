import React, { useEffect, useState } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const GameTerminal = () => {
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const websocket = new WebSocket('wss://cli-based-rockpaperwhateverbackend-cmow.onrender.com');
        setWs(websocket);

        const terminal = new Terminal();
        terminal.open(document.getElementById('terminal'));

        let inputBuffer = '';

        websocket.onopen = () => {
            console.log('WebSocket connection opened');
        };

        websocket.onmessage = (event) => {
            console.log('Message received from server:', event.data);
            terminal.writeln(event.data);
        };

        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
            if (error.message) {
                console.error('Error message:', error.message);
            }
            if (error.stack) {
                console.error('Error stack:', error.stack);
            }
        };

        terminal.onData(data => {
            if (data.charCodeAt(0) === 13) { // Enter key
                if (inputBuffer.trim()) {
                    console.log('Sending data to server:', inputBuffer.trim());
                    websocket.send(inputBuffer.trim());
                }
                inputBuffer = '';
            } else if (data.charCodeAt(0) === 8) { // Backspace key
                inputBuffer = inputBuffer.slice(0, -1);
                terminal.write('\b \b');
            } else {
                inputBuffer += data;
                terminal.write(data);
            }
        });

        return () => {
            console.log('WebSocket connection closed');
            if (ws) {
                ws.close();
            }
        };
    }, [ws]);

    return <div id="terminal" style={{ width: '100%', height: '500px' }} />;
};

export default GameTerminal;
