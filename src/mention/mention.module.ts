import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThyMentionDirective } from './mention.directive';
import { ThyMentionSuggestionsComponent } from './suggestions/suggestions.component';
import { ThyPopoverModule } from '../popover';
import { ThyListModule } from '../list';

@NgModule({
    declarations: [ThyMentionDirective, ThyMentionSuggestionsComponent],
    imports: [CommonModule, ThyPopoverModule, ThyListModule],
    exports: [ThyMentionDirective],
    providers: [],
    entryComponents: [ThyMentionSuggestionsComponent]
})
export class ThyMentionModule {}
