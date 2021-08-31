// Animate text
let text = document.querySelector(".text");
let textCont = text.textContent;
text.textContent = "";
let pointer = document.querySelector(".pointer");


for (let i = 0; i < textCont.length; i++) {
    setTimeout(() => {
        text.textContent += textCont[i];
    }, 75 * i);
}
setInterval(() => {
    if (pointer.style.opacity === "1") {
        pointer.style.opacity = "0";
    } else {
        pointer.style.opacity = "1";
    }
}, 300);
//END animate