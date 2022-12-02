import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'cs-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss'],
})
export class ServicesListComponent implements OnInit, AfterViewInit {
  @Input() edit = false;
  @Input() empty = false;
  @Output() add = new EventEmitter();
  @Output() finish = new EventEmitter();
  additionalButtons = false;
  constructor(private element: ElementRef, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.resize();
  }

  ngOnInit(): void {}

  @HostListener('window:resize')
  resize() {
    this.additionalButtons =
      this.element.nativeElement.offsetHeight > window.innerHeight + 50;
    this.cdr.detectChanges();
  }
}
