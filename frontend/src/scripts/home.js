import "../styles/home.css";
import "../assets/sounds/367376__wjoojoo__blip03.wav";
import "../assets/sounds/49070__moca__mocasg-fxs03.mp3";

const nameInput = document.getElementById("name");
const logInButton = document.getElementById("log-in-button");

//route to verify name
const wss = new WebSocket(`wss://localhost:5050`);

const elementsToSound = [nameInput, logInButton];

for (let i in elementsToSound) {
  elementsToSound[i].addEventListener("mouseenter", () => {
    const sound = new Audio("./367376__wjoojoo__blip03.wav");
    sound.play();
  });

  elementsToSound[i].addEventListener("mouseleave", () => {
    const sound = new Audio("./49070__moca__mocasg-fxs03.mp3");
    sound.play();
  });
}

const setMessage = (text) => {
  document.getElementById("message").innerHTML = text;
  setTimeout(() => {
    document.getElementById("message").innerHTML = "";
  }, 1500);
};

const renderedLogin = () => {
  document.getElementById("log-in-box").style.display = "none";
  document.getElementById("principal-container").style.display = "flex";
};

const logIn = () => {
  if (/\s/g.test(nameInput.value)) {
    setMessage("O nome não pode conter espaços em branco");
  } else if (nameInput.value.length <= 0) {
    setMessage("O nome deve conter pelo menos um caractere");
  } else {
    wss.send(JSON.stringify({ name: nameInput.value }));
    wss.onmessage((event) => {
      if (event.data.message === "OK") {
        //Ok: player must be redirected to another page if name is unique in the game room
        console.log(
          "Ok: devemos guardar o nome e mandar o jogador para a página da sala/jogo"
        );
        renderedLogin();
      } else if (event.data.message === "Nome repetido") {
        //repeated name: player must choose another name
        console.log("O nome já existe na sala. Escolha outro nome");
      } else {
        //other possibility: feedback to player
        console.log(
          "Ocorreu um problema na aplicação. Tente novamente mais tarde"
        );
      }
    });
  }
};

logInButton.addEventListener("click", logIn);

document.addEventListener("keydonw", (e) => {
  if (e.key === "Enter") {
    logIn();
  }
});

const errosType = {
  white_space: "O nome não pode conter espaços em branco",
  little: "O nome deve conter pelo menos um caractere",
  OK: "Ok: devemos guardar o nome e mandar o jogador para a página da sala/jogo",
  "Nome repetido": "O nome já existe na sala. Escolha outro nome",
};

export { wss };
