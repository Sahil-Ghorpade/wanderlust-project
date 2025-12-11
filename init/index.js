const mongoose = require("mongoose");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const initData = require("./data.js");
const Listing = require("../models/listing.js");


async function main() {
    await mongoose.connect(mongo_url);
}

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj, 
        owner: "6938427799c16183bf13f70e",
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();