module.exports = [
    {
        type: 'component',
        name: 'thy-rate',
        description: '评分组件',
        properties: [
            {
                name: 'thyCount',
                description: '自定义评分的总数',
                type: 'number',
                default: '5'
            },
            {
                name: 'thyDisabled',
                description: '是否只读',
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'thyAllowHalf',
                description: '是否允许半选',
                type: 'boolean',
                default: 'false'
            },
            {
                name: 'thyAllowClear',
                description: '是否允许再次点击后清除',
                type: 'boolean',
                default: 'true'
            },
            {
                name: 'thyTooltips',
                description: '自定义每项的提示信息',
                type: 'string[]',
                default: '-'
            },
            {
                name: 'thyIconTemplate',
                description: `自定义模版，目前支持传单个模版或图标名称、数组(模版 | 图标名称)`,
                type: 'TemplateRef|string[] | TemplateRef | string',
                default: '-'
            },
            {
                name: '[(ngModel)]',
                description: '绑定当前值',
                type: 'number',
                default: '0'
            },
            {
                name: 'ngModelChange',
                description: '当前值改变时的回调',
                type: 'EventEmitter<number>',
                default: '-'
            },
            {
                name: 'thyItemHoverChange',
                description: '当前值hover时的回调',
                type: 'EventEmitter<number>',
                default: '-'
            }
        ]
    }
];
