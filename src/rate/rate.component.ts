import {
    Component,
    forwardRef,
    OnInit,
    Input,
    ChangeDetectorRef,
    Output,
    EventEmitter,
    SimpleChanges,
    OnChanges,
    TemplateRef,
    ChangeDetectionStrategy
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { InputBoolean, InputNumber } from 'ngx-tethys/core';
import { helpers } from 'ngx-tethys/util';

const noop = () => {};

// tslint:disable-next-line: class-name
export interface classStyleTypeInfo {
    [key: string]: boolean;
}

@Component({
    selector: 'thy-rate',
    templateUrl: './rate.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ThyRateComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThyRateComponent implements ControlValueAccessor, OnInit, OnChanges {
    private _value = 0;

    private currentValue = 0;

    private hasHalf = false;

    public rateArray: number[] = [];

    public rateStyleArray: classStyleTypeInfo[] = [];

    private icons: string | TemplateRef<any> | string[] | TemplateRef<any>[] = null;

    public iconValue: string = null;

    public iconTemplate: TemplateRef<any> = null;

    private onTouchedCallback: () => void = noop;

    private onChangeCallback: (_: any) => void = noop;

    @Input() @InputNumber() thyCount = 5;

    @Input() @InputBoolean() thyDisabled = false;

    @Input() @InputBoolean() thyAllowHalf = false;

    @Input() @InputBoolean() thyAllowClear = true;

    @Input() thyTooltips: string[] = [];

    @Input('thyIconTemplate')
    set thyIconTemplate(value: string | TemplateRef<any> | string[] | TemplateRef<any>[]) {
        this.icons = value;
        if (!this.icons) {
            this.iconValue = null;
            this.iconTemplate = null;
        } else {
            this.setIconTemplate();
        }
    }

    @Output() readonly thyItemHoverChange = new EventEmitter<number>();

    constructor(private cdr: ChangeDetectorRef) {}

    get thyValue(): number {
        return this._value;
    }

    set thyValue(value: number) {
        if (this._value === value) {
            return;
        }
        this._value = value;
        this.hasHalf = !Number.isInteger(value);
        this.currentValue = Math.ceil(value);
    }

    writeValue(value: number): void {
        this.thyValue = value || 0;
        this.updateRateArray();
        this.cdr.markForCheck();
    }

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges): void {
        const { thyCount, thyValue } = changes;
        if (thyCount) {
            this.updateRateArray();
        }

        if (thyValue) {
            this.updateItemStyle();
        }
        this.cdr.detectChanges();
    }

    itemHover(isHalf: boolean, index: number): void {
        if (this.thyDisabled || (this.currentValue === index + 1 && this.hasHalf === isHalf)) {
            return;
        }
        this.currentValue = index + 1;
        this.hasHalf = isHalf;
        const _value = isHalf ? Number(this.currentValue - 0.5) : this.currentValue;
        this.thyItemHoverChange.emit(_value);
        this.updateItemStyle();
    }

    itemClick(isHalf: boolean, index: number) {
        if (this.thyDisabled) {
            return;
        }
        this.currentValue = index + 1;
        const _value = isHalf ? index + 1 - 0.5 : index + 1;
        if (this.thyValue === _value) {
            if (this.thyAllowClear) {
                this.thyValue = 0;
                this.onChangeCallback(this.thyValue);
            }
        } else {
            this.thyValue = _value;
            this.onChangeCallback(this.thyValue);
        }
        this.updateItemStyle();
    }

    onRateLeave(event: Event): void {
        event.stopPropagation();
        this.hasHalf = !Number.isInteger(this.thyValue);
        this.currentValue = Math.ceil(this.thyValue);
        this.updateItemStyle();
    }

    updateRateArray(): void {
        this.rateArray = Array(this.thyCount)
            .fill(0)
            .map((_, i) => {
                return i;
            });
        this.updateItemStyle();
    }

    updateItemStyle(): void {
        this.updateIcon();
        const rateStyle = 'thy-rate-star';
        this.rateStyleArray = this.rateArray.map(i => {
            const value = i + 1;
            return {
                [`${rateStyle}--full`]: value < this.currentValue || (value === this.currentValue && !this.hasHalf),
                [`${rateStyle}--half`]: this.hasHalf && value === this.currentValue,
                [`${rateStyle}--active`]: this.hasHalf && value === this.currentValue,
                [`${rateStyle}--zero`]: value > this.currentValue
            };
        });
    }

    updateIcon(): void {
        if (!this.icons) {
            this.iconValue = null;
            this.iconTemplate = null;
        } else {
            this.setIconTemplate();
        }
    }

    setIconTemplate(): void {
        if (helpers.isArray(this.icons) && this.icons.length > 0) {
            const currentIcon = (this.currentValue && this.currentValue - 1) || 0;
            if (this.icons[currentIcon] instanceof TemplateRef) {
                this.iconTemplate = this.icons[currentIcon] as TemplateRef<any>;
            } else {
                this.iconValue = this.icons[currentIcon] as string;
            }
        } else if (!helpers.isArray(this.icons)) {
            if (this.icons instanceof TemplateRef) {
                this.iconTemplate = this.icons;
            } else {
                this.iconValue = this.icons;
            }
        }
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }

    trackByFn(index: number, item: any) {
        return item || index;
    }
}
