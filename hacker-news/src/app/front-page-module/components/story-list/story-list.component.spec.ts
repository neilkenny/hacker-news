import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Post } from 'src/app/shared-module/models/post.model';
import { StoryListComponent } from './story-list.component';

describe('StoryListComponent', () => {
  let fixture: ComponentFixture<StoryListComponent>;
  let component: StoryListComponent;
  let posts: Post[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[],
      declarations:[
        StoryListComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(StoryListComponent);
    component = fixture.componentInstance;

  });

  describe('when the component is initialized', () => {
    let rows: any[];
    beforeEach(() => {
      posts = [
        {  by: 'mockUser1', descendants: 10, id: 123, kids: [], score: 456, time: 1626604555, title: 'Mock Post 1', type: 'story', url: 'http://mock-story1.example.com',  totalComments: 42 },
        {  by: 'mockUser2', descendants: 20, id: 234, kids: [ 45678 ], score: 20, time: 1626608555, title: 'Mock Post 2', type: 'story', url: 'http://mock-story2.example.com',  totalComments: 12 }
      ];
      component.stories = posts;
      component.scrollThreshold = 30;
      // fromEventSpy = spyOnProperty(rxjs, 'fromEvent').and.callThrough();
      // const fromEventSpy = spyOnProperty(rxjs, 'fromEvent').and.returnValue(() => rxjs.of({}));
      fixture.detectChanges();
      rows = fixture.nativeElement.querySelectorAll('tr');
    });

    it('should render a row for each story', () => {
      expect(rows.length).toBe(2);
    });

    it('should render the correct content on each row', () => {

      function verifyRow(rowData: HTMLElement[]){
        const statBoxRegex =  `<stat-box.*></stat-box>`;
        const storySummaryRegex = `<story-summary .*></story-summary>`;
        const transparentButtonRegex = `<tranparent-button *.>×</tranparent-button>`;
        expect(rowData.length).toBe(4);
        expect(rowData[0].innerHTML.match(statBoxRegex)).toBeDefined();
        expect(rowData[1].innerHTML.match(statBoxRegex)).toBeDefined();
        expect(rowData[2].innerHTML.match(storySummaryRegex)).toBeDefined();
        expect(rowData[3].innerHTML.match(transparentButtonRegex)).toBeDefined();
      }

      const firstStoryData = rows[0].querySelectorAll('td');
      const secondStoryData  = rows[1].querySelectorAll('td');
      verifyRow(firstStoryData);
      verifyRow(secondStoryData);
    });

    describe('when the list is scrolled', () => {
      let isEventTriggered: boolean;
      beforeEach(() => {
        isEventTriggered = false;
        component.nearBottom.subscribe(() => {
          isEventTriggered = true;
        })
      });

     describe('but not below the threshold', () => {
       beforeEach(() => {
        // I can't seem to trigger the scroll event in any way, I don't like this
        // way of doing it but it tests the functionality 
        (component.storyListElement as any) = {
          nativeElement: { scrollTop: 250, scrollHeight: 1000, clientHeight: 300}          
        }
        component.onScroll();
       });

       it('should not trigger the nearBottom event', () => {
         expect(isEventTriggered).toBe(false);
       });
     });

     describe('to a point after the threshold', () => {
      beforeEach(() => {
        (component.storyListElement as any) = {
          nativeElement:{ scrollTop: 690, scrollHeight: 1000, clientHeight: 300 }
        }
        component.onScroll();
       });

       it('should trigger the nearBottom event', () => {
        expect(isEventTriggered).toBe(true);
      });
     });

     describe('when the removeItem method is called', () => {
       beforeEach(() => {
         component.removePost(component.stories![0]);
       });

       it('should remove the item from the list', () => {
         expect(component.stories?.length).toBe(1);
         expect(component.stories![0].id).toBe(234);
       });
     });
    });
  });


});