import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ApiService} from "./api.service";
import {catchError, filter, first, map, mergeMap, Observable, of, take} from "rxjs";
import {ApiResponse} from "./types";
import {JsonPipe} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";


type ApiResponseMethod = () => Observable<ApiResponse | null>;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  public element: ApiResponse | null = null;
  public timeElapsed: number | null = null;

  constructor(private apiService: ApiService,
              private cdRef: ChangeDetectorRef,
              private destroyRef: DestroyRef) {
  }

  public run(method: ApiResponseMethod): void {
    const startTime = Date.now();
    method.call(this)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          alert("error occured")
          return of(err)
        })
      )
      .subscribe((result: ApiResponse | null) => {
        this.timeElapsed = Date.now() - startTime;
        this.element = result;
        this.cdRef.detectChanges()
      })
  }

  public firstMethod(): Observable<ApiResponse | null> {
    return this.apiService.getWithQueryParam({'status': 'pending'})
      .pipe(
        map((items) => items.at(1) || null),
      )
  }

  public secondMethod(): Observable<ApiResponse | null> {
    return this.apiService.get()
      .pipe(
        mergeMap((item) => item),
        filter(item => item.status === "pending"),
        take(2),
        catchError(() => of(null)),
      )
  }

  public thirdMethod(): Observable<ApiResponse | null> {
    return this.apiService.get()
      .pipe(
        map((items) => items.filter(item => item.status === "pending").at(1) || null),
        catchError(() => of(null)),
      )
  }
}
