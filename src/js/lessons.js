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

function copyCode() {
  const code = document.getElementById("codeToCopy");
  navigator.clipboard
    .writeText(code.innerText)
    .then(() => {
      const btn = document.querySelector(".copy-button");
      btn.innerHTML = '<i class="fas fa-clipboard-check"></i> Copied!';
      setTimeout(
        () => (btn.innerHTML = '<i class="far fa-clipboard"></i> Copy'),
        2000
      );
    })
    .catch((err) => console.error("Copy failed:", err));
}
