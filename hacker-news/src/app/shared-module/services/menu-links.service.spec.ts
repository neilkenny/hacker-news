import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { MenuLinksService } from './menu-links.service';

describe('MenuLinksService', () => {
  let service: MenuLinksService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [

      ],
      providers: [
        MenuLinksService
      ]
    }).compileComponents();
    service = TestBed.inject(MenuLinksService);
    httpMock =TestBed.inject(HttpTestingController);
  });

  describe('when getMenuItems is called', () => {
    let mockLinks: any[], returnedLinks: any[] | null;
    beforeEach(waitForAsync(() => {
      mockLinks = ['link1', 'link2']
      service.getMenuLinks().then((links: any[]) => {
        returnedLinks = links;
      });
      httpMock.expectOne('/assets/links.json').flush(mockLinks);
    }));

    it('should return the links', () => {
      expect(returnedLinks).toBe(mockLinks);
    });

    describe('when it is called after the items are cached', () => {
      beforeEach(waitForAsync(() => {
        returnedLinks = null;
        service.getMenuLinks().then((links: any[]) => {
          returnedLinks = links;
        });
        httpMock.expectNone('/assets/links.json');
      }));

      it('should also return the links', () => {
        expect(returnedLinks).toBe(mockLinks);
      });
    });
  });
});

