import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    Input,
    TemplateRef,
    EventEmitter,
    Output,
    HostBinding,
    NgZone,
    ChangeDetectorRef,
    OnDestroy,
    OnChanges,
    Inject
} from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import { throttleTime, takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { fadeMotion, ThyScrollService } from 'ngx-tethys/core';

@Component({
    selector: 'thy-back-top,[thyBackTop]',
    templateUrl: './back-top.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    animations: [fadeMotion]
})
export class ThyBackTopComponent implements OnInit, OnDestroy, OnChanges {
    @HostBinding('class.thy-back-top-container') classNames = true;

    @Input() thyTemplate?: TemplateRef<void>;

    @Input() thyVisibilityHeight = 400;

    @Input() thyContainer?: string | HTMLElement;

    @Output() readonly thyClick: EventEmitter<boolean> = new EventEmitter();

    @Output() public visibleChange: EventEmitter<boolean> = new EventEmitter();

    public visible = false;

    private scrollListenerDestroy$ = new Subject();

    private target: HTMLElement | null = null;

    constructor(
        @Inject(DOCUMENT) private doc: any,
        private thyScrollService: ThyScrollService,
        private platform: Platform,
        private cdr: ChangeDetectorRef,
        private zone: NgZone
    ) {}

    ngOnInit(): void {
        this.registerScrollEvent();
    }

    clickBackTop(): void {
        this.thyScrollService.scrollTo(this.getTarget(), 0);
        this.thyClick.emit(true);
    }

    private getTarget(): HTMLElement | Window {
        return this.target || window;
    }

    private handleScroll(): void {
        if (this.visible === this.thyScrollService.getScroll(this.getTarget()) > this.thyVisibilityHeight) {
            return;
        }
        this.visible = !this.visible;
        this.cdr.detectChanges();
        this.zone.run(() => {
            this.visibleChange.emit(this.visible);
        });
    }

    private registerScrollEvent(): void {
        if (!this.platform.isBrowser) {
            return;
        }
        this.scrollListenerDestroy$.next();
        this.handleScroll();
        this.zone.runOutsideAngular(() => {
            fromEvent(this.getTarget(), 'scroll')
                .pipe(throttleTime(50), takeUntil(this.scrollListenerDestroy$))
                .subscribe(() => this.handleScroll());
        });
    }

    ngOnDestroy(): void {
        this.scrollListenerDestroy$.next();
        this.scrollListenerDestroy$.complete();
    }

    ngOnChanges(changes: any): void {
        const { thyContainer } = changes;
        if (thyContainer) {
            this.target = typeof this.thyContainer === 'string' ? this.doc.querySelector(this.thyContainer) : this.thyContainer;
            this.registerScrollEvent();
        }
    }
}
