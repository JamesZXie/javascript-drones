import styled from "styled-components";
import socket from "../socket";

const CommandGrid = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.05);
    border: 0;
    background: #fe2c70;
    border: 4px solid transparent;
    padding: 20px 40px;
    cursor: pointer;
    color: white;
    font-size: 1rem;
    position: relative;
    &:active {
      top: 2px;
    }
    &:focus {
      outline: 0;
      border-color: #ffc600;
    }
    &.takeoff {
      background: #41c7ff;
    }
    &.land {
      background: #00ff00;
    }
    &.emergency {
      background: orange;
      text-transform: uppercase;
      color: black;
    }
    &.led-on {
      grid-column: span 1;
    }
    &.led-off {
      grid-column: span 1;
    }
  }
  .center {
    display: grid;
    grid-gap: 3px;
    grid-template-columns: 1fr 1fr;
  }
`;

function sendCommand(command) {
  return function() {
    console.log(`Sending the command ${command}`);
    socket.emit("command", command);
  };
}

const Commands = () => {
  return (
    <CommandGrid>
      <div className="center">
        <button className="takeoff" onClick={sendCommand("takeoff")}>
          Take Off
        </button>
        <button className="land" onClick={sendCommand("land")}>
          Land
        </button>
        {/* TODO: send whatever command here */}
        <button className="led-on" onClick={() => socket.emit("led on")}>
          LED ON
        </button>
        <button className="led-off" onClick={() => socket.emit("led off")}>
          LED OFF
        </button>
      </div>
    </CommandGrid>
  );
};

export default Commands;
