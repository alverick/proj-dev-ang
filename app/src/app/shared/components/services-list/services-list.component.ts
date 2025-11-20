import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
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
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() onlyEdit = false;
  @Input() showSaveAll = true;
  @Input() empty = false;
  @Input() message = '';
  @Output() add = new EventEmitter();
  @Output() finish = new EventEmitter();
  additionalButtons = false;

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
