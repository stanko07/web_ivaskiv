const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 1337;
app.use(cors());
app.use(express.json());


let parks = [
{ id: 1, address: "вул. Центральна, 10", size: 2500, price: 50 },
{ id: 2, address: "вул. Паркова, 23", size: 152, price: 25 },
{ id: 3, address: "вул. Богдана Хмельницького, 32", size: 169, price: 16 },
{ id: 4, address: "вул. Краківська вулиця, 12", size: 136, price: 17 },
{ id: 5, address: "вул. Пекарська, 4", size: 142, price: 27 },
{ id: 6, address: "вул. Високий замок, 22", size: 154, price: 19 },
{ id: 7, address: "вул. Проспект Свободи, 2", size: 139, price: 19 },
{ id: 8, address: "вул. Крушельниця, 17", size: 142, price: 20 },
];

app.get("/parks", (req, res) => {
    const { search, sort } = req.query;
    let filteredParks = parks;

    if (search) {
        filteredParks = filteredParks.filter(park =>
            park.address.toLowerCase().trim().includes(search.toLowerCase().trim())
        );
    }

    if (sort && sort === 'price') {
        filteredParks = filteredParks.sort((a, b) => a.price - b.price);
    }

    res.json(filteredParks);
});



app.get("/parks", (req, res) => {
    res.json(parks);
});


app.post("/parks", (req, res) => {
    const { address, size, price } = req.body;

    if (!address || !size || !price) {
        return res.status(400).json({ message: "All fields are required." });
    }
    const existingIds = parks.map(park => park.id);

    let newId = 1;
    while (existingIds.includes(newId)) {
        newId++;
    }

    const newPark = {
        id: newId,
        address,
        size,
        price
    };  

    parks.push(newPark);
    res.status(201).json(newPark);
});





app.patch("/parks/:id", (req, res) => {
    const parkId = parseInt(req.params.id, 10);
    const { address, size, price } = req.body;
    const park = parks.find(p => p.id === parkId);

    if (park) {
        park.address = address || park.address;
        park.size = size || park.size;
        park.price = price || park.price;
        res.status(200).json(park);
    } else {
        res.status(404).json({ message: "Park not found" });
    }
});


app.delete("/parks/:id", (req, res) => {
    const parkId = parseInt(req.params.id, 10);
    parks = parks.filter(p => p.id !== parkId);
    res.status(204).send();
    res.json(parks);
});

app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}/parks`);
});
