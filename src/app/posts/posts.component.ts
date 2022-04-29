import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { AppError } from './app.error';
import { BadInput } from './bad-input';
import { NotFoundError } from './not-found-error';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  posts: any[] = [];

  constructor(private service: PostService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe((posts) => (this.posts = posts as any[]));
  }

  createPost(input: HTMLInputElement) {
    let post: any = { title: input.value };
    input.value = '';
    this.service.create(post).subscribe({
      next: (response: any) => {
        post.id = response.id;
        this.posts.splice(0, 0, post);
        console.log(response);
      },
      error: (error: AppError) => {
        if (error instanceof BadInput) alert(error.originalError);
        else throw error;
      },
    });
  }

  updatePost(post: any) {
    // this.http.put(this.url, post);
    this.service.update(post).subscribe((response) => console.log(response));
  }

  deletePost(post: any) {
    this.service.delete(post.id).subscribe({
      next: () => {
        let index = this.posts.indexOf(post);
        this.posts.splice(index, 1);
      },
      error: (error: AppError) => {
        if (error instanceof NotFoundError)
          alert('This post has already been deleted.');
        else throw error;
      },
    });
  }
}
