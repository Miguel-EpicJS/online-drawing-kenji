import "../styles/home.css";

import blipWav from "../assets/sounds/367376__wjoojoo__blip03.wav";
import mocaMp3 from "../assets/sounds/49070__moca__mocasg-fxs03.mp3";

const nameInput = document.getElementById("nickname");
const logInButton = document.getElementById("log-in-button");

//route to verify name
let wss = new WebSocket(`wss://127.0.0.1:5050`);

const elementsToSound = [nameInput, logInButton];

for (let i in elementsToSound) {
    elementsToSound[i].addEventListener("mouseenter", () => {
        const sound = new Audio(blipWav);
        sound.play();
    });

    elementsToSound[i].addEventListener("mouseleave", () => {
        const sound = new Audio(mocaMp3);
        sound.play();
    });
}
/* 
const setMessage = (text) => {
    document.getElementById("message").innerHTML = text;
    setTimeout(() => {
        document.getElementById("message").innerHTML = "";
    }, 1500);
    console.log(text);
}; */

const logIn = () => {
    if (/\s/g.test(nameInput.value)) {
        setMessage("O nome não pode conter espaços em branco");
    } else if (nameInput.value.length <= 0) {
        setMessage("O nome deve conter pelo menos um caractere");
    } else {
        wss.send(JSON.stringify({ name: nameInput.value, path: "login" }));
        wss.onmessage = (event) => {

            const data = JSON.parse( event.data );

            if (data.ok) {
                //Ok: player must be redirected to another page if name is unique in the game room
                localStorage.setItem("username", nameInput.value);
                window.location.href = "index.html";
            } else if (!data.ok) {
                //repeated name: player must choose another name
                console.log(data.msg.text);
            } else {
                //other possibility: feedback to player
                console.log("Ocorreu um problema na aplicação. Tente novamente mais tarde");
            }
        };
    }
};

logInButton.addEventListener("click", logIn);

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        logIn();
    };
});
