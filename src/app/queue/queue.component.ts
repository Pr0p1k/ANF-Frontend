import {Component, OnInit} from '@angular/core';
import {AreaService} from '../area.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.less']
})
export class QueueComponent implements OnInit {

  area: string;

  constructor(private areaService: AreaService) {
  }

  ngOnInit() {
    this.area = this.areaService.selectedArea;
  }

}
