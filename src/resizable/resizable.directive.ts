import { Directive, AfterViewInit, OnDestroy, ElementRef, Renderer2, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { Constructor, ThyUnsubscribe, MixinBase, mixinUnsubscribe, InputBoolean } from 'ngx-tethys/core';
import { ThyResizableService } from './resizable.service';
import { Platform } from '@angular/cdk/platform';
import { takeUntil } from 'rxjs/operators';
import { ThyResizeHandleMouseDownEvent } from './resize-handle.component';
import { ThyResizeEvent } from './interface';
import { getEventWithPoint, ensureInBounds } from './utils';

const _MixinBase: Constructor<ThyUnsubscribe> & typeof MixinBase = mixinUnsubscribe(MixinBase);

@Directive({
    selector: '[thyResizable]',
    providers: [ThyResizableService],
    host: {
        class: 'thy-resizable',
        '[class.thy-resizable-resizing]': 'resizing',
        '[class.thy-resizable-disabled]': 'thyDisabled',
        '(mouseenter)': 'onMouseenter()',
        '(mouseleave)': 'onMouseleave()'
    }
})
export class ThyResizableDirective extends _MixinBase implements AfterViewInit, OnDestroy {
    @Input() thyBounds: 'window' | 'parent' | ElementRef<HTMLElement> = 'parent';
    @Input() thyMaxHeight?: number;
    @Input() thyMaxWidth?: number;
    @Input() thyMinHeight: number = 40;
    @Input() thyMinWidth: number = 40;
    @Input() thyGridColumnCount: number = -1;
    @Input() thyMaxColumn: number = -1;
    @Input() thyMinColumn: number = -1;
    @Input() @InputBoolean() thyLockAspectRatio: boolean = false;
    @Input() @InputBoolean() thyPreview: boolean = false;
    @Input() @InputBoolean() thyDisabled: boolean = false;

    @Output() readonly thyResize = new EventEmitter<ThyResizeEvent>();
    @Output() readonly thyResizeEnd = new EventEmitter<ThyResizeEvent>();
    @Output() readonly thyResizeStart = new EventEmitter<ThyResizeEvent>();

    resizing = false;
    private el!: HTMLElement;
    private elRect!: ClientRect | DOMRect;
    private sizeCache: ThyResizeEvent | null = null;
    private ghostElement: HTMLDivElement | null = null;
    private currentHandleEvent: ThyResizeHandleMouseDownEvent | null = null;

    constructor(
        private elementRef: ElementRef<HTMLElement>,
        private renderer: Renderer2,
        private platform: Platform,
        private ngZone: NgZone,
        private thyResizableService: ThyResizableService
    ) {
        super();
        this.thyResizableService.handleMouseDown$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(event => {
            if (this.thyDisabled) {
                return;
            }
            this.resizing = true;
            this.thyResizableService.startResizing(event.mouseEvent);
            this.currentHandleEvent = event;
            this.setCursor();
            this.thyResizeStart.emit({
                mouseEvent: event.mouseEvent
            });
            this.elRect = this.el.getBoundingClientRect();
        });

        this.thyResizableService.documentMouseUp$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(event => {
            if (this.resizing) {
                this.resizing = false;
                this.thyResizableService.documentMouseUp$.next();
                this.endResize(event);
            }
        });

        this.thyResizableService.documentMouseMove$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(event => {
            if (this.resizing) {
                this.resize(event);
            }
        });
    }

    ngAfterViewInit(): void {
        if (this.platform.isBrowser) {
            this.el = this.elementRef.nativeElement;
            this.setPosition();
        }
    }

    setCursor(): void {
        switch (this.currentHandleEvent!.direction) {
            case 'left':
            case 'right':
                this.renderer.setStyle(document.body, 'cursor', 'ew-resize');
                break;
            case 'top':
            case 'bottom':
                this.renderer.setStyle(document.body, 'cursor', 'ns-resize');
                break;
            case 'topLeft':
            case 'bottomRight':
                this.renderer.setStyle(document.body, 'cursor', 'nwse-resize');
                break;
            case 'topRight':
            case 'bottomLeft':
                this.renderer.setStyle(document.body, 'cursor', 'nesw-resize');
                break;
        }
        this.renderer.setStyle(document.body, 'user-select', 'none');
    }

    setPosition(): void {
        const position = getComputedStyle(this.el).position;
        if (position === 'static' || !position) {
            this.renderer.setStyle(this.el, 'position', 'relative');
        }
    }

    onMouseenter(): void {
        this.thyResizableService.mouseEntered$.next(true);
    }

    onMouseleave(): void {
        this.thyResizableService.mouseEntered$.next(false);
    }

    endResize(event: MouseEvent | TouchEvent): void {
        this.renderer.setStyle(document.body, 'cursor', '');
        this.renderer.setStyle(document.body, 'user-select', '');
        this.removeGhostElement();
        const size = this.sizeCache
            ? { ...this.sizeCache }
            : {
                  width: this.elRect.width,
                  height: this.elRect.height
              };
        this.ngZone.run(() => {
            this.thyResizeEnd.emit({
                ...size,
                mouseEvent: event
            });
        });
        this.sizeCache = null;
        this.currentHandleEvent = null;
    }

    resize(event: MouseEvent | TouchEvent): void {
        const elRect = this.elRect;
        const resizeEvent = getEventWithPoint(event);
        const handleEvent = getEventWithPoint(this.currentHandleEvent!.mouseEvent);
        let width = elRect.width;
        let height = elRect.height;
        const ratio = this.thyLockAspectRatio ? width / height : -1;
        switch (this.currentHandleEvent!.direction) {
            case 'bottomRight':
                width = resizeEvent.clientX - elRect.left;
                height = resizeEvent.clientY - elRect.top;
                break;
            case 'bottomLeft':
                width = elRect.width + (handleEvent.clientX - resizeEvent.clientX);
                height = resizeEvent.clientY - elRect.top;
                break;
            case 'topRight':
                width = resizeEvent.clientX - elRect.left;
                height = elRect.height + (handleEvent.clientY - resizeEvent.clientY);
                break;
            case 'topLeft':
                width = elRect.width + (handleEvent.clientX - resizeEvent.clientX);
                height = elRect.height + (handleEvent.clientY - resizeEvent.clientY);
                break;
            case 'top':
                height = elRect.height + (handleEvent.clientY - resizeEvent.clientY);
                break;
            case 'right':
                width = resizeEvent.clientX - elRect.left;
                break;
            case 'bottom':
                height = resizeEvent.clientY - elRect.top;
                break;
            case 'left':
                width = elRect.width + (handleEvent.clientX - resizeEvent.clientX);
        }
        const size = this.calcSize(width, height, ratio);
        this.sizeCache = { ...size };

        if (this.thyPreview) {
            this.previewResize(size);
        }
        this.ngZone.run(() => {
            this.thyResize.emit({
                ...size,
                mouseEvent: event
            });
        });
    }

    calcSize(width: number, height: number, ratio: number): ThyResizeEvent {
        let newWidth: number;
        let newHeight: number;
        let maxWidth: number;
        let maxHeight: number;
        let col = 0;
        let spanWidth = 0;
        let minWidth = this.thyMinWidth;
        let boundWidth = Infinity;
        let boundHeight = Infinity;
        if (this.thyBounds === 'parent') {
            const parent = this.renderer.parentNode(this.el);
            if (parent instanceof HTMLElement) {
                const parentRect = parent.getBoundingClientRect();
                boundWidth = parentRect.width;
                boundHeight = parentRect.height;
            }
        } else if (this.thyBounds === 'window') {
            if (typeof window !== 'undefined') {
                boundWidth = window.innerWidth;
                boundHeight = window.innerHeight;
            }
        } else if (this.thyBounds && this.thyBounds.nativeElement && this.thyBounds.nativeElement instanceof HTMLElement) {
            const boundsRect = this.thyBounds.nativeElement.getBoundingClientRect();
            boundWidth = boundsRect.width;
            boundHeight = boundsRect.height;
        }

        maxWidth = ensureInBounds(this.thyMaxWidth!, boundWidth);
        maxHeight = ensureInBounds(this.thyMaxHeight!, boundHeight);

        if (this.thyGridColumnCount !== -1) {
            spanWidth = maxWidth / this.thyGridColumnCount;
            minWidth = this.thyMinColumn !== -1 ? spanWidth * this.thyMinColumn : minWidth;
            maxWidth = this.thyMaxColumn !== -1 ? spanWidth * this.thyMaxColumn : maxWidth;
        }

        if (ratio !== -1) {
            if (/(left|right)/i.test(this.currentHandleEvent!.direction)) {
                newWidth = Math.min(Math.max(width, minWidth), maxWidth);
                newHeight = Math.min(Math.max(newWidth / ratio, this.thyMinHeight), maxHeight);
                if (newHeight >= maxHeight || newHeight <= this.thyMinHeight) {
                    newWidth = Math.min(Math.max(newHeight * ratio, minWidth), maxWidth);
                }
            } else {
                newHeight = Math.min(Math.max(height, this.thyMinHeight), maxHeight);
                newWidth = Math.min(Math.max(newHeight * ratio, minWidth), maxWidth);
                if (newWidth >= maxWidth || newWidth <= minWidth) {
                    newHeight = Math.min(Math.max(newWidth / ratio, this.thyMinHeight), maxHeight);
                }
            }
        } else {
            newWidth = Math.min(Math.max(width, minWidth), maxWidth);
            newHeight = Math.min(Math.max(height, this.thyMinHeight), maxHeight);
        }

        if (this.thyGridColumnCount !== -1) {
            col = Math.round(newWidth / spanWidth);
            newWidth = col * spanWidth;
        }

        return {
            col,
            width: newWidth,
            height: newHeight
        };
    }

    previewResize({ width, height }: ThyResizeEvent): void {
        this.createGhostElement();
        this.renderer.setStyle(this.ghostElement, 'width', `${width}px`);
        this.renderer.setStyle(this.ghostElement, 'height', `${height}px`);
    }

    createGhostElement(): void {
        if (!this.ghostElement) {
            this.ghostElement = this.renderer.createElement('div');
            this.renderer.setAttribute(this.ghostElement, 'class', 'thy-resizable-preview');
        }

        this.renderer.appendChild(this.el, this.ghostElement);
    }

    removeGhostElement(): void {
        if (this.ghostElement) {
            this.renderer.removeChild(this.el, this.ghostElement);
        }
    }

    ngOnDestroy(): void {
        this.ghostElement = null;
        this.sizeCache = null;
        super.ngOnDestroy();
    }
}
