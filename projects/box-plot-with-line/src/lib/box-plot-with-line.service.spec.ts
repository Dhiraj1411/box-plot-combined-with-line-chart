import { TestBed, inject } from '@angular/core/testing';

import { BoxPlotWithLineService } from './box-plot-with-line.service';

describe('BoxPlotWithLineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoxPlotWithLineService]
    });
  });

  it('should be created', inject([BoxPlotWithLineService], (service: BoxPlotWithLineService) => {
    expect(service).toBeTruthy();
  }));
});
