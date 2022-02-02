import db from "./db.js";

window.onload = () => {
  const inputs = Array.from(document.querySelectorAll("input"));
  const keyboard = document.querySelector("#keyboard");
  const words = Object.keys(db);
  const randomWord = words[Math.floor(Math.random() * words.length)];
  console.log(randomWord);

  let currentRow = 0;
  let focussedElem = document.querySelector("input");

  document.addEventListener("keyup", ({ key, preventDefault }) => {
    if (
      !/[a-z]/i.test(key) ||
      (key.length > 1 && !["Backspace", "Enter"].includes(key))
    ) {
      return;
    }

    keyHandler(key);
  });

  function keyHandler(key) {
    switch (key) {
      case "Backspace":
        if (
          !focussedElem.value &&
          focussedElem.previousElementSibling &&
          !focussedElem.previousElementSibling.disabled
        ) {
          focussedElem = focussedElem.previousElementSibling;
        }

        focussedElem.value = "";
        focussedElem.classList.remove("filled");
        break;
      case "Enter":
        const enteredLetters = inputs.slice(currentRow, currentRow + 5);
        const guessedWord = enteredLetters.map((i) => i.value).join("");

        if (!guessedWord) return;

        if (!(guessedWord in db)) {
          alert("Wrong Word", guessedWord);
          return;
        }

        for (let i in enteredLetters) {
          setTimeout(setCorrectClass, i * 500, enteredLetters[i], i);
        }

        setTimeout(() => {
          if (randomWord.toLowerCase() === guessedWord.toLowerCase()) {
            alert("You Won");
          } else {
            currentRow += 5;
            disableInputs(currentRow);
          }
        }, 2500);
        break;
      default:
        focussedElem.classList.add("filled");
        focussedElem.value = focussedElem.value || key;
        if (!focussedElem.nextElementSibling?.disabled) {
          focussedElem = focussedElem.nextElementSibling;
        }
    }
  }

  function disableInputs(enabled) {
    inputs.forEach((i, index) => {
      i.disabled = index < enabled || index > enabled + 4 ? true : false;
    });

    focussedElem = inputs[enabled];
  }

  function setCorrectClass(elem, i) {
    const keyboardButton = document.querySelector(`[data-val="${elem.value}"]`);

    if (randomWord[i] === elem.value.toLowerCase()) {
      elem.classList = "correct";
      keyboardButton.classList = "correct";
    } else if (randomWord.includes(elem.value.toLowerCase())) {
      elem.classList = "maybe";
      keyboardButton.classList = "maybe";
    } else {
      elem.classList = "wrong";
      keyboardButton.classList = "wrong";
    }
  }

  disableInputs(currentRow);

  keyboard.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") keyHandler(e.target.dataset.val);
  });
};
