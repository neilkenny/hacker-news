import { Component, Input } from '@angular/core';

@Component({
  selector: 'stat-box',
  templateUrl: 'stat-box.component.html',
  styleUrls: ['stat-box.component.scss']
})
export class StatsBoxComponent{
  @Input() text: string = "";
  @Input() score: number | undefined;
}