import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, tap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private apiUrl = 'http://127.0.0.1:3003/api/v1/tasks';
  private autoReloadSubject = new BehaviorSubject<void>(undefined);
  autoReload$: Observable<void> = this.autoReloadSubject.asObservable();
  constructor(private http: HttpClient) { }
  triggerAutoReload(): void {
    this.autoReloadSubject.next();
  }
  public getSomeData(): Observable<any> {
    return forkJoin([
      this.http.get<any>(`${this.apiUrl}/getAllToDo`),
      this.http.get<any>(`${this.apiUrl}/getAllInProgress`),
      this.http.get<any>(`${this.apiUrl}/getAllDone`),
    ]);
  }
  public createResource(data: any): Observable<any> {
    const url = `${this.apiUrl}/addTask`;
    return this.http.post<any>(url, data);
  }
  public deleteResource(resourceId: number): Observable<any> {
    const url = `${this.apiUrl}/deleteTask/${resourceId}`;
    return this.http.delete<any>(url);
  }
  public changeStatus(id: number,changeinstatus:string): Observable<any> {
    const url = `${this.apiUrl}/changeStatus/${id}/${changeinstatus}`;
    return this.http.get<any>(url);
  }
  public changeShow(id: number): Observable<any> {
    const url = `${this.apiUrl}/changeShow/${id}`;
    return this.http.get<any>(url);
  }
  public modifyResource(resourceId: number,data: any): Observable<any> {
    const url = `${this.apiUrl}/modifyTask/${resourceId}`;
    return this.http.post<any>(url, data);
  }
}

