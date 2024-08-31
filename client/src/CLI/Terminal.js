import React, { useRef, useEffect } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const TerminalComponent = ({ onCommand }) => {
  const terminalRef = useRef(null);

  useEffect(() => {
    const terminal = new Terminal();
    terminal.open(terminalRef.current);

    terminal.writeln('Welcome to the Rock-Paper-Scissors CLI!');
    terminal.writeln('Type your move and press Enter.');

    terminal.onData(data => {
      if (data.charCodeAt(0) === 13) { // Enter key
        const command = terminal.buffer.active.getLine(terminal.buffer.active.baseY + terminal.buffer.active.cursorY).translateToString().trim();
        if (command) {
          onCommand(command);
        }
      } else {
        terminal.write(data);
      }
    });

    return () => {
      terminal.dispose();
    };
  }, [onCommand]);

  return <div ref={terminalRef} style={{ height: '100%', width: '100%' }} />;
};

export default TerminalComponent;
