import React, { useEffect } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const GameTerminal = () => {
    useEffect(() => {
        const ws = new WebSocket('wss://cli-based-rockpaperwhateverbackend-cmow.onrender.com');
        const terminal = new Terminal();
        terminal.open(document.getElementById('terminal'));

        ws.onopen = () => {
          console.log('WebSocket connection opened');
      };

        // Handle data from WebSocket (game process)
        ws.onmessage = (event) => {
            console.log('Message received from server:', event.data);
            terminal.writeln(event.data);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
      };

        // Send user input to WebSocket (game process)
        terminal.onData(data => {
          
          if (data.charCodeAt(0) === 13) { // Enter key (newline)
            ws.send(inputBuffer.trim()); // Send the complete input
            inputBuffer = ''; // Clear the buffer
        } else {
            inputBuffer += data; // Accumulate data
        }
          console.log('Sending data to server:', data);
          
        });

        return () => {
          console.log('WebSocket connection closed');
            ws.close();
        };
    }, []);

    return <div id="terminal" style={{ width: '100%', height: '500px' }} />;
};

export default GameTerminal;
