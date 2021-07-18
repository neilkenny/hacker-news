import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ResponsiveDisplayService } from './responsive-display.service';
import { RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ScreenSize } from '../models/screen-size.model';

describe('ResponsiveDisplayService', () => {
  let service: ResponsiveDisplayService;
  let mockRendererFactory: any;
  let mockRenderer: any;
  let mockDocument: any;
  let unsubscribed: any;

  beforeEach(() => {
    function unsubscribe() {
      unsubscribed = true;
    };

    mockRenderer = {
      listen: jasmine.createSpy('listen').and.returnValue(unsubscribe)
    };

    mockRendererFactory = {
      createRenderer: jasmine.createSpy('createRenderer').and.returnValue(mockRenderer)
    };

    mockDocument = {
      defaultView: {
        innerWidth: 1920
      }
    };

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [

      ],
      providers: [
        ResponsiveDisplayService,
        { provide: RendererFactory2, useValue: mockRendererFactory },
        { provide: DOCUMENT, useValue: mockDocument },
      ]
    }).compileComponents();
    service = TestBed.inject(ResponsiveDisplayService);
  });

  describe('when the service is constructed', () => {
  
    it('should subscribe to the window resize events', () => {
      expect(mockRendererFactory.createRenderer).toHaveBeenCalledWith(null, null);
      expect(mockRenderer.listen).toHaveBeenCalledWith("window", "resize", jasmine.any(Function));
    });

    it('should set the current screen size', () => {
      expect(service.currentScreenMode).toBe(ScreenSize.Large);
    });

    describe('when the screen size changes to small', () => {
      let handler: any;
      let mockEvent: any;
      let currentScreenMode: ScreenSize;
      let changeCount: number;

      beforeEach(() => {
        changeCount = 0;
        mockEvent = {
          target: {
            innerWidth: 500
          }
        };

        service.screenSizeUpdates.subscribe((screenMode: ScreenSize) => {
          changeCount++;
          currentScreenMode = screenMode;
        })

        handler = mockRenderer.listen.calls.mostRecent().args[2];
        handler(mockEvent);
      });

      it('should notify subscribers', () => {
        expect(changeCount).toBe(1);
        expect(currentScreenMode).toBe(ScreenSize.Small);
      });

      describe('when the screen size changes to medium', () => {
        beforeEach(() => {
          mockEvent.target.innerWidth = 800;
          handler(mockEvent);
        });

        it('should notify subscribers', () => {
          expect(changeCount).toBe(2);
          expect(currentScreenMode).toBe(ScreenSize.Medium);
        });

        describe('when the screen size changes to large', () => {
          beforeEach(() => {
            mockEvent.target.innerWidth = 1900;
            handler(mockEvent);
          });

          it('should notify subscribers', () => {
            expect(changeCount).toBe(3);
            expect(currentScreenMode).toBe(ScreenSize.Large);
          });

          describe('when the screen size changes but doesn\'t cross a threshold', () => {
            beforeEach(() => {
              mockEvent.target.innerWidth = 1950;
              handler(mockEvent);
            });

            it('should not notify subscribers', () => {
              expect(changeCount).toBe(3);
              expect(currentScreenMode).toBe(ScreenSize.Large);
            });
          });

          describe('when the service is destroyed', () => {
            beforeEach(() => {
              service.ngOnDestroy();
            });

            it('should clean up', () => {
              expect(unsubscribed).toBe(true);
            });
          });
        });
      });
    });
  });
});

