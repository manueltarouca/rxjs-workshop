import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NasaFilter } from 'src/app/models/nasa-filters.model';
import { NasaFilterService } from 'src/app/services/nasa-filter.service';
import * as moment from 'moment';

@Component({
  selector: 'app-nasa-filters',
  templateUrl: './nasa-filters.component.html',
  styleUrls: ['./nasa-filters.component.scss']
})
export class NasaFiltersComponent implements OnInit {

  cameraOptions = this.filterService.getCamerasOptions()
  roverOptions = this.filterService.getRoverOptions()

  form = this.fb.group<NasaFilter>({
    earth_date: '2022-06-30',
    camera: 'ALL',
    rover: 'perseverance'
  });

  constructor(
    private fb: FormBuilder,
    private filterService: NasaFilterService
    ) { }

  ngOnInit(): void {
    this.form.valueChanges.subscribe( filter => {
      const activeFilter = this.filterService.activeFilter.getValue();
      if (activeFilter.rover !== filter.rover) {
        filter.camera = 'ALL'
        this.form.patchValue(filter, {emitEvent: false})
      }
      filter.earth_date = moment(filter.earth_date).format('YYYY-MM-DD');
      this.filterService.updateActiveFilter(filter as NasaFilter);
    });
  }

}
