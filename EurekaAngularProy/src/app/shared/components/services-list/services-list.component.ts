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

@Component({
  selector: 'cs-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss'],
})
export class ServicesListComponent implements AfterViewInit, AfterViewChecked {
  @Input() onlyEdit = false;
  @Input() showSaveAll = true;
  @Input() empty = false;
  @Input() message = '';
  @Output() add = new EventEmitter();
  @Output() finish = new EventEmitter();
  additionalButtons = false;
  constructor(private element: ElementRef, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.resize();
  }

  ngAfterViewChecked() {
    this.resize();
  }

  @HostListener('window:resize')
  resize() {
    this.cdr.detectChanges();

    this.additionalButtons =
      this.element.nativeElement.offsetHeight > window.innerHeight + 50;
  }
}
