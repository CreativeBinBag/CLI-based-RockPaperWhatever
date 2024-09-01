const GameTerminal = () => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
      const connectWebSocket = () => {
          const websocket = new WebSocket('wss://cli-based-rockpaperwhateverbackend-cmow.onrender.com');

          websocket.onopen = () => {
              console.log('WebSocket connection opened');
          };

          websocket.onmessage = (event) => {
              console.log('Message received from server:', event.data);
              terminal.writeln(event.data);
          };

          websocket.onerror = (error) => {
              console.error('WebSocket error:', error);
              // Handle reconnection logic if needed
          };

          websocket.onclose = (event) => {
              console.log('WebSocket connection closed:', event.reason);
              // Try reconnecting after a delay
              setTimeout(connectWebSocket, 5000);
          };

          setWs(websocket);
      };

      connectWebSocket();

      const terminal = new Terminal();
      terminal.open(document.getElementById('terminal'));

      let inputBuffer = '';

      terminal.onData(data => {
          if (data.charCodeAt(0) === 13) { // Enter key
              if (inputBuffer.trim()) {
                  console.log('Sending data to server:', inputBuffer.trim());
                  ws.send(inputBuffer.trim());
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
          console.log('Cleaning up WebSocket connection');
          if (ws) {
              ws.close();
          }
      };
  }, [ws]);

  return <div id="terminal" style={{ width: '100%', height: '500px' }} />;
};


export default GameTerminal;