import CryptoJS from "crypto-js";

export class CryptoUtils {
  private static keySize = 256;
  private static ivSize = 128;
  private static iterations = 100;

  static encrypt(msg: string, pass: string) {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const key = CryptoJS.PBKDF2(pass, salt, { keySize: this.keySize / 32, iterations: this.iterations });
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const encrypted = CryptoJS.AES.encrypt(msg, key, { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC });
    return salt.toString() + iv.toString() + encrypted.toString();
  }


  static decrypt(transitMessage: string, pass: string) {
    const salt = CryptoJS.enc.Hex.parse(transitMessage.substr(0, 32));
    const iv = CryptoJS.enc.Hex.parse(transitMessage.substr(32, 32));
    const encrypted = transitMessage.substring(64);
    const key = CryptoJS.PBKDF2(pass, salt, { keySize: this.keySize / 32, iterations: this.iterations });
    return CryptoJS.AES.decrypt(encrypted, key, { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC }).toString(CryptoJS.enc.Utf8);
  }


  static getKey(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  static getWindow(): Window {
    return window;
  }
}
