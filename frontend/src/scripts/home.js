const nameInput = document.getElementById("name");
const logInButton = document.getElementById("log-in-button");

//route to verify name
const urlRoute = "";

const elementsToSound = [nameInput, logInButton];

for (let i in elementsToSound) {
  elementsToSound[i].addEventListener("mouseenter", () => {
    const sound = new Audio("../assets/sounds/367376__wjoojoo__blip03.wav");
    sound.play();
  });

  elementsToSound[i].addEventListener("mouseleave", () => {
    const sound = new Audio("../assets/sounds/49070__moca__mocasg-fxs03.mp3");
    sound.play();
  });
}

const logIn = () => {
  if (/\s/g.test(nameInput.value)) {
    document.getElementById("message").innerHTML =
      "O nome não pode conter espaços em branco";
    setTimeout(() => {
      document.getElementById("message").innerHTML = "";
    }, 1500);
  } else if (nameInput.value.length <= 0) {
    document.getElementById("message").innerHTML =
      "O nome deve conter pelo menos um caractere";
    setTimeout(() => {
      document.getElementById("message").innerHTML = "";
    }, 1500);
  } else {
    let wss = new WebSocket(`wss://${urlRoute}`);
    wss.open();
    wss.send(JSON.stringify({ "name": nameInput.value }));
    wss.onmessage((event) => {
      if (event.data.message === "OK") {
        //Ok: player must be redirected to another page if name is unique in the game room
        document.getElementById("message").innerHTML =
          "Ok: devemos guardar o nome e mandar o jogador para a página da sala/jogo";
        setTimeout(() => {
          document.getElementById("message").innerHTML = "";
        }, 2000);
      } else if (event.data.message === "Nome repetido") {
        //repeated name: player must choose another name
        document.getElementById("message").innerHTML =
          "O nome já existe na sala. Escolha outro nome";
        setTimeout(() => {
          document.getElementById("message").innerHTML = "";
        }, 2000);
      } else {
        //other possibility: feedback to player
        document.getElementById("message").innerHTML =
          "Ocorreu um problema na aplicação. Tente novamente mais tarde";
        setTimeout(() => {
          document.getElementById("message").innerHTML = "";
        }, 2000);
      }
    });
    wss.close();
  }
};

logInButton.addEventListener("click", logIn);
