import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { map, tap, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { API } from '../story-api'
import { Post } from '../../shared-module/models/post.model';

@Injectable()
export class ItemRetrievalService {
  // /**
  //  * A subject that will keep sending post items to the subscribers as they request them
  //  */
  stories: Subject<Post[]> = new Subject<Post[]>();
  private topStoryList: number[] = [];
  
  constructor(private http: HttpClient){

  }

  getNextStories(start: number, amount: number): void {
    // Get top stories returns the IDs for the posts, then use mergeMap/forkJoin to join the
    // individial requests to get the details of each story into one observable response.
    // Using a separate subject here to send the details back so we can concat them and do 
    // an infinite scroll
    this.getTopStories(start, amount).pipe(
      mergeMap((ids: number[]) => forkJoin(ids.map((id: number) => this.getItem(id)))),
    ).subscribe((allStories: Post[]) => {
      this.stories.next(allStories);
    });
  }
  
  /**
   * Get the top stories. Cache the top 500 list and use that for the subsequent
   * requests. 
   * @param start Which point to start at
   * @param amount The amount of stories to return
   * @returns An observable of type Post[]
   */
  private getTopStories(start: number, amount: number): Observable<number[]>{
    if(this.topStoryList.length === 0){
      return this.http.get<number[]>(API.GetTopStories()).pipe(
        tap((ids:number[]) => this.topStoryList = ids),
        map((ids:number[]) => ids.slice(start, start + amount))
      );
    }
    return of(this.topStoryList.slice(start, start + amount));
  }

  /**
   * 
   * @param itemId The ID of the item to retrieve
   * @returns 
   */
  private getItem(itemId: number): Observable<Post>{
    return this.http.get<Post>(API.GetItem(itemId));
  }
}