export { };

declare global {
  interface String {
    nullIfEmpty(): String | null
  }

  interface Number {
    coerceBetween(a: number, b: number): number
  }

  // stub for web
  interface Storage {
    [name: string]: any;
    readonly length: number;
    clear(): void;
    getItem(key: string): string | null;
    key(index: number): string | null;
    removeItem(key: string): void;
    setItem(key: string, value: string): void;
  }
}

String.prototype.nullIfEmpty = function() {
  if (this.trim() === '') {
    return null
  }

  return this;
}

Number.prototype.coerceBetween = function(a: number, b: number): number {
  if (+this < a) {
    return a;
  }
  if (+this > b) {
    return b;
  }

  return +this;
}


export class LocalStorageMock implements Storage {
  private store: Record<string, string> = {}

  get length(): number {
    return Object.keys(this.store).length
  }
  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null
  }

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}
