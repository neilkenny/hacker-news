import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { LinksMenuComponent } from './components/links-menu/links-menu.component';
import { StatsBoxComponent } from './components/stat-box/stat-box.component';
import { TransparentButtonComponent } from './components/transparent-button/transparent-button.component';
import { MenuLinksService } from './services/menu-links.service';
import { ResponsiveDisplayService } from './services/responsive-display.service';

@NgModule({
  declarations:[
    LinksMenuComponent,
    StatsBoxComponent,
    HeaderComponent,
    TransparentButtonComponent
  ],
  providers:[
    ResponsiveDisplayService,
    MenuLinksService
  ],
  imports:[
    CommonModule,
  ],
  exports:[
    LinksMenuComponent,
    StatsBoxComponent,
    HeaderComponent,
    TransparentButtonComponent
  ]
})
export class SharedModule {
  
}