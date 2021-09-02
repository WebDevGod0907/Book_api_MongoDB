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
/*
Route -  /book
Description - get all books
Access-public
Parameter-none
Methods-get
*/
booky.get ("/book",async(req,res)=>{
    const getAllBooks=await BookModel.find();
    return res.json({Books:getAllBooks})
})

/*
Route -  /book/is
Description - get specific  book based on ISBN
Access-public
Parameter-isbn
Methods-get
*/

booky.get("/book/is/:isbn",async(req,res)=>{
    const getSpecificBook=await BookModel.findOne({ISBN:req.params.isbn});
    if (!getSpecificBook)
    {
    return res.json({error:`No Book found for the ISBN of ${req.params.isbn}`
    })
}
    
    return res.json({books:getSpecificBook})
    
})
/*
Route -  /book/c
Description - get specific  book based on Category
Access-public
Parameter-category
Methods-get
*/
booky.get("/book/c/:category",async(req,res)=>{
    const getSpecificBook=await BookModel.findOne({category:req.params.category})
    //  const getSpecificBook=database.books.filter((book)=>book.category.includes(req.params.category))
     if (!getSpecificBook)
    {
    return res.json({error:`No Book found for the category of ${req.params.category}`
    })
}
    
    return res.json({books:getSpecificBook})
    
})
/*
Route -  /lang
Description - get specific  book based on language
Access-public
Parameter-language
Methods-get
*/

booky.get("/book/lang/:language",async(req,res)=>{
    const getSpecificBook=await BookModel.findOne({language: req.params.language})
    // const getSpecificBook=database.books.filter((book)=>book.language===req.params.language)
    if (!getSpecificBook)
   {
   return res.json({error:`No Book found for the language of ${req.params.language}`
   })
}
   
   return res.json({books:getSpecificBook})
   
})

/*
Route -  /authors
Description - get all the authors
Access-public
Parameter-none
Methods-get
*/

booky.get("/authors",async(req,res)=>{
    const getAllAuthors=await AuthorModel.find()
    return res.json({"authors":getAllAuthors})
    
})

/*
Route -  /authors
Description - get specific  author based on id
Access-public
Parameter-id
Methods-get
*/
booky.get("/authors/:id",async(req,res)=>{
    const getSpecificAuthor=await AuthorModel.findOne({id:req.params.id})
// const getSpecificAuthor=database.author.filter((author)=>author.id===parseInt(req.params.id))


if (!getSpecificAuthor)
   {
   return res.json({error:`No Author found for the id of ${req.params.id}`
   })
}
   
   return res.json({Authors:getSpecificAuthor})
   
})
/*
Route -  /authors/book
Description - get all authors based on book
Access-public
Parameter-isbn
Methods-get
*/
booky.get("/authors/book/:isbn",async(req,res)=>{
    const getSpecificAuthor=await AuthorModel.findOne({books:req.params.isbn})
    // const getSpecificAuthor=database.author.filter((author)=>author.books.includes(req.params.isbn))

    if (!getSpecificAuthor)
   {
   return res.json({error:`No Author found for the Book ISBN of ${req.params.isbn}`
   })
}
   
   return res.json({Authors:getSpecificAuthor})
})   

/*
Route -  /publications
Description - get all Publications
Access-public
Parameter-none
Methods-get
*/
booky.get("/publications",async(req,res)=>{
    const getAllPublications=await PublicationModel.find()
    
    return res.json({"publications":getAllPublications})
    
})
/*
Route -  /publications
Description - get a specific Publications
Access-public
Parameter-id
Methods-get
*/
booky.get("/publications/:id",async(req,res)=>
{
    const getSpecificPublications=await PublicationModel.findOne({id:req.params.id})
    // const getSpecificPublications=database.publication.filter((publication)=>publication.id===parseInt(req.params.id))
    if (!getSpecificPublications)
    {
    return res.json({error:`No Publications found for the id of ${req.params.id}`
    })
 }
    
    return res.json({Authors:getSpecificPublications})
})
/*
Route -  /publications/book
Description - get a list of Publications based on book
Access-public
Parameter-isbn
Methods-get
*/
booky.get("/publications/book/:isbn",async(req,res)=>{
    const getSpecificPublications=await PublicationModel.findOne({books:req.params.isbn}) 
// const getSpecificPublications=database.publication.filter((publication)=>publication.books.includes(req.params.isbn))

if (!getSpecificPublications)
    {
    return res.json({error:`No Publications found for the ISBN of ${req.params.isbn}`
    })
 }
    
    return res.json({Authors:getSpecificPublications})



})

/**********post*********/

/*
Route -  /book/add
Description - Add new book
Access-public
Parameter-none
Methods-post
*/
booky.post("/book/add",(req,res)=>{
const {newBook}=req.body
BookModel.create(newBook);
return res.json({message:"Book was added"})
})
/*
Route -  /author/add
Description - Add new author
Access-public
Parameter-none
Methods-post
*/
booky.post("/author/add",(req,res)=>{
    const {newAuthor}=req.body
AuthorModel.create(newAuthor)
return res.json({message:"Author was added"})
})
/*
Route -  /publication/add
Description - Add new publication
Access-public
Parameter-none
Methods-post
*/
booky.post("/publication/add",(req,res)=>{
    const {newPublication}=req.body
PublicationModel.create(newPublication)
return res.json({message:"Publication was added"})
})

/**********put*********/
/*
Route -  /book/update/title/:isbn
Description - update book titile
Access-public
Parameter-none
Methods-put
*/
booky.put("/book/update/title/:isbn",async(req,res)=>{

const UpdatedBook=await BookModel.findOneAndUpdate({ISBN:req.params.isbn,},{
    title:req.body.newBookTitle
},{
    new:true,
}
)

    // database.books.forEach((book) => {
    //     if(book.ISBN === req.params.isbn){
    //         book.title=req.body.newBookTitle;
    //        return 
    //     }
    // });
    return res.json({book:UpdatedBook})
})
/*
Route -  /book/update/author
Description - update/add new author for a book
Access-public
Parameter-isbn
Methods-put
*/
booky.put("/book/update/author/:isbn/:authoID",async(req,res)=>{
    //update thee book database
    const UpdatedBook=await BookModel.findOneAndUpdate({
        ISBN:req.params.isbn,
    },{
       $addToSet:{
           authors:req.params.authoID,//use pa5rseInt or not both are fine
       },
    },
    {
        new:true,
    })
    // database.books.forEach((book)=>{
    //     if (book.ISBN===req.params.isbn){
    //         return book.author.push(parseInt(req.params.authoID))
    //     }
        
    //     })

    //update author database
 const updatedAuthor=await AuthorModel.findOneAndUpdate({
     id:req.params.authoID,//use pa5rseInt or not both are fine
 },{
     $addToSet:{
         books:req.params.isbn},
 },{
     new:true,
 })
    //     database.author.forEach((author)=>{
    //         if (author.id===parseInt(req.params.authoID)){
    //             return author.books.push(req.params.isbn)
    //         }
    // })

    return res.json({books:UpdatedBook,auhtor:updatedAuthor,message:"New author was added"})
})
/*
Route -  /author/update/name
Description - Update Author name using it's id 
Access-public
Parameter-id
Methods-put
*/
booky.put("/author/update/name/:id",async(req,res)=>{
    const UpdatedAuthor=await AuthorModel.findOneAndUpdate({id:parseInt(req.params.id),},{
        name:req.body.newAuthorName
    },{
        new:true,
    }
    )

    // database.author.forEach((author) => {
    //     if(author.id=== parseInt(req.params.id)){
    //         author.name=req.body.newAuthorName;
    //        return 
    //     }
    // });
    return res.json({author:UpdatedAuthor})
})
/*
Route -  /publication/update/name
Description - Update publication name using it's id 
Access-public
Parameter-id
Methods-put
*/
booky.put("/publication/update/name/:id",async(req,res)=>{
    const UpdatedPublication=await PublicationModel.findOneAndUpdate({id:parseInt(req.params.id),},{
        name:req.body.newPublicationName
    },{
        new:true,
    }
    )

    // database.publication.forEach((publication) => {
    //     if(publication.id=== parseInt(req.params.id)){
    //         publication.name=req.body.newPublicationName;
    //        return 
    //     }
    // });
    return res.json({publication:UpdatedPublication})
})
/*
Route -  /publication/update/book
Description - update/add books to publications
Access-public
Parameter-isbn
Methods-put
*/
booky.put("/publication/update/book/:isbn",async(req,res)=>{
//Removing the book from previous publication

const previousPublication=(await BookModel.findOne({
    ISBN:req.params.isbn
})).publications
 if(previousPublication!==req.body.pubID){
await PublicationModel.findOneAndUpdate({
    id:parseInt(previousPublication)
},{
$pull:{
    books:req.params.isbn
}
},{
    new:true
})

 }
//update the publication database
const updatedPublication=await PublicationModel.findOneAndUpdate({
    id:req.body.pubID,//use pa5rseInt or not both are fine
},{
    $addToSet:{
        books:req.params.isbn},
},{
    new:true,
})

// database.publication.forEach((publication)=>{
//     if(publication.id===req.body.pubID){
//        return publication.books.push(req.params.isbn)
//     }
// })


//update the book database
const UpdatedBook=await BookModel.findOneAndUpdate({
    ISBN:req.params.isbn,
},{
  
       publications:req.body.pubID,//use pa5rseInt or not both are fine

},
{
    new:true,
})
// database.books.forEach((book)=>{
//     if(book.ISBN===req.params.isbn){
//         return book.publications.push(req.body.pubID)
        
//     }
// })
return res.json({books:UpdatedBook,
    publications:updatedPublication,
    message:"Successfully updated publications"
})
})
/*********Delete************/
/*
Route -  /book/delete
Description - Delete a book
Access-public
Parameter-isbn
Methods-DELETE
*/
booky.delete("/book/delete/:isbn",async(req,res)=>{
    const updateBookDatabase=await BookModel.findOneAndDelete({
        ISBN:req.params.isbn,
    })
    if(!updateBookDatabase){
        return res.json ({message:"Book was not found"})
    }

    // const updateBookDatabase=database.books.filter((book)=>book.ISBN!==req.params.isbn)
    // database.books=updateBookDatabase
    return res.json({books:updateBookDatabase,message:"book was deletd"})
})

/*
Route -  /book/delete/author
Description - Delete a book from author
Access-public
Parameter-isbn,authorID
Methods-DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorID",async(req,res)=>{
    //update the book database
    const updatedBook=await BookModel.findOneAndUpdate({
        ISBN:req.params.isbn
    },{
        $pull:{
            authors:parseInt(req.params.authorID)//use parseInt or not both are fine
        }
    },
    {new:true})
    // database.books.forEach((book)=>{
    //     if(book.ISBN===req.params.isbn){
    //         const newAuthorList=book.authors.filter((author)=>author!==parseInt(req.params.authorID))
            
    //         book.authors=newAuthorList
    //         return;
    //     }
    // })

    //update the author database
    const updatedAuthor=await AuthorModel.findOneAndUpdate({
        id:parseInt(req.params.authorID)//use parseInt or not both are fine
    },{
        $pull:{
            books:req.params.isbn
        }
    },{
        new:true
    })

//     database.author.forEach((author)=>{
//         if(author.id===parseInt(req.params.authorID)){
//             const newBooksList=author.books.filter((book)=> book!==req.params.isbn)
//             author.books=newBooksList
//             return;
//         }  
//  })

return res.json({books:updatedBook,author:updatedAuthor,message:"author was deleted!!!!"})
})

/*
Route -  /author/delete
Description - Delete a author
Access-public
Parameter-id
Methods-DELETE
*/
booky.delete("/author/delete/:id",async(req,res)=>{
    const updateAuthorDatabase=await AuthorModel.findOneAndDelete({
        id:req.params.id,
    })

    // const updateAuthorDatabase=database.author.filter((author)=>author.id!==parseInt(req.params.id))
    // database.author=updateAuthorDatabase;
    if(!updateAuthorDatabase){
        return res.json ({message:"author was not found"})
    }
     return res.json ({authors:updateAuthorDatabase,message:"author deleted successful"})
})
/*
Route -  /publication/delete
Description - Delete a publication
Access-public
Parameter-id
Methods-DELETE
*/
booky.delete("/publication/delete/:id",async(req,res)=>{
    const updatePublicationDatabase=await PublicationModel.findOneAndDelete({
        id:req.params.id,
    })
    if(!updatePublicationDatabase){
        return res.json ({message:"Publication was not found"})
    }
    // const updatePublicationDatabase=database.publication.filter((publication)=>publication.id!==parseInt(req.params.id))
    // database.publication=updatePublicationDatabase;
    return res.json ({publications:updatePublicationDatabase,message:"Publication was deleted"})
})
/*
Route -  /publication/delete/book
Description - Delete a book from publication
Access-public
Parameter-pub_id,isbn
Methods-DELETE
*/
booky.delete("/publication/delete/book/:isbn/:pub_id",async(req,res)=>{
    //update publication database
    const updatedPublication=await PublicationModel.findOneAndUpdate({
        id:parseInt(req.params.pub_id)//use parseInt or not both are fine
    },{
        $pull:{
            books:req.params.isbn
        }
    },{
        new:true
    })
    // database.publication.forEach((publication)=>{
    //     if (publication.id===parseInt(req.params.pub_id)){
    //         const newBooksList=publication.books.filter((book)=>book!==req.params.isbn)
    //         publication.books=newBooksList
    //         return;
    //     }

    // })
    //update book database
    const updatedBook=await BookModel.findOneAndUpdate({
        ISBN:req.params.isbn,
    },{
      
           publications:0,//use pa5rseInt or not both are fine
    
    },
    {
        new:true,
    })    



    // database.books.forEach((book)=>{
    //     if(book.ISBN===req.params.isbn){
    //             const newPublicationsList=book.publications.filter((publication)=>publication!==parseInt(req.params.pub_id))
    //             book.publications=newPublicationsList
    //             return;
    //     }
    // })
    return res.json({books:updatedBook,publications:updatedPublication})
})
booky.listen(3000,()=>{console.log("hey Server is running ")})

