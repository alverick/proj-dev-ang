import { inject, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { ScriptInjectorService } from './script-injector.service';

declare const grecaptcha: {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

@Injectable()
export class RecaptchaProviderService {
  private readonly siteKey: string = environment.recaptcha;
  private readonly scriptInjectorService = inject(ScriptInjectorService);

  constructor() {
    this.scriptInjectorService.loadScript(
      'Recaptcha',
      `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`,
    );
  }

  /**
   * Executes reCAPTCHA verification for a given action.
   * @param action The user interaction to verify (e.g., 'login', 'submit').
   * @returns A promise that resolves with the reCAPTCHA token.
   */
  public getToken(action: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (typeof grecaptcha === 'undefined' || grecaptcha === null) {
        return reject(new Error('reCAPTCHA script not loaded or initialized.'));
      }

      grecaptcha.ready(() => {
        resolve(grecaptcha.execute(this.siteKey, { action }));
      });
    });
  }
}
