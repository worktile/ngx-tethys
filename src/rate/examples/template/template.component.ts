import { AfterViewInit, ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
    selector: 'thy-rate-template-example',
    templateUrl: './template.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThyRateTemplateExampleComponent implements AfterViewInit {
    @ViewChild('icon1') icon1: TemplateRef<any>;

    @ViewChild('icon2') icon2: TemplateRef<any>;

    @ViewChild('icon3') icon3: TemplateRef<any>;

    @ViewChild('icon4') icon4: TemplateRef<any>;

    @ViewChild('icon5') icon5: TemplateRef<any>;

    value = 1;

    iconsTemplate: TemplateRef<any>[] = null;

    template: TemplateRef<any> = null;

    constructor() {}

    ngAfterViewInit(): void {
        this.iconsTemplate = [this.icon1, this.icon2, this.icon3, this.icon4, this.icon5];
        this.template = this.icon5;
    }
}
