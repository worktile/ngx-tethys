import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'thy-rate-clear-example',
    templateUrl: './clear.component.html'
})
export class ThyRateClearExampleComponent implements OnInit {
    value = 3;

    constructor() {}

    ngOnInit() {}

    change(event: number) {}
}
