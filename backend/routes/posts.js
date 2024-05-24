const express=require('express');
const Post=require('../models/post');
const multer=require('multer');
const router=express.Router();
const checkAuth=require("../middleware/check-auth")

const MIME_TYPE_MAP={
  "image/png":"png",
  "image/jpeg":"jpg",
  "image/jpg":"jpg"
};

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    const isValid=MIME_TYPE_MAP[file.mimetype];
    let error= new Error("invalid mime type");
    if(isValid){
      error=null;
    }
    cb(error,"backend/images");
  },
  filename:(req,file,cb)=>{
    const name=file.originalname.toLowerCase().split(" ").join("-");
    const ext= MIME_TYPE_MAP[file.mimetype];
    cb(null,name+"-"+Date.now()+"-"+ext);
  }
});

router.get("",async (req, res, next) => {
  const pageSize=+req.query.pageSize;
  const currentPage=+req.query.page;
  const postQuery=Post.find();
  let fetchedPosts;
  if(pageSize && currentPage){
    postQuery.skip(pageSize *(currentPage-1)).limit(pageSize);
  }
 
  await postQuery.then(posts=>{
    fetchedPosts=posts;
     return Post.countDocuments();
  }).then(count=>{
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: fetchedPosts,
      maxPosts:count
    });
  })
});

router.get('/:id',async(req,res,next)=>{
  await Post.findById(req.params.id).then(post=>{
    if(post){
      res.status(200).json(post);
    } else {
      res.status(404).json({message:'Post not found'});
    }
  });
});

router.post("",checkAuth,multer({storage:storage}).single('image'), async (req, res, next) => {
  const url=req.protocol +"://"+ req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath:url+"/images/"+req.file.filename,
    creator:req.userdata.userId
  });
  await post.save().then(result =>{
    res.status(201).json({
      message: 'Post added successfully!',
      post: {
        id:result._id,
        title:result.title,
        content:result.content,
        imagePath:result.imagePath
      }
    });
  });
});

router.put('/:id',checkAuth,multer({storage:storage}).single('image'),async (req,res,next)=>{
  let imagePath=req.body.imagePath;
  if(req.file){
    const url=req.protocol +"://"+ req.get("host");
    imagePath=url+"/images/"+req.file.filename;
  }
  const post=new Post({
    _id:req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath:imagePath,
    creator:req.userdata.userId
  });

  await Post.updateOne({ _id:req.params.id,creator:req.userdata.userId},post).then(result=>{
    if(result.modifiedCount>0){
      res.status(200).json({
        message: 'Post updated successfully!'
      });
    }
    else{
      res.status(401).json({
        message: 'Not Authorized!!'
      });
    }
   
  });
});


router.delete("/:id",checkAuth,(req,res,next)=>{
  Post.deleteOne({_id:req.params.id,creator:req.userdata.userId}).then(result=>{
    if(result.deletedCount >0){
      res.status(200).json({
        message: 'Post updated successfully!'
      });
    }
    else{
      res.status(404).json({
        message: 'Not Authorized!!'
      });
    }
  }).catch(err=>{
    console.log(err);
  });
  res.status(200).json({message:'Post deleted successfully'});
});

module.exports=router;