const theoryTopicsData = [
  {
    id: "kinematics",
    title: "Кинематика",
    pdf: "pdfs/kinematics.pdf",
    questions: [
      {
        text: "С какой скоростью тело пройдет 10 м за 2 с?",
        options: ["2 м/с", "3 м/с", "5 м/с", "8 м/с"],
        answerIndex: 2,
      },
      {
        text: "Чему равен путь при ускорении 2 м/с² за 3 с, если v0 = 0?",
        options: ["3 м", "6 м", "9 м", "12 м"],
        answerIndex: 2,
      },
    ],
  },
  {
    id: "electrostatics",
    title: "Электростатика",
    pdf: "pdfs/electrostatics.pdf",
    questions: [
      {
        text: "Единица измерения напряженности поля?",
        options: ["Н/Кл", "Кл", "В", "Н"],
        answerIndex: 0,
      },
      {
        text: "Как направлены линии поля точечного положительного заряда?",
        options: ["К центру", "От центра", "По окружности", "Нет направления"],
        answerIndex: 1,
      },
    ],
  },
];

const practiceSectionsData = [
  {
    title: "Механика",
    subsections: [
      {
        title: "Динамика",
        tasks: [
          {
            text: "Найдите силу при массе 2 кг и ускорении 3 м/с².",
            answer: 6,
            hint: "Используйте второй закон Ньютона.",
          },
          {
            text: "Масса тела 4 кг. Ускорение 1,5 м/с². Найдите силу.",
            answer: 6,
            hint: "F = m · a.",
          },
        ],
      },
    ],
  },
  {
    title: "Термодинамика и МКТ",
    subsections: [
      {
        title: "Газовые законы",
        tasks: [
          {
            text: "Найдите давление, если сила 20 Н действует на площадь 4 м².",
            answer: 5,
            hint: "p = F / S.",
          },
        ],
      },
    ],
  },
  {
    title: "Электромагнетизм",
    subsections: [
      {
        title: "Магнитное поле",
        tasks: [
          {
            text: "Сила тока 2 А, сопротивление 5 Ом. Найдите напряжение.",
            answer: 10,
            hint: "Используйте закон Ома.",
          },
        ],
      },
    ],
  },
  {
    title: "Оптика",
    subsections: [
      {
        title: "Линзы",
        tasks: [
          {
            text: "Фокусное расстояние 20 см. Найдите оптическую силу (дптр).",
            answer: 5,
            hint: "D = 1/f (f в метрах).",
          },
        ],
      },
    ],
  },
  {
    title: "Квантовая физика",
    subsections: [
      {
        title: "Фотоэффект",
        tasks: [
          {
            text: "Частота 5·10^14 Гц. Найдите период (с).",
            answer: 2e-15,
            hint: "T = 1/ν.",
          },
        ],
      },
    ],
  },
  {
    title: "Ядерная физика",
    subsections: [
      {
        title: "Радиоактивность",
        tasks: [
          {
            text: "Период полураспада 10 с. Сколько пройдет за 30 с?",
            answer: 3,
            hint: "Количество периодов = t / T1/2.",
          },
        ],
      },
    ],
  },
];

const state = {
  mode: null,
  theoryTopic: null,
  theoryAnswers: [],
  practiceSection: null,
  practiceSubsection: null,
  practiceTaskIndex: 0,
  practiceStats: [],
  hintUsed: false,
};

const modeSelection = document.getElementById("modeSelection");
const theorySection = document.getElementById("theorySection");
const practiceSection = document.getElementById("practiceSection");
const theoryTopics = document.getElementById("theoryTopics");
const theoryDetails = document.getElementById("theoryDetails");
const theoryPdf = document.getElementById("theoryPdf");
const startQuiz = document.getElementById("startQuiz");
const quizContainer = document.getElementById("quizContainer");
const theorySummary = document.getElementById("theorySummary");
const practiceSectionsNode = document.getElementById("practiceSections");
const practiceSubsectionsNode = document.getElementById("practiceSubsections");
const practiceTaskPanel = document.getElementById("practiceTaskPanel");
const practiceTask = document.getElementById("practiceTask");
const practiceAnswer = document.getElementById("practiceAnswer");
const submitPractice = document.getElementById("submitPractice");
const showHint = document.getElementById("showHint");
const skipTask = document.getElementById("skipTask");
const practiceFeedback = document.getElementById("practiceFeedback");
const reportSection = document.getElementById("reportSection");
const sendReport = document.getElementById("sendReport");
const reportPreview = document.getElementById("reportPreview");
const userBadge = document.getElementById("userBadge");

const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
if (telegramUser) {
  userBadge.textContent = `${telegramUser.first_name || ""} ${telegramUser.last_name || ""}`.trim();
}

modeSelection.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  setMode(button.dataset.mode);
});

function setMode(mode) {
  state.mode = mode;
  theorySection.classList.toggle("hidden", mode !== "theory");
  practiceSection.classList.toggle("hidden", mode !== "practice");
  reportSection.classList.add("hidden");
  if (mode === "theory") {
    renderTheoryTopics();
  }
  if (mode === "practice") {
    renderPracticeSections();
  }
}

function renderTheoryTopics() {
  theoryTopics.innerHTML = "";
  theoryTopics.classList.remove("hidden");
  theoryDetails.classList.add("hidden");
  theorySummary.textContent = "";
  state.theoryTopic = null;
  state.theoryAnswers = [];

  theoryTopicsData.forEach((topic) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = topic.title;
    chip.addEventListener("click", () => selectTheoryTopic(topic, chip));
    theoryTopics.appendChild(chip);
  });
}

function selectTheoryTopic(topic, chip) {
  state.theoryTopic = topic;
  Array.from(theoryTopics.children).forEach((child) => child.classList.remove("active"));
  chip.classList.add("active");
  theoryDetails.classList.remove("hidden");
  theoryPdf.href = topic.pdf;
  quizContainer.classList.add("hidden");
  quizContainer.innerHTML = "";
  theorySummary.textContent = "";
}

startQuiz.addEventListener("click", () => {
  if (!state.theoryTopic) return;
  state.theoryAnswers = [];
  quizContainer.innerHTML = "";
  quizContainer.classList.remove("hidden");
  state.theoryTopic.questions.forEach((question, index) => {
    const block = document.createElement("div");
    block.className = "question";
    block.innerHTML = `<h3>${index + 1}. ${question.text}</h3>`;

    const options = document.createElement("div");
    options.className = "options";
    question.options.forEach((option, optionIndex) => {
      const optionButton = document.createElement("button");
      optionButton.className = "option";
      optionButton.textContent = option;
      optionButton.addEventListener("click", () => handleTheoryAnswer(index, optionIndex, optionButton));
      options.appendChild(optionButton);
    });
    block.appendChild(options);
    quizContainer.appendChild(block);
  });
});

function handleTheoryAnswer(questionIndex, optionIndex, optionButton) {
  if (state.theoryAnswers[questionIndex] !== undefined) return;

  const question = state.theoryTopic.questions[questionIndex];
  const isCorrect = optionIndex === question.answerIndex;
  state.theoryAnswers[questionIndex] = isCorrect;

  const options = optionButton.closest(".options");
  Array.from(options.children).forEach((child, idx) => {
    child.disabled = true;
    if (idx === question.answerIndex) {
      child.classList.add("correct");
    }
    if (idx === optionIndex && !isCorrect) {
      child.classList.add("incorrect");
    }
  });

  if (state.theoryAnswers.filter((answer) => answer !== undefined).length === state.theoryTopic.questions.length) {
    const correct = state.theoryAnswers.filter(Boolean).length;
    theorySummary.textContent = `Результат: ${correct}/${state.theoryTopic.questions.length} правильных.`;
    showReport(buildTheoryReport());
  }
}

function renderPracticeSections() {
  practiceSectionsNode.innerHTML = "";
  practiceSubsectionsNode.innerHTML = "";
  practiceSubsectionsNode.classList.add("hidden");
  practiceTaskPanel.classList.add("hidden");
  practiceFeedback.textContent = "";
  state.practiceSection = null;
  state.practiceSubsection = null;
  state.practiceTaskIndex = 0;
  state.practiceStats = [];

  practiceSectionsData.forEach((section) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = section.title;
    chip.addEventListener("click", () => selectPracticeSection(section, chip));
    practiceSectionsNode.appendChild(chip);
  });
}

function selectPracticeSection(section, chip) {
  state.practiceSection = section;
  Array.from(practiceSectionsNode.children).forEach((child) => child.classList.remove("active"));
  chip.classList.add("active");
  renderPracticeSubsections(section);
}

function renderPracticeSubsections(section) {
  practiceSubsectionsNode.innerHTML = "";
  practiceSubsectionsNode.classList.remove("hidden");
  state.practiceSubsection = null;
  practiceTaskPanel.classList.add("hidden");

  section.subsections.forEach((subsection) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = subsection.title;
    chip.addEventListener("click", () => selectPracticeSubsection(subsection, chip));
    practiceSubsectionsNode.appendChild(chip);
  });
}

function selectPracticeSubsection(subsection, chip) {
  state.practiceSubsection = subsection;
  Array.from(practiceSubsectionsNode.children).forEach((child) => child.classList.remove("active"));
  chip.classList.add("active");
  state.practiceTaskIndex = 0;
  state.practiceStats = [];
  practiceFeedback.textContent = "";
  renderPracticeTask();
}

function renderPracticeTask() {
  const task = state.practiceSubsection?.tasks[state.practiceTaskIndex];
  if (!task) {
    practiceTaskPanel.classList.add("hidden");
    const statsSummary = buildPracticeReport();
    practiceFeedback.textContent = "Задания завершены. Результаты доступны в отчете.";
    showReport(statsSummary);
    return;
  }

  practiceTaskPanel.classList.remove("hidden");
  practiceTask.textContent = `${state.practiceTaskIndex + 1}. ${task.text}`;
  practiceAnswer.value = "";
  state.hintUsed = false;
}

submitPractice.addEventListener("click", () => {
  const task = state.practiceSubsection?.tasks[state.practiceTaskIndex];
  if (!task) return;

  const value = Number.parseFloat(practiceAnswer.value.replace(",", "."));
  if (Number.isNaN(value)) {
    practiceFeedback.textContent = "Введите числовой ответ.";
    return;
  }

  const isCorrect = Math.abs(value - task.answer) < 1e-9;
  state.practiceStats.push({
    task: task.text,
    answer: value,
    correct: isCorrect,
    hintUsed: state.hintUsed,
    skipped: false,
  });
  practiceFeedback.textContent = isCorrect ? "Верно!" : `Неверно. Верный ответ: ${task.answer}`;
  state.practiceTaskIndex += 1;
  setTimeout(renderPracticeTask, 600);
});

showHint.addEventListener("click", () => {
  const task = state.practiceSubsection?.tasks[state.practiceTaskIndex];
  if (!task) return;
  state.hintUsed = true;
  practiceFeedback.textContent = `Подсказка: ${task.hint}`;
});

skipTask.addEventListener("click", () => {
  const task = state.practiceSubsection?.tasks[state.practiceTaskIndex];
  if (!task) return;
  state.practiceStats.push({
    task: task.text,
    answer: null,
    correct: false,
    hintUsed: state.hintUsed,
    skipped: true,
  });
  practiceFeedback.textContent = "Задание пропущено.";
  state.practiceTaskIndex += 1;
  renderPracticeTask();
});

sendReport.addEventListener("click", () => {
  const reportText = reportPreview.textContent.trim();
  if (!reportText) return;

  if (window.Telegram?.WebApp?.sendData) {
    window.Telegram.WebApp.sendData(reportText);
  }
});

function buildTheoryReport() {
  const correct = state.theoryAnswers.filter(Boolean).length;
  return formatReport({
    mode: "Теория",
    topic: state.theoryTopic.title,
    stats: `Правильных ответов: ${correct}/${state.theoryTopic.questions.length}`,
  });
}

function buildPracticeReport() {
  const correct = state.practiceStats.filter((item) => item.correct).length;
  const skipped = state.practiceStats.filter((item) => item.skipped).length;
  return formatReport({
    mode: "Практика",
    topic: `${state.practiceSection.title} → ${state.practiceSubsection.title}`,
    stats: `Верно: ${correct}, пропущено: ${skipped}, всего: ${state.practiceStats.length}`,
  });
}

function formatReport({ mode, topic, stats }) {
  const userLabel = telegramUser
    ? `${telegramUser.first_name || ""} ${telegramUser.last_name || ""}`.trim()
    : "Гость";

  return [
    "Отчет ученика",
    `Имя: ${userLabel}`,
    `Режим: ${mode}`,
    `Тема: ${topic}`,
    `Статистика: ${stats}`,
  ].join("\n");
}

function showReport(reportText) {
  reportSection.classList.remove("hidden");
  reportPreview.textContent = reportText;
}
