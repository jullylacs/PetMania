const cards = Array.from(document.querySelectorAll(".card"));
const cardsContainer = document.querySelector("#cards");

cardsContainer.addEventListener("mousemove", (e) => {
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });
});
