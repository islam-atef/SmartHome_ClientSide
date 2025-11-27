export interface JwtClaim {
  type: string;
  value: string;
}

export class JwtClaimReader {
  // Equivalent of BuildIdentityFromJwt → we simply return the claims list
  static parse(jwt: string): JwtClaim[] {
    const payload = this.decodePayload(jwt);
    if (!payload) return [];
    return this.extractClaims(payload);
  }

  // -----------------------------
  // Decode JWT payload (Base64Url → UTF-8 string)
  // -----------------------------
  private static decodePayload(jwt: string): any | null {
    const parts = jwt.split('.');
    if (parts.length !== 3) return null;

    const payload = this.base64UrlDecode(parts[1]);
    try {
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }

  // -----------------------------
  // Extract claims from payload
  // Handles: string, number, array
  // -----------------------------
  private static extractClaims(payload: any): JwtClaim[] {
    const claims: JwtClaim[] = [];

    Object.keys(payload).forEach((key) => {
      const value = payload[key];

      if (Array.isArray(value)) {
        value.forEach((v) => {
          claims.push({ type: key, value: String(v) });
        });
      } else if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        claims.push({ type: key, value: String(value) });
      } else {
        // objects or other structures → raw JSON
        claims.push({ type: key, value: JSON.stringify(value) });
      }
    });

    return claims;
  }

  // -----------------------------
  // Base64Url decoding
  // -----------------------------
  private static base64UrlDecode(input: string): string {
    // Replace URL-safe chars
    let s = input.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding
    const pad = s.length % 4;
    if (pad === 2) s += '==';
    else if (pad === 3) s += '=';
    else if (pad !== 0) throw new Error('Invalid Base64Url token');

    // Decode
    const decoded = atob(s);
    return decodeURIComponent(
      decoded
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  }
}
