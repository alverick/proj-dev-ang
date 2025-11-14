import { Component } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
    selector: 'cs-load-bar',
    templateUrl: './load-bar.component.html',
    styleUrls: ['./load-bar.component.scss'],
    imports: [ProgressBarModule]
})
export class LoadBarComponent {
  public progress: any = {
    mode: 'indeterminate',
    value: 0,
  };
}
