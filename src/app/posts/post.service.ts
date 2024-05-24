import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject, map } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
    providedIn:'root'
})
export class PostService{
    private Posts:Post[]=[];
    private postsUpdated=new Subject<{posts:Post[],postCount:number}>();
    constructor(private http:HttpClient,private router:Router){}
    getPosts(postsPerPage:number,currentPage:number){
   const queryParmas=`?pageSize=${postsPerPage}&page=${currentPage}`;

        this.http.get<{message:string,posts:any,maxPosts:number}>('http://localhost:3000/api/posts'+queryParmas)
        .pipe(map((postData)=>{
return { posts: postData.posts.map(post=>{ return {
    title: post.title,
    content: post.content,
    id:post._id,
  imagePath:post.imagePath,
   creator:post.creator
}}),maxPosts:postData.maxPosts
        }}))
        .subscribe(transformedPostData =>{
                this.Posts=transformedPostData.posts;
                this.postsUpdated.next({posts:[...this.Posts],postCount:transformedPostData.maxPosts})
          })
    }
    getPost(id:string){
     return this.http.get<{_id:string,title:string,content:string,imagePath:string,creator:string}>("http://localhost:3000/api/posts/"+id)
    }
    getUpdatePostListener(){
        return this.postsUpdated.asObservable();
    }
    addPost(title:string,content:string,image:File){
       const postData=new FormData();
       postData.append("title",title);
       postData.append("content",content);
       postData.append("image",image,title)
        this.http.post<{message:string,post:Post}>('http://localhost:3000/api/posts',postData).subscribe(data =>{
        // const post:Post={
        //   id:data.post.id,
        //   title:title,
        //   content:content,
        // imagePath:data.post.imagePath}    
        // this.Posts.push(post);
        // this.postsUpdated.next([...this.Posts]);
        this.router.navigate(["/"])
        
        })}
updatePost(id:string,title:string,content:string,image:File|string){
    // const post:Post={
    //   id:id,
    //   title:title,
    //   content:content,
    //   iamgePath:null

    // };
    let postData :Post|FormData;
    if(typeof image ==='object'){
       postData=new FormData();
       postData.append("id",id);
      postData.append('title',title);
      postData.append('content',content);
      postData.append('image',image,title)
    }
    else{
        postData={
          id:id,
          title:title,
          content:content,
          imagePath:image,
          creator:null
       };
    }
    this.http
    .put("http://localhost:3000/api/posts/"+ id,postData)
      .subscribe((response)=>{
        console.log('Updated Successfully');
        // const updatedPosts=[...this.Posts];
        // const oldPostIndex=updatedPosts.findIndex(p=>p.id === id);
      //  const post:Post={
      //      id:id,
      //     title:title,
      //     content:content,
      //     imagePath:""
      //  }
      //   updatedPosts[oldPostIndex]=post;
      //   this.Posts=updatedPosts;
      //   this.postsUpdated.next([...this.Posts]);
        this.router.navigate(["/"])
      });
  }
        // updatePost(id:string,title:string,content:string){
        //    const post:Post={
        //     id:id,
        //     title:title,
        //     content:content
        //    }
        //    this.http.put("http://localhost:3000/api/posts/"+ id,post)
        //    .subscribe((response)=>{
        //     console.log('Updated Successfully');
        //     const updatedPosts=[...this.Posts];
        //     const oldPostIndex=updatedPosts.findIndex(p=>p.id === post.id);
        //     updatedPosts[oldPostIndex]=post;
        //         this.Posts=updatedPosts;
        //         this.postsUpdated.next([...this.Posts]);
        //    })
        // }

        
    //    deletePost(postId:string){
    //     this.http.delete("http://localhost:3000/api/posts/"+postId)
    //     .subscribe(()=>{
    //         console.log('Deleted Successfully');
    //         const updatedPosts=this.Posts.filter(post =>{
    //                 post.id !== postId 
    //         })
    //         this.Posts=updatedPosts;
    //         this.postsUpdated.next([...this.Posts]);
    //     })
    deletePost(postId: string) {
       return this.http.delete("http://localhost:3000/api/posts/" + postId);
        
       }
}