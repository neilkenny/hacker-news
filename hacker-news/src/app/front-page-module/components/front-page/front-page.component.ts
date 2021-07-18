import { Component, OnInit } from '@angular/core';
import { ItemRetrievalService } from '../../services/item-retrieval.service';
import { Post } from '../../../shared-module/models/post.model';
import { LinkItem } from 'src/app/shared-module/models/link.model';
import { MenuLinksService } from 'src/app/shared-module/services/menu-links.service';
import { ResponsiveDisplayService } from 'src/app/shared-module/services/responsive-display.service';
import { ScreenSize } from 'src/app/shared-module/models/screen-size.model';
import { Observable } from 'rxjs';
import { scan, tap } from 'rxjs/operators';

@Component({
  selector: 'front-page',
  templateUrl: 'front-page.component.html',
  styleUrls: ['front-page.component.scss']
})
export class FrontPageComponent implements OnInit {

  /**
   * An observable that feeds us the stories
   */
  stories$: Observable<Post[]> | undefined;
  /**
   * An array of menu links
   */
  menuLinks: LinkItem[] = [];
  /**
   * If true show the menu links
   */
  showMenu: boolean = true;

  /**
   * How many items are we displaying
   */
  private counter: number = 0;
  /**
   * flag to prevent duplicate calls to the item retrieval service
   */
  private waitingOnResponse: boolean = false;

  private STORIES_TO_RECEIVE = 30;

  constructor(private itemRetrievalService: ItemRetrievalService, 
              private menuLinksService: MenuLinksService,
              private responsiveDisplayService: ResponsiveDisplayService ){

  }

  /**
   * Setup a few things when we init the front-page
   *  - Get the menu links from a service so these could potentially be served from an API if necessary
   *  - Subscribe to the responsiveDisplayService to get updates on screen size
   *  - Subscribe to the item retrieval service so we can get a feed of stories to display
   *  - Tell the 
   */
  ngOnInit(){
    this.setShowMenu(this.responsiveDisplayService.currentScreenMode!);
    this.responsiveDisplayService.screenSizeUpdates.subscribe(this.setShowMenu.bind(this));
    
    this.menuLinksService.getMenuLinks().then((links: LinkItem[]) => {
      if(links){
        // just hardcoding the first link as the active one for the demo
        links[0].active = true;
        this.menuLinks = links;
      }
    });

    // Subscribe to the observable on the item retrieve service
    // Use scan to add to the array of stories instead of replacing it
    // Use tap to update some variables so we know which items to retrieve next
    this.stories$ = this.itemRetrievalService.stories.pipe(
      scan<Post[]>((all: Post[], current: Post[]) => [...all, ...current]),
      tap((next: Post[]) => {
        this.counter = next.length;
        this.waitingOnResponse = false;
      })
    );
    
    this.getNextStories(0);
  }

  /**
   * When the story-list component tells us that the user is nearing 
   * the bottom of the list we should retrieve some more
   */
  onNearBottomAlert(){
    this.getNextStories(this.counter);
  }

  /**
   * Call the itemRetrievalService to get the next batch of stories. Make sure
   * not to do this if we are already waiting on another batch
   * @param startPosition 
   * @returns 
   */
  getNextStories(startPosition: number){
    if(this.waitingOnResponse){
      return;
    }
    this.waitingOnResponse = true;
    this.itemRetrievalService.getNextStories(startPosition, this.STORIES_TO_RECEIVE);
  }

  private setShowMenu(size: ScreenSize){
    this.showMenu = size === ScreenSize.Large;
  }
}