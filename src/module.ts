import { warnDeprecation } from 'ngx-tethys/util';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { ThyActionMenuModule } from 'ngx-tethys/action-menu';
import { ThyAffixModule } from 'ngx-tethys/affix';
import { ThyAlertModule } from 'ngx-tethys/alert';
import { ThyAnchorModule } from 'ngx-tethys/anchor';
import { ThyArrowSwitcherModule } from 'ngx-tethys/arrow-switcher';
import { ThyAutocompleteModule } from 'ngx-tethys/autocomplete';
import { ThyAvatarModule } from 'ngx-tethys/avatar';
import { ThyBackTopModule } from 'ngx-tethys/back-top';
import { ThyBadgeModule } from 'ngx-tethys/badge';
import { ThyBreadcrumbModule } from 'ngx-tethys/breadcrumb';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyCardModule } from 'ngx-tethys/card';
import { ThyCascaderModule } from 'ngx-tethys/cascader';
import { ThyCheckboxModule } from 'ngx-tethys/checkbox';
import { ThySelectCommonModule } from 'ngx-tethys/shared';
import { ThySharedModule } from 'ngx-tethys/shared';
import { ThyDatePickerModule } from 'ngx-tethys/date-picker';
import { ThyDateRangeModule } from 'ngx-tethys/date-range';
import { ThyDialogModule } from 'ngx-tethys/dialog';
import { ThyDragDropModule } from 'ngx-tethys/drag-drop';
import { ThyDropdownModule } from 'ngx-tethys/dropdown';
import { ThyCopyModule } from 'ngx-tethys/copy';
import { ThyEmptyModule } from 'ngx-tethys/empty';
import { ThyFlexibleTextModule } from 'ngx-tethys/flexible-text';
import { ThyFormModule } from 'ngx-tethys/form';
import { ThyTableModule } from 'ngx-tethys/table';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyInputModule } from 'ngx-tethys/input';
import { ThyLabelModule } from 'ngx-tethys/label';
import { ThyLayoutModule } from 'ngx-tethys/layout';
// import { ThyKeySelectModule } from 'ngx-tethys/key-select';
import { ThyListModule } from 'ngx-tethys/list';
import { ThyLoadingModule } from 'ngx-tethys/loading';
import { ThyMarkdownModule } from 'ngx-tethys/markdown';
import { ThyMentionModule } from 'ngx-tethys/mention';
import { ThyMenuModule } from 'ngx-tethys/menu';
import { ThyNavModule } from 'ngx-tethys/nav';
import { ThyNotifyModule } from 'ngx-tethys/notify';
import { ThyPaginationModule } from 'ngx-tethys/pagination';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThyProgressModule } from 'ngx-tethys/progress';
import { ThyPropertyOperationModule } from 'ngx-tethys/property-operation';
import { ThyRadioModule } from 'ngx-tethys/radio';
import { ThyRasterModule } from 'ngx-tethys/raster';
import { ThyResultModule } from 'ngx-tethys/result';
import { ThySelectModule } from 'ngx-tethys/select';
import { ThySkeletonModule } from 'ngx-tethys/skeleton';
import { ThySlideModule } from 'ngx-tethys/slide';
import { ThyStatisticModule } from 'ngx-tethys/statistic';
import { ThyStepperModule } from 'ngx-tethys/stepper';
import { ThyStrengthModule } from 'ngx-tethys/strength';
import { ThySwitchModule } from 'ngx-tethys/switch';
import { ThyTimePickerModule } from 'ngx-tethys/time-picker';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { ThyTransferModule } from 'ngx-tethys/transfer';
import { ThyTreeSelectModule } from 'ngx-tethys/tree-select';
import { ThyTreeModule } from 'ngx-tethys/tree';
import { ThyUploaderModule } from 'ngx-tethys/uploader';
import { ThyVoteModule } from 'ngx-tethys/vote';
import { ThySliderModule } from 'ngx-tethys/slider';
import { ThyCalendarModule } from 'ngx-tethys/calendar';
import { ThyTimelineModule } from 'ngx-tethys/timeline';
import { ThyDividerModule } from 'ngx-tethys/divider';
import { ThyFullscreenModule } from 'ngx-tethys/fullscreen';
import { ThyGuiderModule } from 'ngx-tethys/guider';
import { ThyResizableModule } from 'ngx-tethys/resizable';
import { ThyRateModule } from 'ngx-tethys/rate';

const IMPORT_EXPORT_MODULES = [
    ThyLayoutModule,
    ThyButtonModule,
    ThyBackTopModule,
    ThyIconModule,
    ThyPopoverModule,
    ThyBadgeModule,
    ThyTableModule,
    ThyRasterModule,
    ThyAvatarModule,
    ThyLabelModule,
    ThyNavModule,
    ThyMenuModule,
    ThyPaginationModule,
    ThyNotifyModule,
    ThyCardModule,
    ThyLoadingModule,
    ThyAlertModule,
    ThyActionMenuModule,
    ThyTreeModule,
    ThyEmptyModule,
    ThySwitchModule,
    ThyTransferModule,
    ThyStrengthModule,
    ThyFormModule,
    ThyInputModule,
    ThyDropdownModule,
    ThyCopyModule,
    ThyCheckboxModule,
    ThySelectModule,
    ThySlideModule,
    ThyRadioModule,
    ThySelectModule,
    ThyPropertyOperationModule,
    ThyUploaderModule,
    ThyDateRangeModule,
    ThySharedModule,
    ThyListModule,
    ThyTreeSelectModule,
    ThyStepperModule,
    ThyCascaderModule,
    ThyDialogModule,
    ThyTooltipModule,
    ThyProgressModule,
    ThyBreadcrumbModule,
    ThyArrowSwitcherModule,
    ThyMarkdownModule,
    ThyFlexibleTextModule,
    ThyDragDropModule,
    ThySelectCommonModule,
    ThySkeletonModule,
    ThyVoteModule,
    ThyResultModule,
    ThyMentionModule,
    ThyDatePickerModule,
    ThyTimelineModule,
    ThyDividerModule,
    ThyTimePickerModule,
    ThyStatisticModule,
    ThyAutocompleteModule,
    ThyAnchorModule,
    ThyAffixModule,
    ThySliderModule,
    ThyCalendarModule,
    ThyFullscreenModule,
    ThyGuiderModule,
    ThyResizableModule,
    ThyRateModule
];

/**
 * @deprecated root module is deprecated, please use component module
 */
@NgModule({
    declarations: [],
    imports: [...IMPORT_EXPORT_MODULES],
    exports: IMPORT_EXPORT_MODULES,
    providers: []
})
export class NgxTethysModule {
    constructor() {
        warnDeprecation(
            'The NgxTethysModule is deprecated, please use second entry point, we will remove main entry point in next major version'
        );
    }
    static forRoot(): ModuleWithProviders<NgxTethysModule> {
        return {
            ngModule: NgxTethysModule,
            providers: []
        };
    }
}
