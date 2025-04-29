document.addEventListener("DOMContentLoaded", () => {
  const e = document.querySelector(".second-link"),
    t = e.getAttribute("data-test"),
    n = btoa(t);
  e.href = `../../test.html?test=${n}`;
});

window.onscroll = () =>
  (document.getElementById("scrollToTopBtn").style.display =
    document.body.scrollTop > 300 || document.documentElement.scrollTop > 300
      ? "flex"
      : "none");
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

function copyCode(event) {
  const button = event.target;
  const code = button.closest(".code-container").querySelector("pre");

  navigator.clipboard
    .writeText(code.innerText)
    .then(() => {
      button.innerHTML = '<i class="fas fa-clipboard-check"></i> Copied!';
      setTimeout(
        () => (button.innerHTML = '<i class="far fa-clipboard"></i> Copy'),
        2000
      );
    })
    .catch((err) => console.error("Copy failed:", err));
}

document.addEventListener("DOMContentLoaded", () => {
  const copyButtons = document.querySelectorAll(".copy-button");

  copyButtons.forEach((button) => {
    button.addEventListener("click", copyCode);
  });
});
