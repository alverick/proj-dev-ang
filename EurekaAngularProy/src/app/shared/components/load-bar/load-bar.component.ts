import { Component } from '@angular/core';

@Component({
  selector: 'cs-load-bar',
  templateUrl: './load-bar.component.html',
  styleUrls: ['./load-bar.component.scss'],
})
export class LoadBarComponent {
  public progress: any = {
    mode: 'indeterminate',
    value: 0,
  };
}
