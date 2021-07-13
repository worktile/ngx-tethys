import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'thy-rate-basic-example',
    templateUrl: './basic.component.html'
})
export class ThyRateBasicExampleComponent implements OnInit {
    value = 1;

    tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

    constructor() {}

    ngOnInit() {}

    hoverChange(value: number) {
        console.log('===value===', value);
    }
}
