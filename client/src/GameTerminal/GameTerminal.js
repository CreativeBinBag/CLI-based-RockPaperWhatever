import React, { useEffect } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const GameTerminal = () => {
    useEffect(() => {
        const ws = new WebSocket('wss://cli-based-rockpaperwhateverbackend-cmow.onrender.com');
        const terminal = new Terminal();
        terminal.open(document.getElementById('terminal'));

        let inputBuffer = '';

        ws.onopen = () => {
            console.log('WebSocket connection opened');
        };

        ws.onmessage = (event) => {
            console.log('Message received from server:', event.data);
            terminal.writeln(event.data);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        terminal.onData(data => {
            // Accumulate input data
            if (data.charCodeAt(0) === 13) { // Enter key (newline)
                if (inputBuffer.trim()) {
                    ws.send(inputBuffer.trim()); // Send the complete input
                }
                inputBuffer = ''; // Clear the buffer
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
