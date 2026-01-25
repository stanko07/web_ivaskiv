import { getAllParks, postPark, updatePark, deletePark } from "./api.js";

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
const addPark = document.querySelector('.add-park');
let searchValue = "";  
let currentParks = [];
let allParks = [];  

const itemTemplate = ({ id, address, size, price }) => 
    `<li id="${id}" class="park">
        <img src="./park.png" alt="park">
        <div class="park-body">
            <h3 class="park-address">${address}</h3>
            <p class="park-size">Size: ${size} meters</p>
            <p class="park-price">Price: $${price}</p>
        </div>
        <button class="edit">Edit</button>
        <button class="delete">delete</button>
    </li>`;

const renderItemsList = (items) => {
    parksContainer.innerHTML = ""; 
    items.forEach(item => addItemToPage(item)); 
};

const addItemToPage = ({ id, address, size, price }) => {
    parksContainer.insertAdjacentHTML(
        "beforeend",  
        itemTemplate({ id, address, size, price })
    );
};

const refrechAllParks = async () => {
    allParks = await getAllParks(); 
    currentParks = [...allParks]; 
    renderItemsList(currentParks); 
};

refrechAllParks(); 

searchButton.addEventListener("click", async () => {
    searchValue = searchInput.value.trim().toLowerCase();

    if (searchValue) {
        const Foundparks = await getAllParks(searchValue);  
        currentParks = Foundparks;  
        renderItemsList(currentParks); 
    }

    searchInput.value = "";  
    cancelSearch.addEventListener("click", async () => {
        searchValue = ""; 
        currentParks = await getAllParks(); 
        renderItemsList(currentParks); 
    });
    
});

sortButton.addEventListener("click", async () => {
    const sortedParks = await getAllParks(searchValue, "price");  
    currentParks = sortedParks;
    renderItemsList(currentParks);
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

parksContainer.addEventListener("click", async (event) => {
    const parkId = event.target.closest("li")?.id;
    if (event.target.classList.contains("edit")) {
        parentId = parkId;
        openModal(editPark);
    } else if (event.target.classList.contains("delete")) {
        if (parkId) {
            await deletePark(parkId); 
            currentParks = currentParks.filter(park => park.id !== Number(parkId)); 
            renderItemsList(currentParks);

            
        }
    }
    
});



editPark.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
        closeModal(editPark, editparkForm); 
    }
});

editparkForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const newName = editparkForm.querySelector(".park-title").value;
    const newSize = Number(editparkForm.querySelector(".size").value);
    const newPrice = Number(editparkForm.querySelector(".edit-cost").value);

    await updatePark(parentId, { address: newName, size: newSize, price: newPrice });

    const parkIndex = currentParks.findIndex(park => park.id === Number(parentId));
    if (parkIndex !== -1) {
        currentParks[parkIndex].address = newName;
        currentParks[parkIndex].size = newSize;
        currentParks[parkIndex].price = newPrice;
    }

    renderItemsList(currentParks);
    closeModal(editPark, editparkForm);
});


    const newCard = async ({ name, meters, cost }) => {

        const parkExists = currentParks.some(park => park.address.toLowerCase() === name.toLowerCase());
    
        if (parkExists) {
            alert("Парк з такою назвою вже існує!");
            return; 
        }
    
        try {
            await postPark({ address: name, size: meters, price: cost });
        } catch (error) {
            console.error("Error adding new park: ", error);
        }
    
        currentParks.push({id:currentParks.length + 1, address: name, size : meters, price: cost});
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

createparkForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newName = createparkForm.querySelector(".park-title").value;
    const newSize = Number(createparkForm.querySelector(".size").value);
    const newPrice = Number(createparkForm.querySelector(".edit-cost").value);

    newCard({ name: newName, meters: newSize, cost: newPrice });    
    closeModal(createPark, createparkForm);
});

