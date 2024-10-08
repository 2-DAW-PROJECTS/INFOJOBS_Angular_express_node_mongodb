import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../../../environments/environment';

const URL = `${environment.api_url}/categorys`;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  all_categories(params: any): Observable<{ categorys: Category[], count: number }> {
    return this.http.get<{ categorys: Category[], count: number }>(URL, { params });
  }
}
