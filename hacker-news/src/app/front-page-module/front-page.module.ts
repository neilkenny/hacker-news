import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared-module/shared.module';
import { FrontPageComponent } from './components/front-page/front-page.component';
import { StoryListComponent } from './components/story-list/story-list.component';
import { StorySummaryComponent } from './components/story-summary/story-summary.component';
import { ItemRetrievalService } from './services/item-retrieval.service';

@NgModule({
  declarations:[
    FrontPageComponent,
    StoryListComponent,
    StorySummaryComponent
  ],
  providers:[
    ItemRetrievalService
  ],
  imports:[
    CommonModule,
    SharedModule
  ],
  exports:[
    FrontPageComponent
  ]
})
export class FrontPageModule{

}