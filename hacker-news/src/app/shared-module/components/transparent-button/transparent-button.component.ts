import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Simple component using inline template/styles and the <ng-content> tag to allow child content
 */
@Component({
  selector: 'tranparent-button',
  template: '<button (click)="onClicked($event)" [style.color]="color"><ng-content></ng-content></button>',
  styles: [
    `button { 
      background-color: transparent; 
      border: 0;
    } `,
    
  ]
})
export class TransparentButtonComponent {
  @Output() click: EventEmitter<Event> = new EventEmitter<Event>();
  @Input() color: string = '#EEE';

  onClicked(event: Event){
    this.click.emit(event);
  }
}