import { NgxTethysModule } from 'ngx-tethys';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ThyGuiderBasicExampleComponent } from './basic/basic.component';
import { ThyGuiderHintWithoutTargetExampleComponent } from './hint-without-target/hint-without-target.component';
import { ThyGuiderBasicHintExampleComponent } from './basic-hint/basic-hint.component';
import { ThyGuiderCustomHintExampleComponent } from './custom-hint/custom-hint.component';
import { ThyGuiderMultiStepHintExampleComponent } from './multi-step-hint/multi-step-hint.component';

const COMPONENTS = [
    ThyGuiderBasicExampleComponent,
    ThyGuiderBasicHintExampleComponent,
    ThyGuiderHintWithoutTargetExampleComponent,
    ThyGuiderCustomHintExampleComponent,
    ThyGuiderMultiStepHintExampleComponent
];

@NgModule({
    declarations: [...COMPONENTS],
    entryComponents: [...COMPONENTS],
    imports: [CommonModule, NgxTethysModule],
    exports: [...COMPONENTS]
})
export class ThyGuiderExamplesModule {}
