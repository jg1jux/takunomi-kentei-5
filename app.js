const choicesTemplate = [
  "冷蔵庫でしっかり冷やす",
  "香りを確認してから注ぐ",
  "空腹時は避ける",
  "こまめに水を飲む"
];

const questionPool = Array.from({ length: 100 }, (_, i) => {
  const no = i + 1;
  const correctIndex = i % 4;
  return {
    id: no,
    question: `第${no}問: 宅飲みを安全・快適に楽しむコツとして最も適切なのは？`,
    choices: [...choicesTemplate],
    answer: correctIndex,
    explanation: `第${no}問の正解は「${choicesTemplate[correctIndex]}」です。`
  };
});

const asked = new Set();

const meta = document.getElementById("meta");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const resultEl = document.getElementById("result");
const nextBtn = document.getElementById("nextBtn");

function pickRandomQuestion() {
  if (asked.size === questionPool.length) {
    asked.clear();
  }

  let idx;
  do {
    idx = Math.floor(Math.random() * questionPool.length);
  } while (asked.has(idx));

  asked.add(idx);
  return questionPool[idx];
}

function renderQuestion() {
  const q = pickRandomQuestion();
  let locked = false;

  meta.textContent = `問題プール: ${questionPool.length}問 / 出題済み: ${asked.size}問`;
  questionEl.textContent = q.question;
  resultEl.textContent = "";
  choicesEl.innerHTML = "";

  q.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice";
    btn.textContent = choice;
    btn.addEventListener("click", () => {
      if (locked) return;
      locked = true;

      const all = choicesEl.querySelectorAll(".choice");
      all.forEach((el, idx) => {
        if (idx === q.answer) el.classList.add("correct");
      });

      if (i === q.answer) {
        resultEl.textContent = `✅ 正解！ ${q.explanation}`;
      } else {
        btn.classList.add("wrong");
        resultEl.textContent = `❌ 不正解。${q.explanation}`;
      }
    });
    choicesEl.appendChild(btn);
  });
}

nextBtn.addEventListener("click", renderQuestion);
renderQuestion();
