document.addEventListener("DOMContentLoaded", () => {
  const gameCard = document.getElementById("game-card");
  const quizContainer = document.getElementById("quiz-text");
  const optionsContainer = document.getElementById("options");

  let lessons = [];
  let currentIndex = 0;
  let mistakeCount = 0;
  let totalScore = 0;
  let isProcessing = false;
  let timer;
  let timeLeft = 15;

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  async function loadLessons() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const encodedValue = urlParams.get("test");
      const test = atob(encodedValue);
      const response = await fetch(`./src/json/${test}.json`);
      lessons = await response.json();
      resetGame();
      gameCard.classList.remove("d-none");
      loadQuestion();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  loadLessons();

  function loadQuestion() {
    if (currentIndex >= lessons.length) {
      showResult(
        "🎉 Excellent result!",
        `All questions completed! Total score: ${totalScore}`,
        "success",
        resetGame
      );
      return;
    }

    const currentLesson = lessons[currentIndex];
    const quizText = `${currentIndex + 1}) ${capitalize(
      escapeHTML(currentLesson.question)
    )}`;

    quizContainer.innerHTML = quizText;
    updateTimerDisplay();
    generateOptions(currentLesson);
    startTimer();
  }

  function generateOptions(currentLesson) {
    let options = [
      currentLesson["option-1"],
      currentLesson["option-2"],
      currentLesson["option-3"],
      currentLesson["option-4"],
    ];

    options = shuffle(options);

    optionsContainer.innerHTML = options
      .map(
        (option) =>
          `<button class="btn btn-outline-primary" onclick="checkAnswer(\`${escapeHTML(
            option
          )}\`, \`${escapeHTML(currentLesson["option-1"])}\`)">${escapeHTML(
            option
          )}</button>`
      )
      .join("");
  }

  window.checkAnswer = function (selected, correctAnswer) {
    if (isProcessing) return;
    isProcessing = true;

    if (selected === correctAnswer) {
      totalScore += 10;
      clearInterval(timer);
      showResult("Correct!", `Score: ${totalScore}`, "success", () => {
        currentIndex++;
        timeLeft = 15;
        isProcessing = false;
        loadQuestion();
      });
    } else {
      mistakeCount++;
      if (mistakeCount >= 3) {
        clearInterval(timer);
        Swal.fire({
          title: "Too many mistakes!",
          text: "Do you want to restart the game?",
          icon: "warning",
          confirmButtonText: "OK, restart!",
          showCancelButton: false,
          backdrop: false,
          position: "top",
        }).then(() => {
          resetGame();
        });
      } else {
        showResult("Incorrect!", "", "error", () => {
          isProcessing = false;
        });
      }
    }
  };

  function resetGame() {
    clearInterval(timer);
    currentIndex = mistakeCount = 0;
    totalScore = 0;
    timeLeft = 15;
    isProcessing = false;
    loadQuestion();
  }

  function showResult(title, text, icon, callback) {
    Swal.fire({
      title,
      text,
      icon,
      timer: 1000,
      showConfirmButton: icon !== "success",
      position: "top",
      backdrop: false,
    }).then(callback);
  }

  function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function shuffle(array) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function startTimer() {
    clearInterval(timer);
    timeLeft = 15;
    updateTimerDisplay();

    timer = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();

      if (timeLeft <= 0) {
        clearInterval(timer);
        showResult("⏳ Time's up!", "Loading next question...", "info", () => {
          currentIndex++;
          loadQuestion();
        });
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const totalQuestions = lessons.length;
    const livesLeft = "❤️".repeat(3 - mistakeCount) + "🖤".repeat(mistakeCount);

    document.getElementById("status-bar").innerHTML =
      `⏰ Time: ${minutes}:${seconds.toString().padStart(2, "0")} | ` +
      `📘 Question ${currentIndex + 1}/${totalQuestions} | ` +
      `⭐ Score: ${totalScore} | ` +
      `<span id="lives">${livesLeft}</span>`;
  }
});
