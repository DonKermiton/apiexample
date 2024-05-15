# Opis
Problem został rozwiązany trzema sposobami.


## Pierwszy sposób
Do request'u można dodać parametr. Parametrem jest klucz, który filtruje po zbiorze i zwraca zgodne elementy.


```
  public getWithQueryParam(params: Record<string, string>): Observable<ApiResponse[]> {
    let parsedParams = new HttpParams();

    for(let [key, value] of Object.entries(params)) {
      parsedParams = parsedParams.append(key, value)
    }

    return this.httpClient.get<ApiResponse[]>('https://gorest.co.in/public/v2/todos', {params});
  }
}
```


```
  public firstMethod(): Observable<ApiResponse | null> {
    return this.apiService.getWithQueryParam({'status': 'pending'})
      .pipe(
        map((items) => items.at(1) || null),
      )
  }
```

## Drugi sposób

```
  public get(): Observable<ApiResponse[]> {
    return this.httpClient.get<ApiResponse[]>('https://gorest.co.in/public/v2/todos');
  }
```

```
  public secondMethod(): Observable<ApiResponse | null> {
    return this.apiService.get()
      .pipe(
        mergeMap((item) => item),
        filter(item => item.status === "pending"),
        take(2),
        catchError(() => of(null)),
      )
  }
```


## Trzeci sposób

```
  public thirdMethod(): Observable<ApiResponse | null> {
    return this.apiService.get()
      .pipe(
        map((items) => items.filter(item => item.status === "pending").at(1) || null),
        catchError(() => of(null)),
      )
  }
 ```

## Wywoływanie requestu

HTML
```
<div class="method-wrapper">
  <button (click)="run(firstMethod)">First</button>
  <button (click)="run(secondMethod)">Second</button>
  <button (click)="run(thirdMethod)">Third</button>
</div>

@if(timeElapsed) {
  <p>{{timeElapsed}} ms</p>
}

@if(element) {
  <p>{{element | json}}</p>
}

```

```
  public run(method: ApiResponseMethod): void {
    const startTime = Date.now();
    method.call(this)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          alert("error occurred")
          return of(err)
        })
      )
      .subscribe((result: ApiResponse | null) => {
        this.timeElapsed = Date.now() - startTime;
        this.element = result;
        this.cdRef.detectChanges()
      })
  }
```

