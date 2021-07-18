import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { Post } from 'src/app/shared-module/models/post.model';
import {fromEvent, Subscription} from 'rxjs';
import {tap, throttleTime} from 'rxjs/operators';

@Component({
  selector:'story-list',
  templateUrl: 'story-list.component.html',
  styleUrls: ['story-list.component.scss']
})
export class StoryListComponent implements AfterViewInit, OnDestroy {
  /**
   * A list of Posts to display
   */
  @Input() stories: Post[] | null = null;
  /**
   * How far from the bottom before we emit the event
   */
  @Input() scrollThreshold: number = 0;
  /**
   * The event emitter to notify when we are near the bottom
   */
  @Output() nearBottom: EventEmitter<void> = new EventEmitter<void>();
  /**
   * A reference to the element so we can track the scroll position
   */
  @ViewChild('storyListContainer') storyListElement: ElementRef<HTMLElement> | undefined;
  /**
   * Subscribe to the scroll event and use RxJs to throttle how often it fires
   */
  private scrollEventSubscription: Subscription | undefined;

  private THROTTLE_TIME = 100;

  /**
   * Need to use afterViewInit hook since we are using a ViewChild
   * Here we use observable pipes to throttle the scroll event
   */
  ngAfterViewInit(){
    this.scrollEventSubscription = fromEvent(this.storyListElement!.nativeElement, 'scroll').pipe(
      throttleTime(this.THROTTLE_TIME),
      tap(this.onScroll.bind(this))
    ).subscribe();
  }

  /**
   * called when the user wants to remove a post
   * @param post The post to remove
   */
  removePost(post: Post){
    this.stories?.splice(this.stories.indexOf(post), 1);
  }

  /**
   * When we are near the bottom of the list emit an event so the parent can fetch more stories
   */
  onScroll(){
    const element: HTMLElement|undefined = this.storyListElement?.nativeElement;
    const spaceFromBottom: number = element!.scrollHeight - element!.scrollTop - element!.clientHeight;
    if(spaceFromBottom < this.scrollThreshold){
      this.nearBottom.emit();
    }
  }

  /**
   * Don't forget to clean up
   */
  ngOnDestroy(){
    this.scrollEventSubscription!.unsubscribe();
  }

}