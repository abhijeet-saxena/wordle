// import db from "./db.js";

// const words = Object.keys(db);

// const randomWord = words[Math.floor(Math.random() * words.length)];

// console.log(randomWord);

// console.log("whchw" in db);

document.querySelector(".grid").addEventListener("input", (e) => {
  const {
    data,
    target,
    target: { tagName },
  } = e;
  console.log({ data, target, tagName });
  e.target.nextElementSibling.focus();
});
