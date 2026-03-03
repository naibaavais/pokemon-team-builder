const input = document.getElementById("pokemonInput");
const findBtn = document.getElementById("findBtn");
const addBtn = document.getElementById("addBtn");

const image = document.getElementById("pokemonImage");
const cry = document.getElementById("pokemonCry");

const moveSelects = [
    document.getElementById("move1"),
    document.getElementById("move2"),
    document.getElementById("move3"),
    document.getElementById("move4")
];

const teamContainer = document.getElementById("teamContainer");

let currentPokemon = null;

// Cache object to minimize API calls
const cache = {};

findBtn.addEventListener("click", async () => {
    const query = input.value.toLowerCase().trim();
    if (!query) return;

    if (cache[query]) {
        loadPokemon(cache[query]);
        return;
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        if (!response.ok) throw new Error("Pokemon not found");

        const data = await response.json();
        cache[query] = data; // save to cache
        loadPokemon(data);

    } catch (error) {
        alert("Pokemon not found!");
    }
});

function loadPokemon(data) {
    currentPokemon = data;

    image.src = data.sprites.front_default;

    // Cry (Gen 5 cry if available)
    if (data.cries && data.cries.latest) {
        cry.src = data.cries.latest;
    } else {
        cry.src = "";
    }

    // Load moves into dropdowns
    const moves = data.moves.map(m => m.move.name);

    moveSelects.forEach(select => {
        select.innerHTML = "";
        moves.forEach(move => {
            const option = document.createElement("option");
            option.value = move;
            option.textContent = move;
            select.appendChild(option);
        });
    });
}

addBtn.addEventListener("click", () => {
    if (!currentPokemon) return;

    const selectedMoves = moveSelects.map(select => select.value);

    const card = document.createElement("div");
    card.classList.add("team-card");

    const img = document.createElement("img");
    img.src = currentPokemon.sprites.front_default;

    const info = document.createElement("div");
    info.innerHTML = `
        <strong>${currentPokemon.name}</strong>
        <ul>
            <li>${selectedMoves[0]}</li>
            <li>${selectedMoves[1]}</li>
            <li>${selectedMoves[2]}</li>
            <li>${selectedMoves[3]}</li>
        </ul>
    `;

    card.appendChild(img);
    card.appendChild(info);

    teamContainer.appendChild(card);
});
