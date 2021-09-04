//Prefix :/book
// Initializing Express Router
const Router =require("express").Router();
//Database  Models 
const BookModel=require("../../database/book")

/*******GET*******/
/*
Route -  /book
Description - get all books
Access-public
Parameter-none
Methods-get
*/
Router.get ("/",async(req,res)=>{
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

Router.get("/is/:isbn",async(req,res)=>{
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
Router.get("/c/:category",async(req,res)=>{
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

Router.get("/lang/:language",async(req,res)=>{
    const getSpecificBook=await BookModel.findOne({language: req.params.language})
    // const getSpecificBook=database.books.filter((book)=>book.language===req.params.language)
    if (!getSpecificBook)
   {
   return res.json({error:`No Book found for the language of ${req.params.language}`
   })
}
   
   return res.json({books:getSpecificBook})
   
})

/********POST*******/
/*
Route -  /book/add
Description - Add new book
Access-public
Parameter-none
Methods-post
*/
Router.post("/add",(req,res)=>{
    const {newBook}=req.body
    BookModel.create(newBook);
    return res.json({message:"Book was added"})
    })

/********PUT********/
/*
Route -  /book/update/title/:isbn
Description - update book titile
Access-public
Parameter-none
Methods-put
*/
Router.put("/update/title/:isbn",async(req,res)=>{

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
    Router.put("/update/author/:isbn/:authoID",async(req,res)=>{
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

/******DELETE********/
/*
Route -  /book/delete
Description - Delete a book
Access-public
Parameter-isbn
Methods-DELETE
*/
Router.delete("/delete/:isbn",async(req,res)=>{
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
Router.delete("/delete/author/:isbn/:authorID",async(req,res)=>{
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

module.exports=Router;