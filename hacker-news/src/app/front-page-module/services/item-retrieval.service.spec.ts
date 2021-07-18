import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { ItemRetrievalService } from './item-retrieval.service';
import { Post } from 'src/app/shared-module/models/post.model';

describe('ItemRetrievalService', () => {
  let service: ItemRetrievalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [

      ],
      providers: [
        ItemRetrievalService
      ]
    }).compileComponents();
    service = TestBed.inject(ItemRetrievalService);
    httpMock =TestBed.inject(HttpTestingController);
  });

  describe('when getNextStories is called', () => {
    testItemRetrieval(0, 4, true);
  });

  function testItemRetrieval(startNumber: number, amount: number, firstCall: boolean) {
    let items: any[];
    let stories: any;
    let topStories: number[];
    beforeEach(() => {
      topStories = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      items = [];
      service.stories.subscribe((retrievedStories: Post[]) => {
        stories = retrievedStories;
      });
  
      service.getNextStories(startNumber, amount);
  
      if(firstCall){
        const req = httpMock.expectOne(`https://hacker-news.firebaseio.com/v0/topstories.json`);
        req.flush(topStories);
      }
  
      const requests = [];
  
      for(let i=startNumber; i<startNumber+amount; i++){
        items.push({post:topStories[i]});
        requests.push(httpMock.expectOne(`https://hacker-news.firebaseio.com/v0/item/${topStories[i]}.json`));
      }
      requests.forEach((request, index) => request.flush(items[index]))
    });
  
    afterEach(() => {
      httpMock.verify();
    });
  
    it('should merge all the items into one response', () => {
      expect(stories).toEqual(items);
    });

    if(firstCall){
      describe('when the items have been cached', () => {
        // after the first call the top stories are cached so test again
        testItemRetrieval(4, 4, false);        
      });
    }
    
  }
  
  

});
  
  
