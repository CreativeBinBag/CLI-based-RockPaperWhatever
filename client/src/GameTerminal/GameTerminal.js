import React, { useEffect, useState } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const GameTerminal = () => {
    const [ws, setWs] = useState(null); // Initialize WebSocket state

    useEffect(() => {
        // Create a new WebSocket connection
        const websocket = new WebSocket('wss://cli-based-rockpaperwhateverbackend-cmow.onrender.com');
        setWs(websocket); // Set the WebSocket instance to state

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
        };

        terminal.onData(data => {
            // Accumulate input data
            if (data.charCodeAt(0) === 13) { // Enter key (newline)
                if (inputBuffer.trim()) {
                    console.log('Sending data to server:', inputBuffer.trim());
                    websocket.send(inputBuffer.trim()); // Send the complete input
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
            if (ws) {
                ws.close(); // Close the WebSocket connection when component unmounts
            }
        };
    }, [ws]); // Dependency array ensures cleanup if ws changes

    return <div id="terminal" style={{ width: '100%', height: '500px' }} />;
};

export default GameTerminal;

