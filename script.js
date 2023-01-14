const url = "https://opentdb.com/api.php?amount=10&category=31&encode=base64";
const categoryUrl = "https://opentdb.com/api_category.php";
const btnContainer = document.querySelector(".btn-container");
const catSelectMsg = document.querySelector(".select-category-msg");
const questionContainer = document.querySelector(".question-container");
const submitBtnContainer = document.querySelector(".sumbit-btn-container");
const totalScore = document.querySelector(".total-score");
let resultArray = [];
let categoryId;

async function getCategory() {
  const response = await fetch(categoryUrl);
  const catData = await response.json();
  displayBtns(catData);
}
function displayBtns(catData) {
  catData.trivia_categories.forEach((cat) => {
    const element = document.createElement("btn");
    element.innerHTML = `${cat.name}`;
    element.id = `${cat.id}`;
    element.classList.add("btn");
    btnContainer.appendChild(element);
  });
  setUpOnClickEventForBtns();
  const submitBtn = document.createElement("button");
  submitBtn.classList.add("submit-btn");
  submitBtn.innerHTML = "Submit";
  submitBtnContainer.appendChild(submitBtn);
  setEventOnSubmitBtn(submitBtn);
}
function setUpOnClickEventForBtns() {
  const btns = document.querySelectorAll(".btn");
  btns.forEach((btn) => {
    btn.addEventListener("click", function (btn) {
      btns.forEach(function (btn) {
        btn.classList.remove("btn-selected");
      });
      btn.currentTarget.classList.add("btn-selected");
      categoryId = btn.currentTarget.id;
      catSelectMsg.innerHTML = "";
    });
  });
}
function setEventOnSubmitBtn(submitBtn) {
  submitBtn.addEventListener("click", function (btn) {
    if (categoryId == undefined) {
      catSelectMsg.innerHTML = `please select a category`;
    } else {
      catSelectMsg.innerHTML = "";
      btnContainer.innerHTML = "";
      btn.currentTarget.remove();
      getQuestions(categoryId);
    }
  });
}
async function getQuestions(id) {
  const response = await fetch(
    `https://opentdb.com/api.php?amount=10&category=${id}&type=multiple&encode=base64`
  );
  const questionsData = await response.json();
  displayQuestions(questionsData);
}
function displayQuestions(questionsData) {
  let idValue = 0;
  questionsData.results.forEach(function (question) {
    resultArray.push(atob(question.correct_answer));
    const randomNumber = Math.floor(Math.random() * 3);
    let options = [];
    options.push(atob(question.incorrect_answers[0]));
    options.push(atob(question.incorrect_answers[1]));
    options.push(atob(question.incorrect_answers[2]));
    options.push(atob(question.correct_answer));
    let temp = options[3];
    options[3] = options[randomNumber];
    options[randomNumber] = temp;
    const article = document.createElement("article");
    article.classList.add("question-article");

    article.innerHTML = `<p class="question">${idValue + 1}. ${atob(
      question.question
    )}</p>
        <fieldset>
          <div>
            <input type="radio" id="${options[0]}" name="${idValue}" value="${
      options[0]
    }" />
            <label for="${options[0]}">${options[0]}</label>
          </div>
          <div>
            <input type="radio" id="${options[1]}" name="${idValue}" value="${
      options[1]
    }" />
            <label for="${options[1]}">${options[1]}</label>
          </div>
  
          <div>
            <input type="radio" id="${options[2]}" name="${idValue}" value="${
      options[2]
    }" />
            <label for="${options[2]}">${options[2]}</label>
          </div>
          <div>
            <input type="radio" id="${options[3]}" name="${idValue}" value="${
      options[3]
    }" />
            <label for="${options[3]}">${options[3]}</label>
          </div>
        </fieldset>`;
    idValue++;
    questionContainer.appendChild(article);
  });
  const questionSubmitBtn = document.createElement("button");
  questionSubmitBtn.innerHTML = `Submit`;
  questionSubmitBtn.classList.add("question-submit-btn");
  submitBtnContainer.appendChild(questionSubmitBtn);
  console.log(resultArray);
  questionSubmitBtn.addEventListener("click", calculateTotalScore);
}
function calculateTotalScore() {
  const questionArticles = document.querySelectorAll(".question-article");
  let total = 0;
  let currName = 0;
  questionArticles.forEach(function (question) {
    const optionList = document.getElementsByName(`${currName}`);
    let curr = 0;
    optionList.forEach(function (option) {
      if (option.checked) {
        if (option.value === resultArray[currName]) {
          total++;
        }
      }
      curr++;
    });
    currName++;
  });
  console.log(total);
  totalScore.innerHTML = `Your score is: ${total}/10`;
  questionContainer.innerHTML = "";
  const questionSubmitBtn = document.querySelector(".question-submit-btn");
  questionSubmitBtn.remove();
  const link = document.createElement("a");
  link.href = "";
  link.innerHTML = "Next Quiz";
  link.classList.add("link");
  submitBtnContainer.appendChild(link);
  console.log(questionSubmitBtn);
}
getCategory();
