//Prefix :/author
// Initializing Express Router
const Router =require("express").Router();
//Database  Models 
const AuthorModel=require("../../database/author")

/*******GET*******/

/*
Route -  /author
Description - get all the authors
Access-public
Parameter-none
Methods-get
*/


Router.get("/",async(req,res)=>{
    const getAllAuthors=await AuthorModel.find()
    return res.json({"authors":getAllAuthors})
    
})

/*
Route -  /author
Description - get specific  author based on id
Access-public
Parameter-id
Methods-get
*/
Router.get("/:id",async(req,res)=>{
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
Route -  /author/book
Description - get all authors based on book
Access-public
Parameter-isbn
Methods-get
*/
Router.get("/book/:isbn",async(req,res)=>{
    const getSpecificAuthor=await AuthorModel.findOne({books:req.params.isbn})
    // const getSpecificAuthor=database.author.filter((author)=>author.books.includes(req.params.isbn))

    if (!getSpecificAuthor)
   {
   return res.json({error:`No Author found for the Book ISBN of ${req.params.isbn}`
   })
}
   
   return res.json({Authors:getSpecificAuthor})
})


/*******POST*******/
/*
Route -  /author/add
Description - Add new author
Access-public
Parameter-none
Methods-post
*/
Router.post("/add",async(req,res)=>{
    try {
        const {newAuthor}=req.body
await AuthorModel.create(newAuthor)
return res.json({message:"Author was added"})
        
    } catch (error) {
        return res.json({error:error.message});
    }
    
})


/*****PUT*****/
/*
Route -  /author/update/name
Description - Update Author name using it's id 
Access-public
Parameter-id
Methods-put
*/
Router.put("/update/name/:id",async(req,res)=>{
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


/***DELETE*****/

/*
Route -  /author/delete
Description - Delete a author
Access-public
Parameter-id
Methods-DELETE
*/
Router.delete("/delete/:id",async(req,res)=>{
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

module.exports=Router;