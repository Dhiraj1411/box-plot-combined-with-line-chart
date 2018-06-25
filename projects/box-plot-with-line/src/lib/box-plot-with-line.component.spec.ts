import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxPlotWithLineComponent } from './box-plot-with-line.component';

describe('BoxPlotWithLineComponent', () => {
  let component: BoxPlotWithLineComponent;
  let fixture: ComponentFixture<BoxPlotWithLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxPlotWithLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxPlotWithLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
