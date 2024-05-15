import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiResponse} from "./types";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  public get(): Observable<ApiResponse[]> {
    return this.httpClient.get<ApiResponse[]>('https://gorest.co.in/public/v2/todos');
  }

  public getWithQueryParam(params: Record<string, string>): Observable<ApiResponse[]> {
    let parsedParams = new HttpParams();

    for(let [key, value] of Object.entries(params)) {
      parsedParams = parsedParams.append(key, value)
    }

    return this.httpClient.get<ApiResponse[]>('https://gorest.co.in/public/v2/todos', {params});
  }
}
