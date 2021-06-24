import { Component, DebugElement, ViewChild } from '@angular/core';
import { ThySelectionListChange } from './selection.interface';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ThyListModule } from '../list.module';
import { By } from '@angular/platform-browser';
import { ThyListOptionComponent, ThyListLayout } from '../../shared/option';
import { ThySelectionListComponent } from './selection-list';
import { FormsModule } from '@angular/forms';
import { dispatchKeyboardEvent, dispatchMouseEvent } from 'ngx-tethys/testing';
import { DOWN_ARROW, SHIFT, SPACE } from 'ngx-tethys/util';

export function createFakeEvent(type: string, canBubble = false, cancelable = true) {
    const event = document.createEvent('Event');
    event.initEvent(type, canBubble, cancelable);
    return event;
}

describe('ThySelectionList without forms', () => {
    describe('with list option', () => {
        let fixture: ComponentFixture<SelectionListWithListOptionsComponent>;
        let listOptions: DebugElement[];
        let selectionList: DebugElement;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [FormsModule, ThyListModule],
                declarations: [
                    SelectionListWithListOptionsComponent,
                    SelectionListWithListOptionsDefaultComponent,
                    SelectionListWithListOptionsByObjectTypeValueComponent
                ]
            });

            TestBed.compileComponents();
        }));

        beforeEach(async(() => {
            fixture = TestBed.createComponent(SelectionListWithListOptionsComponent);
            fixture.detectChanges();
            listOptions = fixture.debugElement.queryAll(By.directive(ThyListOptionComponent));
            selectionList = fixture.debugElement.query(By.directive(ThySelectionListComponent));
        }));

        it('should be able to set a value on a list option', () => {
            fixture.detectChanges();
            const optionValues = ['inbox', 'starred', 'sent-mail', 'drafts'];

            optionValues.forEach((optionValue, index) => {
                expect(listOptions[index].componentInstance.thyValue).toBe(optionValue);
            });
        });

        it('should emit a selectionChange event if an option got clicked', () => {
            fixture.detectChanges();
            spyOn(fixture.componentInstance, 'onValueChange');

            expect(fixture.componentInstance.onValueChange).toHaveBeenCalledTimes(0);

            listOptions[2].nativeElement.dispatchEvent(createFakeEvent('click'));
            fixture.detectChanges();

            expect(fixture.componentInstance.onValueChange).toHaveBeenCalledTimes(1);
        });

        it('should not has class "thy-grid-list" when thyLayout is list', () => {
            fixture.detectChanges();
            expect(selectionList.nativeElement.classList).not.toContain('thy-grid-list');
            expect(listOptions[0].nativeElement.classList).toContain('thy-list-option');
            expect(listOptions[0].nativeElement.classList).not.toContain('thy-grid-option');
        });

        it('should not has class "thy-grid-list" when thyLayout is null', () => {
            const defaultFixture = TestBed.createComponent(SelectionListWithListOptionsDefaultComponent);
            fixture.detectChanges();
            const defaultListOptions = fixture.debugElement.queryAll(By.directive(ThyListOptionComponent));

            expect(defaultFixture.nativeElement.classList).not.toContain('thy-grid-list');
            expect(defaultListOptions[0].nativeElement.classList).toContain('thy-list-option');
            expect(defaultListOptions[0].nativeElement.classList).not.toContain('thy-grid-option');
        });

        it('should has class "thy-grid-list" when thyLayout is grid', () => {
            const component = fixture.debugElement.componentInstance;
            component.layout = 'grid';
            fixture.detectChanges();
            expect(selectionList.nativeElement.classList).toContain('thy-grid-list');
            expect(listOptions[0].nativeElement.classList).toContain('thy-grid-option');
        });

        it(`should hover first when thyAutoActiveFirstItem is true`, () => {
            const selectionFixture = TestBed.createComponent(SelectionListWithListOptionsComponent);
            selectionFixture.debugElement.componentInstance.autoActiveFirstItem = true;
            const selectionListOptions = selectionFixture.debugElement.queryAll(By.directive(ThyListOptionComponent));
            selectionFixture.detectChanges();
            expect(selectionListOptions[0].nativeElement.classList).toContain('hover');
        });

        it(`should not hover first when thyAutoActiveFirstItem is false`, () => {
            const component = fixture.debugElement.componentInstance;
            component.autoActiveFirstItem = false;
            fixture.detectChanges();
            expect(listOptions[0].nativeElement.classList).not.toContain('hover');
        });

        it(`should hover first when thyAutoActiveFirstItem is true`, () => {
            const defaultFixture = TestBed.createComponent(SelectionListWithListOptionsDefaultComponent);
            defaultFixture.componentInstance.autoActiveFirstItem = true;
            defaultFixture.detectChanges();
            const defaultListOptions = defaultFixture.debugElement.queryAll(By.directive(ThyListOptionComponent));
            expect(defaultListOptions[0].nativeElement.classList).toContain('hover');
        });

        it(`should not hover first when thyAutoActiveFirstItem is false`, () => {
            const defaultFixture = TestBed.createComponent(SelectionListWithListOptionsDefaultComponent);
            defaultFixture.componentInstance.autoActiveFirstItem = false;
            defaultFixture.detectChanges();
            const defaultListOptions = defaultFixture.debugElement.queryAll(By.directive(ThyListOptionComponent));
            expect(defaultListOptions[0].nativeElement.classList).not.toContain('hover');
        });

        it('should select / clear all option when invoke selectAll / deselectAll function', fakeAsync(() => {
            fixture.detectChanges();

            const totalOptionsCount = fixture.debugElement.queryAll(By.css(`thy-list-option`)).length;
            const buttons = Array.from((fixture.debugElement.nativeElement as HTMLElement).querySelectorAll('button'));

            dispatchMouseEvent(buttons[0], 'click');
            expect(fixture.componentInstance.selectedValues.length).toEqual(totalOptionsCount);
            dispatchMouseEvent(buttons[1], 'click');
            expect(fixture.componentInstance.selectedValues.length).toEqual(0);
        }));

        it('should add thy-list-sm class when thySize is sm', fakeAsync(() => {
            fixture.detectChanges();
            const selectionList = getSelectionList();
            expect(selectionList.nativeElement.classList.contains('thy-list-sm')).toBeFalsy();
            fixture.componentInstance.size = 'sm';
            fixture.detectChanges();

            const selectionListSM = fixture.debugElement.query(By.css('.thy-list-sm'));
            expect(selectionListSM).not.toBeNull();
        }));

        it('should toggle active class when thySpaceKeyEnabled is true and press space', fakeAsync(() => {
            fixture.detectChanges();
            const options = Array.from((fixture.debugElement.nativeElement as HTMLElement).querySelectorAll('thy-list-option'));
            expect(options[0].classList.contains('active')).toBeFalsy();
            dispatchMouseEvent(options[0], 'click');
            fixture.detectChanges();
            expect(options[0].classList.contains('active')).toBeTruthy();
            dispatchKeyboardEvent(options[0], 'keydown', SPACE);
            fixture.detectChanges();
            expect(options[0].classList.contains('active')).toBeTruthy();
            fixture.componentInstance.spaceKeyEnabled = true;
            fixture.detectChanges();
            dispatchMouseEvent(options[0], 'click');
            fixture.detectChanges();
            expect(options[0].classList.contains('active')).toBeFalsy();
            dispatchKeyboardEvent(options[0], 'keydown', SPACE);
            fixture.detectChanges();

            expect(options[0].classList.contains('active')).toBeTruthy();
        }));

        it('should invoke toggleOption when press keyboard', fakeAsync(async () => {
            fixture.componentInstance.spaceKeyEnabled = true;

            fixture.detectChanges();
            const toggleOption = spyOn(fixture.componentInstance.thySelectionListComponent, 'toggleOption');
            expect(toggleOption).toHaveBeenCalledTimes(0);
            const options = Array.from((fixture.debugElement.nativeElement as HTMLElement).querySelectorAll('thy-list-option'));

            dispatchMouseEvent(options[0], 'click');
            fixture.detectChanges();

            dispatchKeyboardEvent(options[0], 'keydown', SPACE);
            fixture.detectChanges();
            expect(toggleOption).toHaveBeenCalledTimes(2);
            fixture.componentInstance.stopKeyBoardEvent = true;
            fixture.detectChanges();
            dispatchKeyboardEvent(options[0], 'keydown', SPACE);
            expect(toggleOption).toHaveBeenCalledTimes(2);
        }));

        it('should show basic type value when option value is object and uniqueKey is exist', () => {
            const objectFixture = TestBed.createComponent(SelectionListWithListOptionsByObjectTypeValueComponent);
            objectFixture.detectChanges();
            const options = Array.from((objectFixture.debugElement.nativeElement as HTMLElement).querySelectorAll('thy-list-option'));
            dispatchMouseEvent(options[0], 'click');
            objectFixture.detectChanges();
            const selectedValue = objectFixture.componentInstance.selectedValue;
            expect(selectedValue).toEqual(objectFixture.componentInstance.options[0]);
        });

        it('should update selectionModel', async () => {
            const selectedValue = ['inbox', 'starred'];
            fixture.detectChanges();
            fixture.componentInstance.selectedValues = selectedValue;
            fixture.detectChanges();
            await fixture.whenStable();
            const selectionModel = fixture.componentInstance.thySelectionListComponent.selectionModel;

            expect(selectionModel.selected).toEqual(selectedValue);

            fixture.detectChanges();
            fixture.componentInstance.uniqueKey = 'noneExistKey';
            fixture.componentInstance.selectedValues = ['starred'];

            fixture.detectChanges();
            await fixture.whenStable();
            expect(selectionModel.selected[0]).toBeUndefined();
        });

        function getSelectionList() {
            return fixture.debugElement.query(By.css('.thy-selection-list'));
        }
    });
});

@Component({
    template: `
        <thy-selection-list
            id="selection-list-1"
            [thySize]="size"
            [thySpaceKeyEnabled]="spaceKeyEnabled"
            [thyLayout]="layout"
            (thySelectionChange)="onValueChange($event)"
            [thyMultiple]="isMultipleSelectedMode"
            [(ngModel)]="selectedValues"
            [thyAutoActiveFirstItem]="autoActiveFirstItem"
            [thyBeforeKeydown]="thyBeforeKeydown"
            [thyUniqueKey]="uniqueKey"
        >
            <thy-list-option thyValue="inbox">
                Inbox (disabled selection-option)
            </thy-list-option>
            <thy-list-option id="testSelect" class="test-native-focus" thyValue="starred">
                Starred
            </thy-list-option>
            <thy-list-option thyValue="sent-mail">
                Sent Mail
            </thy-list-option>
            <thy-list-option thyValue="drafts" *ngIf="showLastOption">
                Drafts
            </thy-list-option>
        </thy-selection-list>
        <button (click)="selectAll()">选择全部</button>
        <button (click)="deselectAll()">清除全部</button>
    `
})
class SelectionListWithListOptionsComponent {
    @ViewChild(ThySelectionListComponent, { static: true }) thySelectionListComponent: ThySelectionListComponent;

    showLastOption = true;

    size = '';

    uniqueKey = '';

    spaceKeyEnabled = false;

    layout: ThyListLayout = 'list';

    autoActiveFirstItem = false;

    selectedValues: string[] | string = [];

    isMultipleSelectedMode: boolean = true;

    stopKeyBoardEvent = false;

    thyBeforeKeydown = () => {
        return !this.stopKeyBoardEvent;
    };

    onValueChange(_change: ThySelectionListChange) {}

    selectAll() {
        this.thySelectionListComponent.selectAll();
    }

    deselectAll() {
        this.thySelectionListComponent.deselectAll();
    }
}

@Component({
    template: `
        <thy-selection-list
            #selectionList
            id="selection-list-1"
            [thyAutoActiveFirstItem]="autoActiveFirstItem"
            (thySelectionChange)="onValueChange($event)"
            [thyMultiple]="isMultipleSelectedMode"
        >
            <thy-list-option thyValue="inbox">
                Inbox (disabled selection-option)
            </thy-list-option>
            <thy-list-option id="testSelect" class="test-native-focus" thyValue="starred">
                Starred
            </thy-list-option>
            <thy-list-option thyValue="sent-mail">
                Sent Mail
            </thy-list-option>
            <thy-list-option thyValue="drafts">
                Drafts
            </thy-list-option>
        </thy-selection-list>
    `
})
class SelectionListWithListOptionsDefaultComponent {
    autoActiveFirstItem = false;

    onValueChange(_change: ThySelectionListChange) {}
}

@Component({
    template: `
        <thy-selection-list
            id="selection-list-2"
            (thySelectionChange)="onValueChange($event)"
            [thyMultiple]="false"
            [(ngModel)]="selectedValue"
            thyUniqueKey="id"
        >
            <thy-list-option *ngFor="let option of options" [thyValue]="option">
                {{ option.displayName }}
            </thy-list-option>
        </thy-selection-list>
    `
})
class SelectionListWithListOptionsByObjectTypeValueComponent {
    @ViewChild(ThySelectionListComponent, { static: true }) thySelectionListComponent: ThySelectionListComponent;

    selectedValue: { displayName: string; id: string };

    options = [
        {
            displayName: '苹果',
            id: 'banana'
        },
        {
            displayName: '香蕉',
            id: 'apple'
        },
        {
            displayName: '橘子',
            id: 'cherry'
        },
        {
            displayName: '樱桃',
            id: 'orange'
        }
    ];

    onValueChange(_change: ThySelectionListChange) {}
}
