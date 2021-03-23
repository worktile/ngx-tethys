import { Component, HostBinding, OnInit, Renderer2 } from '@angular/core';

@Component({
    selector: 'thy-select-custom-basic-example',
    templateUrl: './custom-basic.component.html',
    styles: [
        `
            .custom-basic-container {
                height: 200px;
                overflow-y: auto;
            }
        `
    ]
})
export class ThySelectCustomBasicExampleComponent implements OnInit {
    @HostBinding('class.d-block') class = true;

    thySize = '';

    thyMode = 'multiple';

    showSearch = false;

    allowClear = false;

    disabled = false;

    placeholder = 'select a person';

    listOfOption: Array<{ label: string; value: string }> = [];

    listOfSelectedValue = ['a10', 'c12'];

    constructor(private renderer: Renderer2) {}

    ngOnInit() {
        const children: Array<{ label: string; value: string }> = [];
        for (let i = 10; i < 36; i++) {
            children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
        }
        children.push({ label: '张三', value: 'zhangsan' });
        this.listOfOption = children;
    }

    get isMultiple(): boolean {
        return this.thyMode === 'multiple';
    }

    set isMultiple(value: boolean) {
        if (value) {
            this.thyMode = 'multiple';
        } else {
            this.thyMode = '';
        }
    }

    hasBackdrop = false;

    switchClear() {
        this.allowClear = !this.allowClear;
    }
}
