import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, of, pairwise, switchMap, tap } from 'rxjs';
import { NasaFilter } from '../models/nasa-filters.model';
import { NasaService } from './nasa.service';

@Injectable({
  providedIn: 'root'
})
export class NasaFilterService {

  activeFilter: BehaviorSubject<NasaFilter> = new BehaviorSubject(NasaFilterService.getInitialFilter());

  constructor(
    private nasaService: NasaService
  ) { }

  static getInitialFilter(): NasaFilter {
    return {
      earth_date: '2022-06-30',
      camera: 'ALL',
      rover: 'perseverance'
    };
  }

  updateActiveFilter(filter: NasaFilter) {
    this.activeFilter.next(filter);
  }

  getActiveFilter() {
    return this.activeFilter.asObservable();
  }

  public getCamerasOptions(): Observable<string[]> {
    return this.activeFilter.pipe(
      switchMap( filter => this.nasaService.getRoveMetadata(filter.rover)),
      map( res => [...new Set([...res.photo_manifest.photos.map( (item: any) => item.cameras)].flat())]),
      tap( res => console.log(res))
    )
  }

  public getRoverOptions(){
    return of(
      [
        'perseverance',
        'curiosity',
        'opportunity',
        'spirit'
      ]
    )
    
  }
}
