import { Component, OnInit } from '@angular/core';
import { LinkItem } from '../../models/link.model';
import { ScreenSize } from '../../models/screen-size.model';
import { MenuLinksService } from '../../services/menu-links.service';
import { ResponsiveDisplayService } from '../../services/responsive-display.service';

@Component({
  selector: 'header-component',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})
export class HeaderComponent implements OnInit {
  links: LinkItem[] = [];
  showLogo: boolean = true;
  showMenu: boolean = true;

  constructor(private menuLinksService: MenuLinksService, private responsiveDisplayService: ResponsiveDisplayService){

  }
  
  /**
   * Get the current screen size mode
   * Subscribe to get screen size mode changes
   * Get the menu links using an good old-fashioned promise
   */
  ngOnInit(){
    this.onScreenSizeChanged(this.responsiveDisplayService.currentScreenMode!);

    this.responsiveDisplayService.screenSizeUpdates.subscribe(this.onScreenSizeChanged.bind(this));

    this.menuLinksService.getMenuLinks().then((links: LinkItem[]) => {
      this.links = links
    });
  }

  private onScreenSizeChanged(size: ScreenSize){
      this.showLogo = size != ScreenSize.Small;
      this.showMenu = size != ScreenSize.Large;
  }
}