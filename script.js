const questions = [
  {
    q: "宅飲みの基本として、最初に確認すると良いことはどれ？",
    c: ["飲み物と食べ物の量", "照明の色", "テレビのチャンネル", "ソファの向き"],
    a: 0,
  },
  { q: "飲み物を注ぐ前に行うと衛生的なのは？", c: ["グラスを軽くすすぐ", "氷を先に全部入れる", "テーブルを叩く", "室温を下げる"], a: 0 },
  { q: "宅飲みでの水分補給として適切なのは？", c: ["アルコール以外の水を用意する", "氷だけ食べる", "味の濃い料理だけにする", "飲み切るまで席を立たない"], a: 0 },
  { q: "おつまみの組み合わせで比較的バランスが良いのは？", c: ["枝豆と焼き魚", "スナック菓子だけ", "甘い物だけ", "揚げ物だけ"], a: 0 },
  { q: "宅飲み後の片付けで最初に行うと楽なのは？", c: ["食器を水につける", "照明を消す", "BGMを変える", "写真を整理する"], a: 0 },
  { q: "飲みすぎ防止で有効なのは？", c: ["自分のペースを決める", "早飲みを競う", "空腹で飲み続ける", "休憩を取らない"], a: 0 },
  { q: "宅飲みに招く相手への配慮として適切なのは？", c: ["苦手な食材を事前確認する", "当日までメニューを秘密にする", "全員に同じ量を強制する", "飲めない人を誘わない"], a: 0 },
  { q: "氷を使う目的として適切なのは？", c: ["飲み物の温度調整", "味を完全に消す", "色を濃くする", "香りをなくす"], a: 0 },
  { q: "宅飲みの雰囲気づくりとして無理のないものは？", c: ["会話しやすい音量の音楽", "大音量で常に盛り上げる", "照明を真っ暗にする", "席替えを10分ごとに行う"], a: 0 },
  { q: "終了時のマナーとして望ましいのは？", c: ["感謝を伝えて解散する", "片付けを放置する", "帰る直前に大量注文する", "連絡なしで延長する"], a: 0 },
];

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const certificateScreen = document.getElementById("certificate-screen");
const candidateNameInput = document.getElementById("candidate-name");
const startBtn = document.getElementById("start-btn");
const retryBtn = document.getElementById("retry-btn");
const newExamBtn = document.getElementById("new-exam-btn");
const printBtn = document.getElementById("print-btn");
const startError = document.getElementById("start-error");
const progressEl = document.getElementById("progress");
const scorePreviewEl = document.getElementById("score-preview");
const questionText = document.getElementById("question-text");
const choicesEl = document.getElementById("choices");
const resultName = document.getElementById("result-name");
const resultScore = document.getElementById("result-score");
const resultStatus = document.getElementById("result-status");
const certName = document.getElementById("certificate-name");
const certNumber = document.getElementById("certificate-number");
const certDate = document.getElementById("certificate-date");

let state = {
  name: "",
  index: 0,
  correct: 0,
};

function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function resetExam(name) {
  state = { name, index: 0, correct: 0 };
}

function startExam() {
  const name = candidateNameInput.value.trim();
  if (!name) {
    startError.textContent = "受験者名を入力してください。";
    return;
  }
  startError.textContent = "";
  resetExam(name);
  hide(startScreen);
  hide(resultScreen);
  hide(certificateScreen);
  show(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  const current = questions[state.index];
  progressEl.textContent = `第${state.index + 1}問 / 全${questions.length}問`;
  scorePreviewEl.textContent = `現在の正解数: ${state.correct}`;
  questionText.textContent = current.q;
  choicesEl.innerHTML = "";

  current.c.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.className = "btn choice-btn";
    btn.textContent = `${i + 1}. ${choice}`;
    btn.addEventListener("click", () => answerQuestion(i));
    choicesEl.appendChild(btn);
  });
}

function answerQuestion(selected) {
  if (selected === questions[state.index].a) {
    state.correct += 1;
  }

  state.index += 1;
  if (state.index < questions.length) {
    renderQuestion();
  } else {
    showResult();
  }
}

function formatDateJP(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}年${m}月${d}日`;
}

function createCertificateNumber() {
  const head = "TK5";
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const day = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `${head}-${day}-${rand}`;
}

function showResult() {
  hide(quizScreen);
  show(resultScreen);

  resultName.textContent = `受験者: ${state.name}`;
  resultScore.textContent = `${state.correct} / ${questions.length} 問 正解`;

  const passed = state.correct >= 8;
  resultStatus.textContent = passed ? "合格（宅飲み検定5級）" : "不合格（再受験できます）";
  resultStatus.className = `result-status ${passed ? "pass" : "fail"}`;

  if (passed) {
    hide(retryBtn);
    certName.textContent = `${state.name} 殿`;
    certNumber.textContent = `認定番号: ${createCertificateNumber()}`;
    certDate.textContent = `発行日: ${formatDateJP()}`;
    show(certificateScreen);
  } else {
    show(retryBtn);
    hide(certificateScreen);
  }
}

function resetToStart() {
  hide(quizScreen);
  hide(resultScreen);
  hide(certificateScreen);
  show(startScreen);
}

startBtn.addEventListener("click", startExam);
retryBtn.addEventListener("click", () => {
  resetExam(state.name);
  hide(resultScreen);
  show(quizScreen);
  renderQuestion();
});
newExamBtn.addEventListener("click", resetToStart);
printBtn.addEventListener("click", () => window.print());
candidateNameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startExam();
});
