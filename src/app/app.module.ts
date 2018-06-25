import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BoxPlotWithLineModule } from '../../projects/box-plot-with-line/src/public_api';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BoxPlotWithLineModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
