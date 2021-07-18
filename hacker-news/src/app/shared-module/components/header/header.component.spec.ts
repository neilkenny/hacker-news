import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ScreenSize } from '../../models/screen-size.model';
import { MenuLinksService } from '../../services/menu-links.service';
import { ResponsiveDisplayService } from '../../services/responsive-display.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;

  let mockMenuLinksService: any;
  let mockResponsiveDisplayService: any;

  let resolveGetMenuItems: any;
  beforeEach(() => {
    const getMenuItemsPromise = new Promise(resolve => resolveGetMenuItems = resolve);
    mockMenuLinksService = {
      getMenuLinks: jasmine.createSpy('getMenuLinks').and.returnValue(getMenuItemsPromise)
    };

    mockResponsiveDisplayService = {
      currentScreenMode: ScreenSize.Small,
      screenSizeUpdates: {
        subscribe: jasmine.createSpy('subscribe')
      }
    };


    TestBed.configureTestingModule({
      imports:[],
      declarations:[
        HeaderComponent
      ],
      providers:[
        { provide: MenuLinksService, useValue: mockMenuLinksService },
        { provide: ResponsiveDisplayService, useValue: mockResponsiveDisplayService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  runTests(ScreenSize.Small, true, false);
  runTests(ScreenSize.Medium, true, true);
  runTests(ScreenSize.Large, false, true);

  function runTests(screenMode: ScreenSize, isMenuShown: boolean, isLogoShown: boolean){
    describe('when the component is initialized', () => {
      beforeEach(() =>{
        mockResponsiveDisplayService.currentScreenMode = screenMode;
      });

      describe('when the component is initialized', () => {
        beforeEach(() => {
          fixture.detectChanges();
        });

        it('should show/hide the menu', () => {
          expect(component.showMenu).toBe(isMenuShown);
          if(isMenuShown){
            expect(fixture.nativeElement.querySelector('links-menu')).toBeDefined();
          }
          else{
            expect(fixture.nativeElement.querySelector('links-menu')).toBeNull();
          }
        });

        it('should show/hide the logo', () => {
          expect(component.showLogo).toBe(isLogoShown);
          if(isLogoShown){
            expect(fixture.nativeElement.querySelector('.brand')).toBeDefined();
          }
          else{
            expect(fixture.nativeElement.querySelector('.brand')).toBeNull();
          }
        });

        it('should subscribe to the responsiveDisplayService', () => {
          expect(mockResponsiveDisplayService.screenSizeUpdates.subscribe).toHaveBeenCalledWith(jasmine.any(Function));
        });

        it('should get the menu links', () => {
          expect(mockMenuLinksService.getMenuLinks).toHaveBeenCalled();
        });

        describe('when the menu links are returned', () => {
          let mockMenuItems: any[];
          beforeEach(waitForAsync(() => {
            mockMenuItems = ['items']
            resolveGetMenuItems(mockMenuItems);
          }));

          it('should set the menuItems', () => {
            expect(component.links).toBe(mockMenuItems);
          });
        });
      });
    });
  }
});