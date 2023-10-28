let card_area = document.querySelector(".main_card");

arr.forEach((e) => {
    new_e = e.replace(/\.\w+$/, "");
    card_area.innerHTML += `<div class="cards">
    <div class="cards_left">
    <h3>
    ${new_e}
    </h3>
    </div>
    <div class="cards_right">
    <a href="/player/${new_e}">
    &#9654;
    </a>
    <a href="./audio/${e}" download="${e}">
    &#x23EC;
    </a>
    </div>
    </div>`;
});
