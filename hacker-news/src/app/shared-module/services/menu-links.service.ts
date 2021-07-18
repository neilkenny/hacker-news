import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LinkItem } from '../models/link.model';

@Injectable()
export class MenuLinksService{
  private links: LinkItem[] = [];
  private getLinksPromise: Promise<LinkItem[]> | undefined;
  
  constructor(private http: HttpClient){
    
  }

  /**
   * Service to show usage of promises as well as observables
   * @returns 
   */
  getMenuLinks(): Promise<LinkItem[]>{
    if(!this.getLinksPromise){
      this.getLinksPromise = new Promise((resolve) => {
        this.http.get<LinkItem[]>('/assets/links.json').subscribe((theLinks: LinkItem[]) => {
          resolve(theLinks);
        });
      });
    }
    return this.getLinksPromise;
    
  }
}