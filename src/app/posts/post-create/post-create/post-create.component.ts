import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Post } from '../../post.model';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { PostService } from '../../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mineType } from './mine-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styles:``
})
export class PostCreateComponent implements OnInit,OnDestroy{
  enteredvalue:string=" ";
  enteredContent:string='';
  enterdTitle:string='';
  private mode='create';
  private postId:string;
   post:Post;
   isLoading=false;
   form:FormGroup;
   imagePreview:string;
postForm: any;
authStatusSub:Subscription;

  constructor(public postService:PostService,public route:ActivatedRoute,private authService:AuthService){}
ngOnInit(){
  this.authStatusSub=this.authService.getAuthStatusListener().subscribe(authStatus=>{
    this.isLoading=false;
  });
  this.form=new  FormGroup({
    title:new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
    content:new FormControl(null,{validators:[Validators.required]}),
    image:new FormControl(null,{validators:[Validators.required],asyncValidators:[mineType]})
  })
this.route.paramMap.subscribe((paramMap: ParamMap) => {
  if (paramMap.has('postId')) {
    this.mode = 'edit';
    this.postId = paramMap.get('postId');
   this.isLoading=true;
    this.postService.getPost(this.postId)
      .subscribe(
        (postData) => {
          console.log('getpost postData:', postData);
          this.isLoading=false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath:postData.imagePath,
            creator:postData.creator

          };
          this.form.setValue({'title':this.post.title,'content':this.post.content,image:this.post.imagePath})
          console.log('getPost this.post: ', this.post);
        },
        (error) => {
          console.log('getpost error:', error);
        }
      );
  } else {
    this.postId = null;
    this.mode = 'create';
  }
  console.log('mode: ', this.mode);
});
}

onSavePost(){
    if(this.form.invalid){
      return;
    }
    this.isLoading=true;
    if(this.mode==='create'){
      this.postService.addPost(this.form.value.title,this.form.value.content,this.form.value.image);
    }
    else{
      this.postService.updatePost(this.postId,this.form.value.title,this.form.value.content,this.form.value.image)
    }
    
    
    this.form.reset()

  }
  onImagePicked(event:Event){
    const file=(event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file});
    this.form.get('image').updateValueAndValidity();
    const reader=new FileReader();
     reader.onload=()=>{
      this.imagePreview=reader.result as string;
     };
     reader.readAsDataURL(file);
  }
ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
}
}
