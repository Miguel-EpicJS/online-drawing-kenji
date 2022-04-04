const nameInput = document.getElementById("name");
const logInButton = document.getElementById("log-in-button");

//route to verify name
let wss = new WebSocket(`wss://127.0.0.1:5050`);

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

const logIn = () => {
  if (/\s/g.test(nameInput.value)) {
    setMessage("O nome não pode conter espaços em branco");
  } else if (nameInput.value.length <= 0) {
    setMessage("O nome deve conter pelo menos um caractere");
  } else {
    wss.send(JSON.stringify({ "name": nameInput.value }));
    wss.onmessage((event) => {
      if (event.data.message === "OK") {
        //Ok: player must be redirected to another page if name is unique in the game room
        setMessage("Ok: devemos guardar o nome e mandar o jogador para a página da sala/jogo");
      } else if (event.data.message === "Nome repetido") {
        //repeated name: player must choose another name
        setMessage("O nome já existe na sala. Escolha outro nome");
      } else {
        //other possibility: feedback to player
        setMessage("Ocorreu um problema na aplicação. Tente novamente mais tarde");
      }
    });
  }
};

logInButton.addEventListener("click", logIn);

document.addEventListener("keydonw", (e) => {
  if (e.which === 13) {
    logIn();
  };
});
