import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
  
import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

import { TreasureManager } from '../treasure-manager';

@Component({
  selector: 'app-treasure-dividend-two',
  templateUrl: './treasure-dividend-two.component.html',
  styleUrls: ['./treasure-dividend-two.component.css']
})
export class TreasureDividendTwoComponent implements OnInit {

  @Input() profile: any;

  @Output() onClose: EventEmitter<any> = new EventEmitter();

  language: number = 0;

  treasureManager: any = null;
  dataArray = [];
  waiting = true;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.treasureManager = new TreasureManager(this.contractService.myIOST);

    setTimeout(async () => {
      const today = await this.treasureManager.getToday();
      const result = await this.treasureManager.getBurningDividends(today, 7);
      this.dataArray = result.map(obj => {
        var d = new Date(obj.day * 1000 * 24 * 3600);

        return {
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          day: d.getDate(),
          dividend: obj.dividend
        }
      });

      this.waiting = false;
    }, 0);
  }

  formatNumber(x: number) {
    if (x >= 10000000000) {
      return +(x / 1000000000).toFixed(0) + ' B';
    } else if (x >= 1000000000) {
      return +(x / 1000000000).toFixed(1) + ' B';
    } else if (x >= 10000000) {
      return +(x / 1000000).toFixed(0) + ' M';
    } else if (x >= 1000000) {
      return +(x / 1000000).toFixed(1) + ' M';
    } else if (x >= 10000) {
      return +(x / 1000).toFixed(0) + ' K';
    } else if (x >= 1000) {
      return +(x / 1000).toFixed(1) + ' K';
    } else if (x > 10) {
      return +(x * 1).toFixed(1);
    } else if (x > 1) {
      return +(x * 1).toFixed(2);
    } else if (x > 0) {
      return +(x * 1).toFixed(2);
    } else {
      return '0';
    }
  }

  changeLanguage(language: number) {
    this.language = language;
  }

  close() {
    this.onClose.emit();
  }
}
