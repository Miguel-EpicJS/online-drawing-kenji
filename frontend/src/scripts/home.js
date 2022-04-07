import "../styles/home.css";

import blipWav from "../assets/sounds/367376__wjoojoo__blip03.wav";
import mocaMp3 from "../assets/sounds/49070__moca__mocasg-fxs03.mp3";
import { websocketURL } from "../../config";

const nameInput = document.getElementById("nickname");
const logInButton = document.getElementById("log-in-button");
const inputMsg = document.getElementById("message");
//route to verify name
const wss = new WebSocket(websocketURL);

const renderedLogin = () => {
  document.getElementById("log-in-box").style.display = "none";
  document.getElementById("principal-container").style.display = "flex";
};

const errosType = {
  white_space: "O nome não pode conter espaços em branco",
  little: "Insira seu nome de usuário",
  repeated_name: "O nome já existe na sala. Escolha outro nome",
  other_error: "Ocorreu um problema na aplicação. Tente novamente mais tarde"
};

//route to verify name
try {
  const elementsToSound = [nameInput, logInButton];

  // for (let i in elementsToSound) {
  //   elementsToSound[i].addEventListener("mouseenter", () => {
  //     const sound = new Audio(blipWav);
  //     sound.play();
  //   });

  //   elementsToSound[i].addEventListener("mouseleave", () => {
  //     const sound = new Audio(mocaMp3);
  //     sound.play();
  //   });
  // }

  const logIn = () => {
    function setMessage(text) {
      inputMsg.innerHTML = text;
      setTimeout(() => {
        inputMsg.innerHTML = "";
      }, 2000);
      console.log(text);
    }
    if (/\s/g.test(nameInput.value)) {
      setMessage(errosType.white_space);
    } else if (nameInput.value.length <= 0) {
      setMessage(errosType.little);
    } else {
      wss.send(
        JSON.stringify({
          name: nameInput.value,
          path: "login",
          channel: "general",
        })
      );
      wss.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // const chatlist = JSON.parse(data.chatList);
        console.log(data);

        console.log(data.chatList);

        if (data.chatList.includes(nameInput.value)) {
          data.ok = false;
          setMessage(errosType.repeated_name);
        }

        if (data.ok) {
          //Ok: player must be redirected to another page if name is unique in the game room
          localStorage.setItem("username", nameInput.value);
          // window.location.href = "index.html";
          renderedLogin();
        } else if (!data.ok) {
          //repeated name: player must choose another name
          console.log(data.msg.text);
        } else {
          //other possibility: feedback to player
          console.log(errosType.other_error);
        }
      };
    }
  };

  logInButton.addEventListener("click", logIn);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      logIn();
    }
  });
} catch (error) {
  console.log(error);
}

export { wss };
