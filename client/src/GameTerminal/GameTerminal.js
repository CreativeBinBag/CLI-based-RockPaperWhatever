import React, { useEffect } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const GameTerminal = () => {
    useEffect(() => {
        const ws = new WebSocket('wss://cli-based-rockpaperwhateverbackend-fzp2.onrender.com');
        const terminal = new Terminal();
        terminal.open(document.getElementById('terminal'));

        // Handle data from WebSocket (game process)
        ws.onmessage = (event) => {
            terminal.writeln(event.data);
        };

        // Send user input to WebSocket (game process)
        terminal.onData(data => {
            ws.send(data);
        });

        return () => {
            ws.close();
        };
    }, []);

    return <div id="terminal" style={{ width: '100%', height: '500px' }} />;
};

export default GameTerminal;
