import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GridSettings } from '../grid-settings.interface';

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (_key: any, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

@Injectable({
  providedIn: 'root'
})
export class StatePersistingService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  public get<T>(token: string): T | null {
    if (isPlatformBrowser(this.platformId)) {
      const settings = localStorage.getItem(token);
      return settings ? JSON.parse(settings) as T : null;
    }
    return null;
  }

  public set<T>(token: string, gridConfig: GridSettings): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(
        token,
        JSON.stringify(gridConfig, getCircularReplacer())
      );
    }
  }

  public hasState(token: string): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(token) !== null;
    }
    return false;
  }
}