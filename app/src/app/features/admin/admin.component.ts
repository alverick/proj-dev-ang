import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AdminHeaderComponent } from './components/admin-header/admin-header.component';

@Component({
    selector: 'cs-admin',
    templateUrl: './admin.component.html',
    imports: [AdminHeaderComponent, RouterOutlet]
})
export class AdminComponent {}
