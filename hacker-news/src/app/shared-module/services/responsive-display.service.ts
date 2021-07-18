import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { fromEventPattern, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScreenSize } from '../models/screen-size.model';

/**
 * A 
 */
@Injectable()
export class ResponsiveDisplayService implements OnDestroy{
  private _destroy$ = new Subject();
  private screenMode: Subject<ScreenSize> = new Subject();
  private onResize$: Observable<Event> | undefined;

  currentScreenMode: ScreenSize | undefined;

  constructor(private rendererFactory: RendererFactory2, @Inject(DOCUMENT) document: Document ){
    const renderer = this.rendererFactory.createRenderer(null, null);
    this.createOnResizeObservable(renderer);
    this.currentScreenMode = this.getScreenModeFromSize(document.defaultView!.innerWidth)
  }
  
  /**
   * Cleanup the Subject when we are done
   */
  ngOnDestroy(){
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * This can be subscribed to to get notifications of when we cross a screen-size threshold
   */
  get screenSizeUpdates(): Observable<ScreenSize>{
    return this.screenMode;
  }

  /**
   * I want to receive updates about the window resizing in a service. Normally we could 
   * use the @HostListener annotation but this only works in components. So here I am 
   * using the renderer to create an event listener on the window resize event. I don't
   * want to send every single resize event to subscribers, only when we cross a threshold
   * so I handle the event internally and only send to the screen updates subscriber when 
   * we cross a threshold
   * @param renderer Angular Renderer Service
   */
  private createOnResizeObservable(renderer: Renderer2){
    let removeEventListener: () => void;
    
    const createEventListener = (
      handler: (e: Event) => boolean | void) => {
        removeEventListener = renderer.listen("window", "resize", handler);
      };
    this.onResize$ = fromEventPattern<Event>(createEventListener, () => removeEventListener()).pipe(takeUntil(this._destroy$));
    this.onResize$.subscribe(this.onScreenResized.bind(this));
  }

  /**
   * Here we check if we've crossed a threshold and if so notify subscribers
   * @param event The window resize event
   */
  private onScreenResized(event: Event){
    const updatedScreenMode = this.getScreenModeFromSize((event.target as Window).innerWidth);

    if(updatedScreenMode !== this.currentScreenMode){
      this.currentScreenMode = updatedScreenMode;
      this.screenMode.next(updatedScreenMode)
    }
  }
  
  /**
   * Hardcoded threshold just to have something to use
   * @param width the width of the window
   * @returns The category of the screen size
   */
  private getScreenModeFromSize(width: number): ScreenSize {
    if (width < 600) {
      return ScreenSize.Small;
    }
    else if(width < 1480){
      return ScreenSize.Medium;
    }
    return ScreenSize.Large;
  }
}