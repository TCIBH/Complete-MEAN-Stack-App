const Post=require('../models/post');


exports.createPost =  async (req, res, next) => {
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
    }).catch(error =>{
      res.status(500).json({
        message:"Creating A Post Failed!"
      })
    });
  }
  exports.updatePost=async (req,res,next)=>{
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
      if(result.matchedCount >0){
        res.status(200).json({
          message: 'Post updated successfully!'
        });
      }
      else{
        res.status(401).json({
          message: 'Not Authorized!!'
        });
      }
     
    }).catch(error=>{
      res.status(500).json({
        message:"Couldn't Update Post!... "
      })
    });
  }
  exports.getPosts=async (req, res, next) => {
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
    }).catch(error=>{
      res.status(500).json({
        message:"Fetching posts Failed!..."
      })
    })
  }
  exports.getPost=async(req,res,next)=>{
    await Post.findById(req.params.id).then(post=>{
      if(post){
        res.status(200).json(post);
      } else {
        res.status(404).json({message:'Post not found'});
      }
    }).catch(error=>{
      res.status(500).json({
        message:"Fetching post Failed!..."
      })
    });
  }
  exports.deletePost=(req,res,next)=>{
    Post.deleteOne({_id:req.params.id,creator:req.userdata.userId}).then(result=>{
      if(result.deletedCount >0){
        res.status(200).json({
          message: 'Post Deleted successfully!'
        });
      }
      else{
        res.status(404).json({
          message: 'Not Authorized!!'
        });
      }
    }).catch(error=>{
      res.status(500).json({
        message:"Deleting post Failed!..."
      })
    })
  //  res.status(200).json({message:'Post deleted successfully'});
  }