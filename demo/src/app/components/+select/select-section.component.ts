
import { Component } from '@angular/core';
import { tap, delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { taskTypes } from './mock-data';

@Component({
    selector: 'demo-select-section',
    templateUrl: './select-section.component.html',
    styleUrls: [
        './select-section.scss'
    ]
})
export class DemoSelectSectionComponent {

    model = {
        selectedValue: '',
        allowClear: false
    };

    allowClear = false;

    selectedItem1: any;

    selectedItem2: any;

    selectedItem3 = '';

    selectedItem4 = [
        '5b0527cfc8f2ff200a33d4aa',
        '5b0527cfc8f2ff200a33d4ab'
    ];

    expand = false;

    showSearch = false;

    optionData = [];

    selectedItem = this.optionData[0];

    public apiParameters = [
        {
            property: 'thySize',
            description: '大小，sm | md | lg',
            type: 'String',
            default: ''
        },
        {
            property: 'thyShowSearch',
            description: '下拉列表是否显示搜索框',
            type: 'boolean',
            default: 'false'
        },
        {
            property: 'thyPlaceHolder',
            description: '选择框默认文字',
            type: 'string',
            default: ''
        },
        {
            property: 'thyServerSearch',
            description: '是否使用服务端搜索，当为 true 时，将不再在前端进行过滤',
            type: 'boolean',
            default: 'false'
        },
        {
            property: 'thyOnSearch',
            description: '搜索时回调',
            type: '(searchText:string)=>{}'
        },
        {
            property: 'thyMode',
            description: '下拉选择模式',
            type: '"" | multiple',
            default: ''
        },
        {
            property: 'thyAllowClear',
            description: '单选(thyMode=""或者不设置)时，选择框支持清除',
            type: 'boolean',
            default: 'false'
        },
        {
            property: 'thyShowOptionMenu',
            description: '是否默认展开下拉菜单',
            type: 'boolean',
            default: 'false'
        },
        {
            property: 'thyEmptyStateText',
            description: '数据为空时显示的提示文字',
            type: 'string',
            default: ''
        }
    ];

    public optionApiParameters = [
        {
            property: 'thyValue',
            description: '每个option的value值',
            type: 'string',
            default: ''
        },
        {
            property: 'thyLabelText',
            description: '每个option的label，用于显示',
            type: 'string',
            default: ''
        },
        {
            property: 'thyShowOptionCustom',
            description: '是否自定义展示option内容',
            type: 'boolean',
            default: 'false'
        },
        {
            property: 'thySearchKey',
            description: '传入搜索需要的关键字，支持多个关键字（“{{display_name}},{{name}},{{pin_yin}}”），如不传则默认按照label进行搜索,此为前端过滤',
            type: 'string',
            default: ''
        },
        {
            property: 'thyDisabled',
            description: '是否禁用',
            type: 'boolean',
            default: 'false'
        }
    ];

    constructor(
    ) {
        this.selectedItem3 = '003';
        setTimeout(() => {
            this.optionData = taskTypes;
        }, 2000);
    }

    change() {
        console.log(`select change value as :${this.model.selectedValue}`);
    }

    changeSelect() {
        console.log('success');
    }

    searchTextChange(event: any) {
        console.log(event);
    }

    selectMultiple() {
        console.log(this.selectedItem4);
    }

    clearSelected() {
        this.selectedItem4 = [];
    }
}
