import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'cs-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss'],
  imports: [ButtonDirective, Ripple],
})
export class ServicesListComponent implements AfterViewInit, AfterViewChecked {
  @Input() onlyEdit = false;
  @Input() showSaveAll = true;
  @Input() empty = false;
  @Input() message = '';
  @Output() add = new EventEmitter();
  @Output() finish = new EventEmitter();
  additionalButtons = false;

  constructor(
    private readonly element: ElementRef<HTMLElement>,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.resize();
  }

  ngAfterViewChecked() {
    this.resize();
  }

  @HostListener('window:resize')
  resize() {
    this.additionalButtons =
      this.element.nativeElement.offsetHeight > window.innerHeight + 50;
    this.cdr.detectChanges();
  }
}
