import * as fs from 'fs';

export function loadCertificate(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

export function loadPrivateKey(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}
