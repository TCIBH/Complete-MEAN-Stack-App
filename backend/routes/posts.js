const express=require('express');

const postControllers=require('../controllers/posts')
const router=express.Router();
const checkAuth=require("../middleware/check-auth");
const extractFile=require("../middleware/file");

router.get("",postControllers.getPosts);

router.get('/:id',postControllers.getPost);

 router.post("",checkAuth,extractFile,postControllers.createPost);

router.put('/:id',checkAuth,extractFile,postControllers.updatePost);


router.delete("/:id",checkAuth,postControllers.deletePost);

module.exports=router;