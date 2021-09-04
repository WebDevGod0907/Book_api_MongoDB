//Prefix :/publication
// Initializing Express Router
const Router =require("express").Router();
//Database  Models 
const PublicationModel=require("../../database/publication");


/******GET*****/
/*
Route -  /publication
Description - get all Publications
Access-public
Parameter-none
Methods-get
*/
Router.get("/",async(req,res)=>{
    const getAllPublications=await PublicationModel.find()
    
    return res.json({"publications":getAllPublications})
    
})
/*
Route -  /publication
Description - get a specific Publications
Access-public
Parameter-id
Methods-get
*/
Router.get("/:id",async(req,res)=>
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
Route -  /publication/book
Description - get a list of Publications based on book
Access-public
Parameter-isbn
Methods-get
*/
Router.get("/book/:isbn",async(req,res)=>{
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
Route -  /publication/add
Description - Add new publication
Access-public
Parameter-none
Methods-post
*/
Router.post("/add",async(req,res)=>{
    try {
        const {newPublication}=req.body
await PublicationModel.create(newPublication)
return res.json({message:"Publication was added"})
    } catch (error) {
        return res.json({error:error.message});
    }
    
})

/**********put*********/


/*
Route -  /publication/update/name
Description - Update publication name using it's id 
Access-public
Parameter-id
Methods-put
*/
Router.put("/update/name/:id",async(req,res)=>{
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
Router.put("/update/book/:isbn",async(req,res)=>{
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
Route -  /publication/delete
Description - Delete a publication
Access-public
Parameter-id
Methods-DELETE
*/
Router.delete("/delete/:id",async(req,res)=>{
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
Router.delete("/delete/book/:isbn/:pub_id",async(req,res)=>{
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






module.exports=Router;

