import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThySharedModule } from 'ngx-tethys/shared';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { ThyRateItemComponent } from './rate-item.component';
import { ThyRateComponent } from './rate.component';

@NgModule({
    imports: [CommonModule, FormsModule, ThySharedModule, ThyIconModule, ThyTooltipModule],
    declarations: [ThyRateComponent, ThyRateItemComponent],
    exports: [ThyRateComponent, ThyRateItemComponent],
    providers: [],
    entryComponents: [ThyRateComponent, ThyRateItemComponent]
})
export class ThyRateModule {}
