import { Component, OnInit } from '@angular/core';
import { BOX_PLOT_DATA, CURRENT_LINE, MEDIAN_LINE } from './boxplotdata';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  configObj = {
    box_plot_data: BOX_PLOT_DATA,
    showLine: true,
    showBoxPlot: true,
    currentLine: CURRENT_LINE,
    medianLine: MEDIAN_LINE
  };
}
