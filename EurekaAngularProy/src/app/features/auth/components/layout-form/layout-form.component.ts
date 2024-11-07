import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'cs-layout-form',
  templateUrl: './layout-form.component.html',
  styleUrls: ['./layout-form.component.scss'],
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
})
export class LayoutFormComponent {}
