import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatsBoxComponent } from './stat-box.component';

describe('StatsBoxComponent', () => {
  let fixture: ComponentFixture<StatsBoxComponent>;
  let component: StatsBoxComponent;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[],
      declarations:[
        StatsBoxComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StatsBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when the component is initialized', () => {
    it('should render the stats correctly', () => {
      component.score = 99;
      component.text = "mock stat";
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.statistic-container').innerText).toBe('99');
      expect(fixture.nativeElement.querySelector('.text-container').innerText).toBe('mock stat');
    });
  });
});