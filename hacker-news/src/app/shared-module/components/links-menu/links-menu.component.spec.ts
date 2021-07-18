import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkItem } from '../../models/link.model';
import { LinksMenuComponent } from './links-menu.component';

describe('LinksMenuComponent', () => {
  let fixture: ComponentFixture<LinksMenuComponent>;
  let component: LinksMenuComponent;
  

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[],
      declarations:[
        LinksMenuComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LinksMenuComponent);
    component = fixture.componentInstance;
    
    fixture.detectChanges();
  });

  describe('when in vertical mode', () => {
    beforeEach(() => {
      component.mode = 'vertical';
    });

    runTests(false);
  });

  describe('when in horizontal mode', () => {
    beforeEach(() => {
      component.mode = 'horizontal';
    });

    runTests(true);
  });

  function runTests(horizontalMode: boolean){
    describe('when the component is initialized', () => {
      let mockLinks: LinkItem[];
   
      beforeEach(() => {
        mockLinks = [
          {active: true, text: 'link1', url: 'http://link1.example.com/'},
          {active: false, text: 'link2', url: 'http://link2.example.com/'},
          {active: false, text: 'link3', url: 'http://link3.example.com/'},
        ];
   
        component.links = mockLinks;
        fixture.detectChanges();
      });

      it('should render the links correctly', () => {
        const links: HTMLAnchorElement[] = fixture.nativeElement.querySelectorAll('a');
        expect(links.length).toBe(3);
        expect(links[0].href).toBe(mockLinks[0].url);
        expect(links[0].innerText).toBe(mockLinks[0].text.toUpperCase());
        expect(links[1].href).toBe(mockLinks[1].url);
        expect(links[1].innerText).toBe(mockLinks[1].text.toUpperCase());
        expect(links[2].href).toBe(mockLinks[2].url);
        expect(links[2].innerText).toBe(mockLinks[2].text.toUpperCase());
      });

      it('should apply the correct style', () => {
        const isInHorizontalMode = fixture.nativeElement.querySelector('ul').classList.contains('horizontal');
        expect(isInHorizontalMode).toEqual(horizontalMode);
      });
   
     });
  }
  
});