import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FrontPageModule } from './front-page-module/front-page.module';
import { SharedModule } from './shared-module/shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FrontPageModule,
    SharedModule,
    HttpClientModule,
    NgbModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
