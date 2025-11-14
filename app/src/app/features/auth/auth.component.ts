import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
    selector: 'cs-auth',
    templateUrl: './auth.component.html',
    standalone: true,
    imports: [HeaderComponent, RouterOutlet, FooterComponent]
})
export class AuthComponent {}
