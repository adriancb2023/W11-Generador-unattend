/** Codifica contraseña para `<Password><Value>` de unattend (UTF-16LE + Base64). */
export function encodeUnattendPassword(plain: string): string {
  const len = plain.length;
  const bytes = new Uint8Array(len * 2);
  for (let i = 0; i < len; i++) {
    const code = plain.charCodeAt(i);
    bytes[i * 2] = code & 0xff;
    bytes[i * 2 + 1] = (code >>> 8) & 0xff;
  }
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}
