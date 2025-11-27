import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
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

  readonly onlyEdit = input(false);
  readonly showSaveAll = input(true);
  readonly empty = input(false);
  readonly message = input('');
  readonly add = output();
  readonly finish = output();
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
