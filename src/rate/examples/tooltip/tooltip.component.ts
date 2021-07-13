import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'thy-rate-tooltip-example',
    templateUrl: './tooltip.component.html'
})
export class ThyRateTooltipExampleComponent implements OnInit {
    value = 4;

    tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

    constructor() {}

    ngOnInit() {}
}
