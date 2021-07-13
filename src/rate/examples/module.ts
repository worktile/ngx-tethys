import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxTethysModule } from 'ngx-tethys';
import { FormsModule } from '@angular/forms';
import { ThyRateBasicExampleComponent } from './basic/basic.component';
import { ThyRateTemplateExampleComponent } from './template/template.component';
import { ThyRateHalfExampleComponent } from './half/half.component';
import { ThyRateDisabledExampleComponent } from './disabled/disabled.component';
import { ThyRateClearExampleComponent } from './clear/clear.component';
import { ThyRateCountExampleComponent } from './count/count.component';
import { ThyRateTooltipExampleComponent } from './tooltip/tooltip.component';

const COMPONENTS = [
    ThyRateBasicExampleComponent,
    ThyRateTemplateExampleComponent,
    ThyRateHalfExampleComponent,
    ThyRateDisabledExampleComponent,
    ThyRateClearExampleComponent,
    ThyRateCountExampleComponent,
    ThyRateTooltipExampleComponent
];

@NgModule({
    declarations: [...COMPONENTS],
    entryComponents: [...COMPONENTS],
    imports: [CommonModule, FormsModule, NgxTethysModule],
    exports: [...COMPONENTS],
    providers: []
})
export class ThyRateExamplesModule {
    constructor() {}
}
