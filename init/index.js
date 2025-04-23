const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGOOSE_URL = 'mongodb://127.0.0.1:27017/wanderlust';
main()
    .then((res) => console.log("Connected To DB"))
    .catch((err) => console.log(err));
async function main() {
    await mongoose.connect(MONGOOSE_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "67fce5ad46e0fb01c4d033bc"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();