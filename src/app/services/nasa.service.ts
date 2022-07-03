import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, shareReplay } from 'rxjs';
import { NasaFilter } from '../models/nasa-filters.model';
import { ApiError, NasaApiResponse } from '../models/nasa-response.model';

@Injectable({
  providedIn: 'root'
})
export class NasaService {

  private apiKey = 'DEMO_KEY';
  private baseUrl = 'https://api.nasa.gov/mars-photos/api/v1';

  constructor(
    private httpClient: HttpClient
  ) { }

  public getRoverImage(filter: NasaFilter) {
    const params: Partial<NasaFilter> = Object.assign({}, filter);
    if (filter.camera === 'ALL'){
      delete params.camera
    }
    delete params.rover;
    return this.httpClient.get<NasaApiResponse>(`${this.baseUrl}/rovers/${filter.rover}/photos`, {
      params: {
        ...params,
        api_key:this.apiKey
      }

    }).pipe(
      catchError( (err) => of(new ApiError(err.message))),
    )
  }

  public getRoveMetadata(roverName: string) {
    return this.httpClient.get<any>(`${this.baseUrl}/manifests/${roverName}`, {
      params: {
        api_key: this.apiKey
      }
    }).pipe(
      catchError( async () => new ApiError('err')),
      shareReplay()
    )
  }
}
