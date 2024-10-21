import { parks } from "./parks.js";


const sortButton = document.getElementById("sort-button");
const countButton = document.getElementById("count-button");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search");
const parksContainer = document.getElementById("parks-list");
const resultMetres = document.querySelector('.result');
const cancelSearch = document.getElementById("cancel-search");
const createPark = document.querySelector('.create-park');
const editPark = document.querySelector('.edit-park');
const editparkForm = document.querySelector('.edit-park-form');
const createparkForm = document.querySelector('.create-park-form');
const addPark = document.querySelector('.add-park')

const itemTemplate = ({ id, address, size, price }) => 
    `<li id="${id}" class="park">
<img
    src="./park.png"
    alt="park">
<div class="park-body">
    <h3 class="park-address">${address}</h3>
    <p class="park-size">Size: ${size} meters</p>
    <p class="park-price">Price: $${price}</p>
</div>
<button class="edit">Edit</button>
</li>`;

let currentParks = [];

const renderItemsList = (items) => {
    parksContainer.innerHTML = "";
    for (const item of items) {
        addItemToPage(item);
    }
    currentParks = items;
};

const addItemToPage = ({ id, address, size, price }) => {
    parksContainer.insertAdjacentHTML(
        "afterbegin",
        itemTemplate({ id, address, size, price })
    );
};

renderItemsList(parks);

searchButton.addEventListener("click", () => {
    const searchValue = searchInput.value.trim().toLowerCase();
    const foundParks = currentParks.filter(park => 
        park.address.toLowerCase().includes(searchValue)
    );

    cancelSearch.addEventListener("click", () => {
        renderItemsList(parks);
    });

    const ClearInputs = () => {
        searchInput.value = "";
    };

    renderItemsList(foundParks);
    ClearInputs();
});

sortButton.addEventListener("click", () => {
    const sortedParks = [...currentParks].sort((a, b) => b.price - a.price);
    renderItemsList(sortedParks);
});

countButton.addEventListener("click", () => {
    const total = currentParks.reduce((sum, {size}) => sum + size, 0);
    resultMetres.textContent = total;
});

let parentId = 0;


const openModal = (modal) => {
    modal.classList.add("show-modal");
};

const closeModal = (modal, form) => {
    modal.classList.remove("show-modal");
    form.reset();
};

parksContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit")) {
        parentId = event.target.closest("li").id;
        openModal(editPark);
    }
});

editPark.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
        closeModal(editPark, editparkForm); 
    }
});

editparkForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newName = editparkForm.querySelector(".park-title").value;
    const newSize = Number(editparkForm.querySelector(".size").value);
    const newPrice = Number(editparkForm.querySelector(".edit-cost").value);
    const park = currentParks.find(park => park.id == parentId);
    park.address = newName;
    park.size = newSize;
    park.price = newPrice;

    closeModal(editPark, editparkForm);
    renderItemsList(currentParks);
});

const newCard = ({ id, name, size, cost }) => {
    currentParks.push({ id, address: name, size, price: cost });
    renderItemsList(currentParks);
};

addPark.addEventListener("click", () => {
    openModal(createPark); 
});

createPark.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
        closeModal(createPark, createparkForm);
    }
});


let nextId = 9;
createparkForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newName = createparkForm.querySelector(".park-title").value;
    const newSize = Number(createparkForm.querySelector(".size").value);
    const newPrice = Number(createparkForm.querySelector(".edit-cost").value);
    newCard({ id: nextId, name: newName, size: newSize, cost: newPrice });
    nextId += 1;
    closeModal(createPark, createparkForm);
});



