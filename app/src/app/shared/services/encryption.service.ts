import { Injectable } from '@angular/core';

interface AlgorithmConfig {
  name: 'AES-GCM';
  ivLength: number;
}

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  private readonly LOCAL_KEY_NAME: string = 'elk';
  private readonly SESSION_KEY_NAME: string = 'esk';
  private readonly ALGORITHM: AlgorithmConfig = {
    name: 'AES-GCM',
    ivLength: 12,
  };

  /**
   * Generates a random encryption key.
   * @returns {Promise<CryptoKey>} A promise that resolves with the generated CryptoKey.
   */
  private async generateEncryptionKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: this.ALGORITHM.name,
        length: 256,
      },
      true,
      ['encrypt', 'decrypt'],
    );
  }

  /**
   * Exports a CryptoKey to a JWK string for storage.
   * @param {CryptoKey} key The CryptoKey to export.
   * @returns {Promise<string>} A promise that resolves with the JWK string representation of the key.
   */
  private async exportKey(key: CryptoKey): Promise<string> {
    const exported: JsonWebKey = await crypto.subtle.exportKey('jwk', key);
    return JSON.stringify(exported);
  }

  /**
   * Imports a CryptoKey from a JWK string.
   * @param {string} jwkString The JWK string representation of the key.
   * @returns {Promise<CryptoKey>} A promise that resolves with the imported CryptoKey.
   */
  private async importKey(jwkString: string): Promise<CryptoKey> {
    const jwk: JsonWebKey = JSON.parse(jwkString) as JsonWebKey;
    return await crypto.subtle.importKey(
      'jwk',
      jwk,
      {
        name: this.ALGORITHM.name,
      },
      true,
      ['encrypt', 'decrypt'],
    );
  }

  /**
   * Retrieves or generates the session encryption key.
   * This method should be called once per session (e.g., in a guard or app initialization).
   * @returns {Promise<CryptoKey>} A promise that resolves with the session CryptoKey.
   */
  public async getSessionEncryptionKey(
    storageType: 'session' | 'local',
  ): Promise<CryptoKey> {
    const storage = storageType === 'session' ? sessionStorage : localStorage;
    const keyName =
      storageType === 'session' ? this.SESSION_KEY_NAME : this.LOCAL_KEY_NAME;
    const sessionKeyJwk: string | null = storage.getItem(keyName);

    if (sessionKeyJwk) {
      return this.importKey(sessionKeyJwk);
    } else {
      const newKey: CryptoKey = await this.generateEncryptionKey();
      storage.setItem(keyName, await this.exportKey(newKey));
      return newKey;
    }
  }

  /**
   * Retrieves or generates the session encryption key.
   * This method should be called once per session (e.g., in a guard or app initialization).
   * @returns {Promise<CryptoKey>} A promise that resolves with the session CryptoKey.
   */
  public async getLocalEncryptionKey(): Promise<CryptoKey> {
    const sessionKeyJwk: string | null = localStorage.getItem(
      this.SESSION_KEY_NAME,
    );

    if (sessionKeyJwk) {
      return this.importKey(sessionKeyJwk);
    } else {
      const newKey: CryptoKey = await this.generateEncryptionKey();
      localStorage.setItem(this.SESSION_KEY_NAME, await this.exportKey(newKey));
      return newKey;
    }
  }

  /**
   * Encrypts data using the provided key.
   * @param {string} data The string data to encrypt.
   * @param {CryptoKey} key The encryption key.
   * @returns {Promise<string>} A promise that resolves with the base64 encoded encrypted data (ciphertext + IV).
   */
  public async encryptData(data: string, key: CryptoKey): Promise<string> {
    const iv: Uint8Array = crypto.getRandomValues(
      new Uint8Array(this.ALGORITHM.ivLength),
    );
    const encodedData: Uint8Array = new TextEncoder().encode(data);

    const ciphertext: ArrayBuffer = await crypto.subtle.encrypt(
      {
        name: this.ALGORITHM.name,
        iv: iv,
      },
      key,
      encodedData,
    );

    const combined: Uint8Array = new Uint8Array(
      iv.length + ciphertext.byteLength,
    );
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);

    return btoa(String.fromCharCode(...Array.from(combined)));
  }

  /**
   * Decrypts data using the provided key.
   * @param {string} encryptedData The base64 encoded encrypted data (ciphertext + IV).
   * @param {CryptoKey} key The decryption key.
   * @returns {Promise<string | null>} A promise that resolves with the decrypted string data, or null if decryption fails.
   */
  public async decryptData(
    encryptedData: string,
    key: CryptoKey,
  ): Promise<string | null> {
    const decoded: Uint8Array = Uint8Array.from(atob(encryptedData), (c) =>
      c.charCodeAt(0),
    );

    const iv: Uint8Array = decoded.slice(0, this.ALGORITHM.ivLength);
    const ciphertext: Uint8Array = decoded.slice(this.ALGORITHM.ivLength);

    try {
      const decrypted: ArrayBuffer = await crypto.subtle.decrypt(
        {
          name: this.ALGORITHM.name,
          iv: iv,
        },
        key,
        ciphertext,
      );
      return new TextDecoder().decode(decrypted);
    } catch (e: unknown) {
      console.error('Decryption failed:', e);
      return null;
    }
  }
}
