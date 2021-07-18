import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { LinkItem } from 'src/app/shared-module/models/link.model';
import { Post } from 'src/app/shared-module/models/post.model';
import { ScreenSize } from 'src/app/shared-module/models/screen-size.model';
import { MenuLinksService } from 'src/app/shared-module/services/menu-links.service';
import { ResponsiveDisplayService } from 'src/app/shared-module/services/responsive-display.service';
import { ItemRetrievalService } from '../../services/item-retrieval.service';
import { FrontPageComponent } from './front-page.component';

describe('FrontPageComponent', () => {
  let fixture: ComponentFixture<FrontPageComponent>;
  let component: FrontPageComponent;
  let posts: Post[];
  let mockItemRetrievalService: any;
  let mockMenuLinksService: any;
  let mockResponsiveDisplayService: any;
  let storiesSubject: Subject<Post[]>;
  let resolveGetMenuItems: any;
  beforeEach(() => {

    storiesSubject = new Subject<Post[]>();

    mockItemRetrievalService = {
      stories: storiesSubject,
      getNextStories: jasmine.createSpy('getNextStories')
    };

    const getMenuItemsPromise = new Promise(resolve => resolveGetMenuItems = resolve);
    mockMenuLinksService = {
      getMenuLinks: jasmine.createSpy('getMenuLinks').and.returnValue(getMenuItemsPromise)
    };
    
    mockResponsiveDisplayService = {
      screenSizeUpdates: {
        subscribe: jasmine.createSpy('subscribe')
      },
      currentScreenMode: ScreenSize.Small
    };

    TestBed.configureTestingModule({
      imports:[],
      declarations:[
        FrontPageComponent
      ],
      providers: [
        { provide: ItemRetrievalService, useValue: mockItemRetrievalService },
        { provide: MenuLinksService, useValue: mockMenuLinksService },
        { provide: ResponsiveDisplayService, useValue: mockResponsiveDisplayService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FrontPageComponent);
    component = fixture.componentInstance;
    posts = [
      {  by: 'mockUser1', descendants: 10, id: 123, kids: [], score: 456, time: 1626604555, title: 'Mock Post 1', type: 'story', url: 'http://mock-story1.example.com',  totalComments: 42 },
      {  by: 'mockUser2', descendants: 20, id: 234, kids: [ 45678 ], score: 20, time: 1626608555, title: 'Mock Post 2', type: 'story', url: 'http://mock-story2.example.com',  totalComments: 12 }
    ];
  });

  describe('when the screen is in small mode', () => {
    runTests(ScreenSize.Small, false);
    
  });

  describe('when the screen is in medium mode', () => {
    runTests(ScreenSize.Medium, false);
  });

  describe('when the screen is in large mode', () => {
    runTests(ScreenSize.Large, true);
  });


  function runTests(screenMode: ScreenSize, isMenuShown: boolean){
    beforeEach(() => {
      mockResponsiveDisplayService.currentScreenMode = screenMode;
    });

    describe('when the component is initialized', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should subscribe to changes to the screen size', () => {
        expect(mockResponsiveDisplayService.screenSizeUpdates.subscribe).toHaveBeenCalled();
      });

      it('should use the itemsRetrievalService to get the first batch of stories', () => {
        expect(mockItemRetrievalService.getNextStories).toHaveBeenCalledWith(0, 30);
      });

      it('should show/hide the links menu', () => {
        expect(component.showMenu).toBe(isMenuShown);
        if(isMenuShown){
          expect(fixture.nativeElement.querySelector('links-menu')).toBeDefined();
        }
        else{
          expect(fixture.nativeElement.querySelector('links-menu')).toBeNull();
        }
        
      });

      describe('when the menu links are returned', () => {
        let menuLinks: LinkItem[]
        beforeEach(waitForAsync(() => {
          menuLinks = [
            { text:'link1', url: 'http://mocklink1.example.com', active: true },
            { text:'link2', url: 'http://mocklink2.example.com', active: false }
          ];

          resolveGetMenuItems(menuLinks);
        }));

        it('should set the menuLinks', () => {
          expect(component.menuLinks).toBe(menuLinks);
        });
      });

      describe('when the stories are passed to the observable', () => {
        let shownStories: Post[];
        beforeEach(waitForAsync(() => {
          component.stories$?.subscribe((retrievedStories) => {
            shownStories = retrievedStories;
          });

          storiesSubject.next(posts);
        }));

        it('should show the stories that are passed to the component', () => {
          expect(shownStories).toBe(posts);
        });

        describe('when the nearBottom event is fired', () => {
          
          beforeEach(() => {
            component.onNearBottomAlert();
          });

          it('should call the item retrieval service to get the next batch of stories', () => {
            expect(mockItemRetrievalService.getNextStories).toHaveBeenCalledWith(shownStories.length, 30);
          });

          describe('when the next stories are retrieved', () => {
            let nextStories: Post[];
            beforeEach(() => {
              nextStories = [
                {  by: 'mockUser3', descendants: 10, id: 345, kids: [365, 34574], score: 456, time: 1626604555, title: 'Mock Post 3', type: 'story', url: 'http://mock-story3.example.com',  totalComments: 42 },
                {  by: 'mockUser4', descendants: 20, id: 456, kids: [ 324 ], score: 20, time: 1626608555, title: 'Mock Post 4', type: 'story', url: 'http://mock-story4.example.com',  totalComments: 12 }
              ]; 
              
              storiesSubject.next(nextStories);
            });

            it('should add the new stories to the list of stories', () => {
              expect(shownStories).toEqual([...posts, ...nextStories]);
            });
          });
        });
      });
    });
  }
});