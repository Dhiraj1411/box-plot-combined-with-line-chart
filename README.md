# Demo : 

https://dhiraj1411.github.io/box-plot-combined-with-line-chart/

# Description : 

Requirement : 
    Box plot will depicts the history.
    Horizontal Straight line shows threshold/expected value.
    Colored line shows the current value. 
        - Color of line depends on position of last node of the line
         e.g 
            - At key "1", the node is in the whiskers range but not in the quartile so the color of line is YELLOW.
            - At key "2", the node lies outside the whiskers so the color of line is "RED".
            - At key "9", the node lies inside the quartile so the color of line is "GREEN".


# BoxPlotWithLineChart

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
