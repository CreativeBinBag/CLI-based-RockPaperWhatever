import React, { useEffect } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const GameTerminal = () => {
    useEffect(() => {
        const ws = new WebSocket('wss://cli-based-rockpaperwhateverbackend-cmow.onrender.com');
        const terminal = new Terminal({
            cols: 200,
            rows: 40,  
            cursorBlink: true,
            fontFamily: 'monospace',
            fontSize: 14,
            theme: {
              background: '#1D1F21',
              foreground: '#C5C8C6'
            }
        });
        terminal.open(document.getElementById('terminal'));

        let inputBuffer = '';
        let movesSent = false;

        ws.onopen = () => {
            terminal.writeln('Welcome to Rock-Paper-Scissors!');
            terminal.writeln('Please enter the moves (comma-separated), then press Enter:');
        };

        ws.onmessage = (event) => {
          // Ensure proper line endings and handle terminal width
          const formattedData = event.data.replace(/\r\n|\r|\n/g, '\r\n');
          terminal.writeln(formattedData + '\r\n'); 
      };
      

        ws.onerror = (error) => {
            terminal.writeln(`WebSocket error: ${error.message}`);
        };

        terminal.onData(data => {
          if (data.charCodeAt(0) === 13) { // Enter key
              if (inputBuffer.trim()) {
                  if (!movesSent) {
                      ws.send(JSON.stringify({ type: 'moves', data: inputBuffer.split(',').map(m => m.trim()).filter(m => m.length > 0) }));
                      movesSent = true;
                      terminal.writeln('\nMoves sent! Please enter your move (number) or type "?" for help:');
                  } else {
                      ws.send(JSON.stringify({ type: 'move', data: inputBuffer.trim() }));
                  }
                  inputBuffer = '';
              }
          } else if (data.charCodeAt(0) === 127) { // Backspace key
              if (inputBuffer.length > 0) {
                  inputBuffer = inputBuffer.slice(0, -1);
                  terminal.write('\b \b');
              }
          } else {
              inputBuffer += data;
              terminal.write(data);
          }
      });
      


        return () => {
            ws.close();
        };
    }, []);

    return <div id="terminal" style={{ width: '100%', height: '500px' }} />;
};

export default GameTerminal;
