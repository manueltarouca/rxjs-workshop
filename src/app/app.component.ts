import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ApiError, NasaApiResponse } from './models/nasa-response.model';
import { NasaFilterService } from './services/nasa-filter.service';
import { NasaService } from './services/nasa.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'rxjs-workshop';

  errorSubject = new BehaviorSubject<null | { message: string}>(null);
  loadingSubject = new BehaviorSubject(false);

  data = this.filterService.getActiveFilter().pipe(
    tap( () => this.loadingSubject.next(true)),
    tap( () => this.clearErrorSubject()),
    switchMap( filter => this.nasaService.getRoverImage(filter)),
    tap(res => console.log(res)),
    map( res => this.handleApiError(res)),
    tap( () => this.loadingSubject.next(false))
  );

  constructor(
    private nasaService: NasaService,
    private filterService: NasaFilterService
  ) { }

  ngOnInit(): void {
  }

  private handleApiError(res: NasaApiResponse | ApiError) {
    if (res instanceof ApiError) {
      this.errorSubject.next({message: 'API error' });
      return [];
    } else {
      if (res.photos.length === 0) {
        this.errorSubject.next({message: 'No data'})
      } 
      return res.photos
    }
  }

  private clearErrorSubject() {
    this.errorSubject.next(null);
  }
}
