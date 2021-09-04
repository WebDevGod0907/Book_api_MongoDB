require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose")
//Database
const database=require("./databas")

//model
const BookModel=require("./database/book")
const AuthorModel=require("./database/author")
const PublicationModel=require("./database/publication");
const { findOneAndUpdate } = require("./database/book");

// Microservices Routes
const Books=require("./API/Book");
const Authors=require("./API/Author");
const Publications=require("./API/Publication");
//Initialization
const booky=express();
//configuration
booky.use(express.json());
//Establish Database Connection
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    
}
).then(()=>console.log("connection established !!!!!"));
//Initializing Microservices

booky.use("/book",Books);
booky.use("/author",Authors);
booky.use("/publication",Publications);

booky.listen(3000,()=>{console.log("hey Server is running ")})

