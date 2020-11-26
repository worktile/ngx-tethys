import { ThySelectionListComponent } from './selection-list';
import { ThyListOptionComponent } from 'ngx-tethys/core';

export interface ThySelectionListChange<TValue = any> {
    source: ThySelectionListComponent;
    option: ThyListOptionComponent;
    value: TValue;
    event: Event;
    selected: boolean;
}
