import { Injectable, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { thyEditorConstant } from './editor.constant';

@Injectable()
export class ThyEditorService implements OnInit, OnDestroy {
    public options = {
        fontSize: '16px',
        theme: 'kuroir',
        maxHeight: 600,
        isHeightFull: false,
        className: '',
        autofocus: true, // 默认聚焦
        type: 'simple', // toolbar按钮显示的类型 ［simple:简易, all:全部按钮］
        locale: 'zh-cn', // 国际化设置
        hideButtons: <any>[],
        additionalButtons: <any>[],
        replaceButtons: <any>[],
        extendButtons: <any>[]
    };
    // public hideButtons: any = []; // 要不显示的图标[]
    // public additionalButtons: any = []; // 扩展的图标 {title:'扩展',className:'fa fa-music',type:'custom',action:musicFn,before:2}
    // public replaceButtons: any = []; // 替换默认的图标 {title:'插入图片',className:'fa fa-file-image-o',type:'custom',action:imageFn,id:17}
    // public extendButtons: any = [];
    public toolbars: any = [];
    public headers: any = [];
    public elementRef: ElementRef;
    public textareaDom: any;
    public previewDom: any;
    public header_action: Boolean = false;
    public isPreview: Boolean = false;

    public tableOptions = {
        table_action: false,
        tableActiveX: 1,
        tableActiveY: 1,
        tableMenu: thyEditorConstant.tableMenu
    };


    constructor() {

    }

    ngOnInit() {

    }

    ngOnDestroy() {

    }

    initGantt() {
        if (mermaid) {
            mermaid.parseError = function (err: any, hash: any) {
                mermaid.error = err;
            };
            mermaid.ganttConfig = {
                // Configuration for Gantt diagrams
                numberSectionStyles: 4,
                axisFormatter: [
                    ['%I:%M', function (d: any) { // Within a day
                        return d.getHours();
                    }],
                    ['w. %U', function (d: any) { // Monday a week
                        return d.getDay() === 1;
                    }],
                    ['%a %d', function (d: any) { // Day within a week (not monday)
                        return d.getDay() && d.getDate() !== 1;
                    }],
                    ['%b %d', function (d: any) { // within a month
                        return d.getDate() !== 1;
                    }],
                    ['%m-%y', function (d: any) { // Month
                        return d.getMonth();
                    }]
                ]
            };
        }
    }

    initMarked() {
        // 设置marked
        const renderer = new liteMarked.Renderer();
        renderer.listitem = function (text: string) {
            if (!/^\[[ x]\]\s/.test(text)) {
                return liteMarked.Renderer.prototype.listitem(text);
            }
            // 任务列表
            const checkbox = $('<input type="checkbox" disabled/>');
            if (/^\[x\]\s/.test(text)) { // 完成的任务列表
                checkbox.attr('checked', true);
            }
            return $(liteMarked.Renderer.prototype.listitem(text.substring(3))).addClass('task-list-item')
                .prepend(checkbox)[0].outerHTML;
        };
        renderer.codespan = function (text: string) { // inline code
            if (/^\$.+\$$/.test(text)) { // inline math
                const raw = /^\$(.+)\$$/.exec(text)[1];
                const line = raw.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
                    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, '\''); // unescape html characters
                try {
                    return katex.renderToString(line, { displayMode: false });
                } catch (err) {
                    return '<code>' + err + '</code>';
                }
            }
            return liteMarked.Renderer.prototype.codespan.apply(this, arguments);
        };
        renderer.code = function (code: any, language: any, escaped: any, line_number: any) {
            code = code.trim();
            const firstLine = code.split(/\n/)[0].trim();
            if (language === 'math') { // 数学公式
                let tex = '';
                code.split(/\n\n/).forEach(function (line: any) { // 连续两个换行，则开始下一个公式
                    line = line.trim();
                    if (line.length > 0) {
                        try {
                            tex += katex.renderToString(line, { displayMode: true });
                        } catch (err) {
                            tex += '<pre>' + err + '</pre>';
                        }
                    }
                });
                return '<div data-line="' + line_number + '">' + tex + '</div>';
            } else if (firstLine === 'gantt' || firstLine === 'sequenceDiagram' || firstLine.match(/^graph (?:TB|BT|RL|LR|TD);?$/)) {
                // mermaid
                if (firstLine === 'sequenceDiagram') {
                    code += '\n'; // 如果末尾没有空行，则语法错误
                }
                if (mermaid && mermaid.parse(code)) {
                    return '<div class="mermaid" data-line="' + line_number + '">' + code + '</div>';
                } else {
                    if (mermaid && mermaid.error) {
                        return '<pre data-line="' + line_number + '">' + mermaid.error + '</pre>';
                    }
                }
            } else {
                return liteMarked.Renderer.prototype.code.apply(this, arguments);
            }
        };
        renderer.html = function (html: string) {
            const result = liteMarked.Renderer.prototype.html.apply(this, arguments);
            const h = $(result.bold());
            return h.html();
        };
        renderer.paragraph = function (text: string) {
            const result = liteMarked.Renderer.prototype.paragraph.apply(this, arguments);
            const h = $(result.bold());
            return h.html();
        };
        liteMarked.setOptions({
            renderer: renderer,
            gfm: true,
            tables: true,
            breaks: true,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: true
        });
    }

    getSelection() {
        return {
            target: this.textareaDom,
            start: this.textareaDom.selectionStart,
            end: this.textareaDom.selectionEnd,
            text: this.textareaDom.value.substring(this.textareaDom.selectionStart, this.textareaDom.selectionEnd)
        };
    }

    hasSelection() {
        if (this.textareaDom.selectionStart === this.textareaDom.selectionEnd) {
            return false;
        } else {
            return true;
        }
    }
    emojiFn(htmlstr: string) {
        return htmlstr.replace(thyEditorConstant.emojRegx, function (match) {
            if (thyEditorConstant.emojis.indexOf(match) !== -1) {
                const name = String(match).slice(1, -1);
                return '<img class="emoji" title=":' + name + ':" alt="' +
                    name + '" src="https://s.tylingsoft.com/emoji-icons/' + name + '.png" width="18" />';
            } else {
                return match;
            }
        });
    }


    insertText(text: string, start: number, end: number) {
        this.textareaDom.focus();
        const leftText = this.textareaDom.value.substring(0, start);
        const rightText = this.textareaDom.value.substring(end);
        this.textareaDom.value = leftText + text + rightText;
    }

    clearSelection() {
        this.textareaDom.selectionStart = this.textareaDom.selectionEnd;
    }

    setFocus(star: number, end: number) {
        setTimeout(() => {
            this.textareaDom.selectionStart = star;
            this.textareaDom.selectionEnd = end;
        });
    }

    isRowFirst(start: number) {
        const val = this.textareaDom.value.substr(0, start);
        const _text = val.substr(val.lastIndexOf('\n') + 1);
        if (_text.length === 0) {
            return true;
        }
        return false;
    }

    getRowText(start: number) {
        const val = this.textareaDom.value.substr(0, start);
        const _text = val.substr(val.lastIndexOf('\n') + 1);
        return _text;
    }

    replaceContent(content: string, sel: any) {
        this.insertText(content, sel.start, sel.end);
        this.textareaDom.focus();
    }
    insertContent(content: string) {
        const sel = this.getSelection();
        this.insertText(content, sel.start, sel.end);
        this.textareaDom.focus();
    }
    getContent() {
        return this.textareaDom.value;
    }

    setOptions(config: {}) {
        if (config) {
            this.options = Object.assign(this.options, config);
        }
    }

    setToolbars() {
        thyEditorConstant.typeArray[this.options.type].forEach((value: string, index: number) => {
            let _tempBtn = thyEditorConstant.allButtons[value];
            if (!_tempBtn) {
                _tempBtn = this.options.extendButtons[value];
            }
            if (_tempBtn) {
                this.toolbars[this.toolbars.length] = _tempBtn;
            }
        });

        thyEditorConstant.typeArray['hs'].forEach((value: string, index: number) => {
            const _tempBtn = thyEditorConstant.allButtons[value];
            if (_tempBtn) {
                this.headers[this.headers.length] = _tempBtn;
            }
        });


        if (this.options.hideButtons.length > 0) {
            this.options.hideButtons.forEach((n: any) => {
                if (n.id) {
                    const _index = this.toolbars.findIndex((t: any) => {
                        return n.id === t.id;
                    });
                    this.toolbars.splice(_index, 1);
                }
            });
        }

        if (this.options.replaceButtons.length > 0) {
            this.options.replaceButtons.forEach((n: any) => {
                if (n.id) {
                    const _index = this.toolbars.findIndex((t: any) => {
                        return n.id === t.id;
                    });
                    this.toolbars.splice(_index, 1, n);
                }
            });
        }

        if (this.options.additionalButtons.length > 0) {
            this.options.additionalButtons.forEach((n: any) => {
                if (n.before) {
                    const _index = this.toolbars.findIndex(this.toolbars, (t: any) => {
                        return t.id === n.before;
                    });
                    this.toolbars.splice(_index, 0, n);
                } else {
                    this.toolbars.push(n);
                }
            });
        }
    }

    initEditor(config: {}, elementRef: ElementRef) {
        this.setOptions(config);
        this.elementRef = elementRef;
        this.textareaDom = this.elementRef.nativeElement.querySelector('.thy-editor-textarea');
        this.previewDom = this.elementRef.nativeElement.querySelector('.thy-editor-container-preview-body');
        this.setToolbars();
        if (this.options.autofocus) {
            setTimeout(() => {
                this.textareaDom.focus();
            }, 200);
        }
        if (this.options.isHeightFull) {
            this.textareaDom.style.height = '100%';
        }
    }

    getLocaleText(key: string) {
        let _locale = thyEditorConstant.language[this.options.locale];
        if (_locale) {
            const _localText = _locale[key];
            if (_localText) {
                return _localText;
            } else {
                console.log('text ' + key + ' none!');
            }
        } else {
            console.log('locale ' + this.options.locale + ' none!');
            _locale = thyEditorConstant.language['zh-cn'];
            const _localText = _locale[key];
            if (_localText) {
                return _localText;
            } else {
                console.log('text ' + key + ' none!');
            }
        }

    }

    insert(flag: any, title: string, sel: any, keepSelection: any, search: any, replace: any) {
        // 有序列表和无序列表选择统一添加
        if (sel.text.indexOf('\n') !== -1 && keepSelection && search && replace) {
            if (sel.text.length > 0) {
                sel = this.getSelection();
            }
            const replaceStr = sel.text.replace(search, replace);
            const _sub = this.getRowText(sel.start);
            this.insertText(replaceStr, sel.start - _sub.length, sel.end);
            this.setFocus(sel.start + replaceStr.length, sel.start + replaceStr.length);
        } else {
            if (sel.text.length > 0) {
                this.clearSelection();
                sel = this.getSelection();
            }
            const _sub = this.getRowText(sel.start);
            this.insertText(flag + ' ' + _sub, sel.start - _sub.length, sel.end);
            this.setFocus(sel.start + flag.length + 1, sel.start + flag.length + 1);
        }
    }

    // 插入markdown
    styleFn(param: string, event: Event) {
        let sel = this.getSelection();
        switch (param) {
            case 'bold':
                if (this.hasSelection()) {
                    if (sel.text.indexOf('\n') !== -1) {
                        sel = this.getSelection();
                        const _str = sel.text.replace(/([^\n]+)([\n\s]*)/g, '**$1**$2');
                        const _sub = this.getRowText(sel.start);
                        this.insertText(_str, sel.start - _sub.length, sel.end);
                        this.setFocus(sel.start + _str.length, sel.start + _str.length);
                    } else {
                        this.insertText(' **' + sel.text + '** ', sel.start, sel.end);
                        this.setFocus(sel.start, sel.start + 6 + sel.text.length);
                    }

                } else {
                    const _sub = this.getRowText(sel.start);
                    if (_sub.length > 0) {
                        this.insertText(' **** ', sel.start, sel.end);
                        this.setFocus(sel.start + 3, sel.start + 3);
                    } else {
                        this.insertText('****', sel.start, sel.end);
                        this.setFocus(sel.start + 2, sel.start + 2);
                    }
                }
                break;
            case 'italic':
                if (this.hasSelection()) {
                    if (sel.text.indexOf('\n') !== -1) {
                        sel = this.getSelection();
                        const _str = sel.text.replace(/([^\n]+)([\n\s]*)/g, '_$1_$2');
                        const _sub = this.getRowText(sel.start);
                        this.insertText(_str, sel.start - _sub.length, sel.end);
                        this.setFocus(sel.start + _str.length, sel.start + _str.length);
                    } else {
                        this.insertText(' *' + sel.text + '* ', sel.start, sel.end);
                        this.setFocus(sel.start, sel.start + 4 + sel.text.length);
                    }
                } else {
                    const _sub = this.getRowText(sel.start);
                    if (_sub.length > 0) {
                        this.insertText(' ** ', sel.start, sel.end);
                        this.setFocus(sel.start + 2, sel.start + 2);
                    } else {
                        this.insertText('**', sel.start, sel.end);
                        this.setFocus(sel.start + 1, sel.start + 1);
                    }
                }
                break;
            case 'underline':
                if (this.hasSelection()) {
                    if (sel.text.indexOf('\n') !== -1) {
                        sel = this.getSelection();
                        const _str = sel.text.replace(/([^\n]+)([\n\s]*)/g, '<u>$1</u>$2');
                        const _sub = this.getRowText(sel.start);
                        this.insertText(_str, sel.start - _sub.length, sel.end);
                        this.setFocus(sel.start + _str.length, sel.start + _str.length);
                    } else {
                        this.insertText('<u>' + sel.text + '</u>', sel.start, sel.end);
                        this.setFocus(sel.start, sel.start + 7 + sel.text.length);
                    }
                } else {
                    this.insertText('<u></u>', sel.start, sel.end);
                    this.setFocus(sel.start + 3, sel.start + 3);
                }
                break;
            case 'strikethrough':
                if (this.hasSelection()) {
                    if (sel.text.indexOf('\n') !== -1) {
                        sel = this.getSelection();
                        const replaceStr = sel.text.replace(/([^\n]+)([\n\s]*)/g, ' ~~$1~~ $2');
                        const _sub = this.getRowText(sel.start);
                        this.insertText(replaceStr, sel.start - _sub.length, sel.end);
                        this.setFocus(sel.start + replaceStr.length, sel.start + replaceStr.length);
                    } else {
                        this.insertText(' ~~' + sel.text + '~~ ', sel.start, sel.end);
                        this.setFocus(sel.start, sel.start + 6 + sel.text.length);
                    }
                } else {
                    const _sub = this.getRowText(sel.start);
                    if (_sub.length > 0) {
                        this.insertText(' ~~~~ ', sel.start, sel.end);
                        this.setFocus(sel.start + 3, sel.start + 3);
                    } else {
                        this.insertText('~~~~', sel.start, sel.end);
                        this.setFocus(sel.start + 2, sel.start + 2);
                    }
                }
                break;
            case 'h1':
                this.insert('#', '', sel, true, /(.+)([\n]?)/g, '\n# $1$2\n');
                this.header_action = false;
                break;
            case 'h2':
                this.insert('##', '', sel, true, /(.+)([\n]?)/g, '\n## $1$2\n');
                this.header_action = false;
                break;
            case 'h3':
                this.insert('###', '', sel, true, /(.+)([\n]?)/g, '\n### $1$2\n');
                this.header_action = false;
                break;
            case 'h4':
                this.insert('####', '', sel, true, /(.+)([\n]?)/g, '\n#### $1$2\n');
                this.header_action = false;
                break;
            case 'h5':
                this.insert('#####', '', sel, true, /(.+)([\n]?)/g, '\n##### $1$2\n');
                this.header_action = false;
                break;
            case 'h6':
                this.insert('######', '', sel, true, /(.+)([\n]?)/g, '\n###### $1$2\n');
                this.header_action = false;
                break;
            case 'hr':
                if (sel.text.length > 0) {
                    this.clearSelection();
                    sel = this.getSelection();
                }
                this.insertText('\n---\n', sel.start, sel.end);
                this.setFocus(sel.start + 5, sel.start + 5);
                break;
            case 'quote':
                this.insert('>', '', sel, true, /(.+)([\n]?)/g, '\n> $1$2');
                break;
            case 'list':
                this.insert('-', '', sel, true, /(.+)([\n]?)/g, '\n- $1$2');
                break;
            case 'list-2':
                this.insert('1.', '', sel, true, /(.+)([\n]?)/g, '\n1. $1$2');
                break;

            case 'square':
                this.insert('- [ ] ', '', sel, true, /(.+)([\n]?)/g, '- [ ] $1$2');
                break;
            case 'check-square':
                this.insert('- [x] ', '', sel, true, /(.+)([\n]?)/g, '- [x] $1$2');
                break;

            case 'link':
                let _iUrl = 'http://example.com';
                let _localText = this.getLocaleText('link-text');
                if (sel.text.length > 0) {
                    if (sel.text.indexOf('http') !== -1) {
                        _iUrl = sel.text;
                    } else {
                        _localText = sel.text;
                    }
                }
                const _aUrl = '[' + _localText + '](' + _iUrl + ')';
                this.insertText(_aUrl, sel.start, sel.end);
                this.setFocus(sel.start + _aUrl.length, sel.start + _aUrl.length);
                break;
            case 'image':
                let _imageText = this.getLocaleText('image-text');
                let iUrl = 'http://lesschat.com/x.png';
                if (sel.text.length > 0) {
                    if (sel.text.indexOf('http') !== -1) {
                        iUrl = sel.text;
                    } else {
                        _imageText = sel.text;
                    }
                }
                const aUrl = '![' + _imageText + '](' + iUrl + ')';
                this.insertText(aUrl, sel.start, sel.end);
                this.setFocus(sel.start + aUrl.length, sel.start + aUrl.length);
                break;
            case 'code':
                if (sel.text.length === 0) {
                    this.insertText('\n```\n  \n```\n', sel.start, sel.end);
                    this.setFocus(sel.start + 6, sel.start + 6);
                } else {
                    this.insertText('`' + sel.text + '`', sel.start, sel.end);
                    this.setFocus(sel.start + 2 + sel.text.length, sel.start + 2 + sel.text.length);
                }
                break;
            case 'table':
                this.tableOptions.table_action = true;
                break;
            case 'math':
                let _mathText = sel.text;
                if (_mathText.length === 0) {
                    _mathText = 'E = mc^2';
                }
                this.insertText('\n```math\n' + _mathText + '\n```\n', sel.start, sel.end);
                this.setFocus(sel.start + _mathText.length + 14, sel.start + _mathText.length + 14);
                break;
            case 'flow':
                let flowText = sel.text;
                if (flowText.length === 0) {
                    flowText = 'graph LR\nA-->B';
                }
                this.insertText('\n```\n' + flowText + '\n```\n', sel.start, sel.end);
                this.setFocus(sel.start + flowText.length + 10, sel.start + flowText.length + 10);
                break;
            case 'diagram':
                let diagramText = sel.text;
                if (diagramText.length === 0) {
                    // text = 'sequenceDiagram\nA->>B: 你好吗?\nB->>A: 我很好3!';
                    diagramText = this.getLocaleText('diagram');
                }
                this.insertText('\n```\n' + diagramText + '\n```\n', sel.start, sel.end);
                this.setFocus(sel.start + diagramText.length + 10, sel.start + diagramText.length + 10);
                break;
            case 'gantt':
                let ganttText = sel.text;
                if (ganttText.length === 0) {
                    // ganttText = $($event.target).data('sample');
                    ganttText = 'gantt\n';
                    ganttText += 'dateFormat YYYY-MM-DD\n';
                    ganttText += 'section S1\n';
                    ganttText += 'T1: 2014-01-01, 9d\n';
                    ganttText += 'section S2\n';
                    ganttText += 'T2: 2014-01-11, 9d';
                    ganttText += 'section S3\n';
                    ganttText += 'T3: 2014-01-02, 9d';
                }
                this.insertText('\n```\n' + ganttText + '\n```\n', sel.start, sel.end);
                this.setFocus(sel.start + ganttText.length + 10, sel.start + ganttText.length + 10);
                break;
        }
        this.setTextareaHeight();
    }

    togglePreview() {

    }

    setTextareaHeight() {
        if (this.options.isHeightFull) {
            return;
        }
        let _height = this.textareaDom.scrollHeight;
        if (_height > this.options.maxHeight) {
            _height = this.options.maxHeight + 'px';
        }
        this.textareaDom.style.height = _height + 'px';
    }

    setTable(x: number, y: number, action: boolean) {
        this.tableOptions.tableActiveX = x;
        this.tableOptions.tableActiveY = y;
        this.tableOptions.table_action = action;
    }

    insertTable() {
        const cols = this.tableOptions.tableActiveY;
        const rows = this.tableOptions.tableActiveX + 1;
        let _header = this.getLocaleText('col');
        let _header_hr = '---';
        let _row = this.getLocaleText('row');

        for (let i = 0; i < cols; i++) {
            _header += '| ' + this.getLocaleText('col') + ' ';
            _header_hr += '| --- ';
            _row += '| ' + this.getLocaleText('row') + ' ';
        }
        let _str = '';
        for (let i = 0; i < rows; i++) {
            _str += _row + '\n';
        }

        const sample = _header + '\n' + _header_hr + '\n' + _str;
        let sel = this.getSelection();
        if (sel.text.length > 0) {
            this.clearSelection();
            sel = this.getSelection();
        }
        if (this.isRowFirst(sel.start)) {
            this.insertText('\n' + sample + '\n\n', sel.start, sel.end);
            this.setFocus(sel.start + sample.length + 2, sel.start + sample.length + 2);
        } else {
            this.insertText('\n\n' + sample + '\n\n', sel.start, sel.end);
            this.setFocus(sel.start + sample.length + 4, sel.start + sample.length + 4);
        }
        this.tableOptions.table_action = false;
        this.setTextareaHeight();
    }

    // parseMarked(value: string) {
    //     if (liteMarked) {
    //         return liteMarked(value);
    //     }

    // }

    // parseMermaid() {
    //     if (mermaid) {
    //         mermaid.init();
    //     }
    // }

    // previewHTML() {
    //     let _value: any = this.parseMarked(this.textareaDom.value);
    //     _value = this.emojiFn(_value);
    //     this.parseMermaid();
    //     this.textareaDom.focus();
    // }

    clear() {

    }
}
