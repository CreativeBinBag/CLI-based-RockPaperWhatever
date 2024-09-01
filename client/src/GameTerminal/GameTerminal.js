import React, { useEffect } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const GameTerminal = () => {
    useEffect(() => {
        const ws = new WebSocket('wss://cli-based-rockpaperwhateverbackend-cmow.onrender.com');
        const terminal = new Terminal();
        terminal.open(document.getElementById('terminal'));

        let inputBuffer = '';
        let movesSent = false;

        ws.onopen = () => {
            console.log('WebSocket connection opened');
            terminal.writeln('Welcome to Rock-Paper-Scissors!');
            terminal.writeln('Please enter the moves (comma-separated), then press Enter:');
        };

        ws.onmessage = (event) => {
          const message = event.data.trim();
          if (message.length > 0) {
              terminal.writeln(message);
          }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        terminal.onData(data => {
            if (data.charCodeAt(0) === 13) { // Enter key (newline)
                if (inputBuffer.trim()) {
                    if (!movesSent) {
                        ws.send(JSON.stringify({ type: 'moves', data: inputBuffer.trim().split(',').map(m => m.trim()) }));
                        movesSent = true;
                        terminal.writeln('Moves sent! Please enter your move:');
                    } else {
                        ws.send(JSON.stringify({ type: 'move', data: inputBuffer.trim() }));
                    }
                    inputBuffer = ''; // Clear the buffer
                }
            } else if (data.charCodeAt(0) === 8) { // Backspace key
                inputBuffer = inputBuffer.slice(0, -1); // Remove last character
                terminal.write('\b \b'); // Visual feedback for backspace
            } else {
                inputBuffer += data; // Accumulate data
                terminal.write(data); // Echo the data to terminal
            }
        });

        return () => {
            console.log('WebSocket connection closed');
            ws.close();
        };
    }, []);

    return <div id="terminal" style={{ width: '100%', height: '500px' }} />;
};

export default GameTerminal;
