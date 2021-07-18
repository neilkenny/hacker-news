import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Post } from 'src/app/shared-module/models/post.model';
import { StorySummaryComponent } from './story-summary.component';

describe('StorySummaryComponent', () => {
  let fixture: ComponentFixture<StorySummaryComponent>;
  let component: StorySummaryComponent;
  let post: Post;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[],
      declarations:[
        StorySummaryComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StorySummaryComponent);
    component = fixture.componentInstance;
    post = {  by: 'mockUser1', descendants: 10, id: 123, kids: [], score: 456, time: 1626604555, title: 'Mock Post 1', type: 'story', url: 'http://mock-story1.example.com',  totalComments: 42 };
    component.post = post;
    fixture.detectChanges();
  });

  describe('when the component is initialized', () => {
    it('should render a link using the title and url data', () => {
      const element: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
      expect(element).toBeDefined();
      expect(element.href).toBe(`${post.url}/`);
      expect(element.innerText).toBe(post.title);
    });

    it('should render a link using the title and url data', () => {
      const element: HTMLElement = fixture.nativeElement.querySelector('.posted-by');
      expect(element).toBeDefined();
      expect(element.innerText).toBe(`posted by ${post.by}`);
    });
  });
});