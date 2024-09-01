import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const GameTerminal = () => {
    const terminalRef = useRef(null);
    const wsRef = useRef(null);
    const inputBuffer = useRef('');
    const movesSent = useRef(false);

    useEffect(() => {
        const ws = new WebSocket('wss://cli-based-rockpaperwhateverbackend-cmow.onrender.com');
        wsRef.current = ws;

        const terminal = new Terminal();
        terminal.open(terminalRef.current);

        terminal.writeln('Welcome to Rock-Paper-Scissors!');
        terminal.writeln('Please enter the moves (comma-separated), then press Enter:');

        ws.onopen = () => {
            // Additional initialization if needed
        };

        ws.onmessage = (event) => {
            terminal.writeln(event.data.trim());
        };

        ws.onerror = (error) => {
            terminal.writeln(`WebSocket error: ${error.message}`);
        };

        terminal.onData(data => {
            if (data.charCodeAt(0) === 13) { // Enter key
                handleEnterKey();
            } else if (data.charCodeAt(0) === 8) { // Backspace
                handleBackspace();
            } else {
                inputBuffer.current += data;
                terminal.write(data);
            }
        });

        return () => {
            ws.close();
        };
    }, []);

    const handleEnterKey = () => {
        const buffer = inputBuffer.current.trim();
        if (buffer) {
            if (!movesSent.current) {
                wsRef.current.send(JSON.stringify({
                    type: 'moves',
                    data: buffer.split(',').map(m => m.trim()).filter(m => m.length > 0)
                }));
                movesSent.current = true;
                terminalRef.current.writeln('Moves sent! Please enter your move (number) or type "?" for help:');
            } else {
                wsRef.current.send(JSON.stringify({ type: 'move', data: buffer }));
            }
            inputBuffer.current = '';
        }
    };

    const handleBackspace = () => {
        if (inputBuffer.current.length > 0) {
            inputBuffer.current = inputBuffer.current.slice(0, -1);
            terminalRef.current.write('\b \b');
        }
    };

    return <div ref={terminalRef} style={{ width: '100%', height: '500px' }} />;
};

export default GameTerminal;
