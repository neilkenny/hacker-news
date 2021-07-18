import { Component, Input } from '@angular/core';
import { LinkItem } from 'src/app/shared-module/models/link.model';

@Component({
  selector: 'links-menu',
  templateUrl: 'links-menu.component.html',
  styleUrls: ['links-menu.component.scss']
})
export class LinksMenuComponent{ 
  @Input() links: LinkItem[] | undefined;
  @Input() mode: 'vertical' | 'horizontal' = 'vertical';

  constructor(){

  }
}