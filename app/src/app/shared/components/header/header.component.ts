import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'cs-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterModule, NgOptimizedImage],
})
export class HeaderComponent {
  @Input() isBlank = false;
}
