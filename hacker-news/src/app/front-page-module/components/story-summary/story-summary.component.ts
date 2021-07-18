import { Component, Input } from '@angular/core';
import { Post } from 'src/app/shared-module/models/post.model';

@Component({
  selector: 'story-summary',
  templateUrl: 'story-summary.component.html',
  styleUrls: ['story-summary.component.scss']
})
export class StorySummaryComponent {
  @Input() post: Post | undefined;
}