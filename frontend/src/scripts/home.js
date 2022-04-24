import "../styles/home.css";
import { websocketURL } from "../../config";

export const nameInput = document.getElementById("nickname");
const logInButton = document.getElementById("log-in-button");
const inputMsg = document.getElementById("message");
const wss = new WebSocket(websocketURL);

export const renderedLogin = () => {
  document.getElementById("log-in-box").style.display = "none";
  document.getElementById("principal-container").style.display = "flex";
};

const errosType = {
  white_space: "O nome não pode conter espaços em branco",
  little: "Insira seu nome de usuário",
  repeated_name: "O nome já existe na sala. Escolha outro nome",
  other_error: "Ocorreu um problema na aplicação. Tente novamente mais tarde",
};

try {
  const logIn = () => {
    function setMessage(text) {
      inputMsg.innerHTML = text;
      setTimeout(() => {
        inputMsg.innerHTML = "";
      }, 2000);
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
    }
  };

  logInButton.addEventListener("click", logIn);
} catch (error) {
  console.error(error);
}

export { wss };
