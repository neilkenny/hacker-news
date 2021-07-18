import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransparentButtonComponent } from './transparent-button.component';

describe('TransparentButtonComponent', () => {
  let fixture: ComponentFixture<TransparentButtonComponent>;
  let component: TransparentButtonComponent;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[],
      declarations:[
        TransparentButtonComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransparentButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when the button is clicked', () => {
    let wasButtonClicked: Boolean;
    beforeEach(() => {
      wasButtonClicked = false;
      component.click.subscribe(() => {
        wasButtonClicked = true;
      })
      fixture.nativeElement.querySelector('button').click();
      fixture.detectChanges();
    });

    it('should fire the click event', () => {
      expect(wasButtonClicked).toBe(true);
    });
  });
});