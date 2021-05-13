import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public setupUserLocalStorage(data: any): void {
    localStorage.setItem('user_details', JSON.stringify(data));
  }

  public get userLocalStorage(): void {
    return JSON.parse(localStorage.getItem('user_details'));
  }

  public addToLocalStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getFromLocalStorage(key: string): any {
    return JSON.parse(localStorage.getItem(key));
  }
}
