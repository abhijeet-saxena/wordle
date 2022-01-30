import db from "./db.js";
const words = Object.keys(db);
const randomWord = words[Math.floor(Math.random() * words.length)];
console.log(randomWord);

let currentRow = 0;
let focussedElem = document.querySelector("input");

document.addEventListener("keyup", (e) => {
  const { key } = e;

  if (
    !/[a-z]/i.test(key) ||
    (key.length > 1 && !["Backspace", "Enter"].includes(key))
  ) {
    e.preventDefault();
    return;
  }

  if (key === "Backspace") {
    if (
      !focussedElem.value &&
      focussedElem.previousElementSibling &&
      !focussedElem.previousElementSibling.disabled
    ) {
      focussedElem = focussedElem.previousElementSibling;
    }

    focussedElem.value = "";
    focussedElem.classList.remove("filled");
  } else if (key === "Enter") {
    const inputs = Array.from(document.querySelectorAll("input")).slice(
      currentRow,
      currentRow + 5
    );
    const guessedWord = inputs.map((i) => i.value).join("");

    if (!(guessedWord in db)) {
      alert("Wrong Word", guessedWord);
      return;
    }

    for (let i in inputs) {
      setTimeout(setCorrectClass, i * 250, inputs[i], i);
    }

    setTimeout(() => {
      if (randomWord.toLowerCase() === guessedWord.toLowerCase()) {
        alert("You W0n");
      } else {
        currentRow += 5;
        disableInputs(currentRow);
      }
    }, 1500);
  } else {
    focussedElem.classList.add("filled");
    focussedElem.value = focussedElem.value || e.key;
    if (!focussedElem.nextElementSibling?.disabled) {
      focussedElem = focussedElem.nextElementSibling;
    }
  }
});

function disableInputs(enabled) {
  const inputs = document.querySelectorAll("input");

  inputs.forEach((i, index) => {
    i.disabled = index < enabled || index > enabled + 4 ? true : false;
  });

  focussedElem = document.querySelectorAll("input")[enabled];
}

function setCorrectClass(elem, i) {
  if (randomWord[i].toLowerCase() === elem.value.toLowerCase()) {
    elem.classList.add("correct");
  } else if (randomWord.includes(elem.value.toLowerCase())) {
    elem.classList.add("maybe");
  } else {
    elem.classList.add("wrong");
  }
}

disableInputs(currentRow);

document.querySelector("#keyboard").addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  document.dispatchEvent(
    new KeyboardEvent("keyup", {
      key: e.target.dataset.val,
    })
  );
});