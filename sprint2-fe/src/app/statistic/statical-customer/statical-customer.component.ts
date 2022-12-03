import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import {StaticalProductMost} from '../../model/StaticalProductMost';
import {StaticalMostService} from '../../service/StaticalMostService';
import {StaticalCustomerMost} from '../../model/StaticalCustomerMost';

@Component({
  selector: 'app-statical-customer',
  templateUrl: './statical-customer.component.html',
  styleUrls: ['./statical-customer.component.css']
})
export class StaticalCustomerComponent implements OnInit {

  public canvas: any;
  public ctx: any;
  public labelsCustomerWeek: string[] = [];
  public labelsCustomerMonth: string[] = [];
  public labelsCustomerYear: string[] = [];

  public dataQuantityWeek: number[] = [];
  public dataQuantityMonth: number[] = [];
  public dataQuantityYear: number[] = [];

  staticalCustomerByWeekList: StaticalCustomerMost[] = [];
  staticalCustomerByMonthList: StaticalCustomerMost[] = [];
  staticalCustomerByYearList: StaticalCustomerMost[] = [];

  constructor(private staticalMostService: StaticalMostService) {
  }

  ngOnInit(): void {
    this.displayCustomerOrderByWeek();
    this.displayCustomerOrderByMonth();
    this.displayCustomerOrderByYear();
    this.createLineChartCustomerByWeek();
    this.createLineChartCustomerByMonth();
    this.createLineChartCustomerByYear();
  }

  displayCustomerOrderByWeek() {
    this.staticalMostService.getCustomerOrderByWeek().subscribe(d => {
      this.staticalCustomerByWeekList = d;
      for (let i = 0; i < d.length; i++) {
        this.labelsCustomerWeek.push(d[i].name);
        this.dataQuantityWeek.push(d[i].orderQuantity);
      }
    });
  }

  displayCustomerOrderByMonth() {
    this.staticalMostService.getCustomerOrderByMonth().subscribe(d => {
      this.staticalCustomerByMonthList = d;
      for (let i = 0; i < d.length; i++) {
        this.labelsCustomerMonth.push(d[i].name);
        this.dataQuantityMonth.push(d[i].orderQuantity);
      }
    });
  }

  displayCustomerOrderByYear() {
    this.staticalMostService.getCustomerOrderByYear().subscribe(d => {
      this.staticalCustomerByYearList = d;
      for (let i = 0; i < d.length; i++) {
        this.labelsCustomerYear.push(d[i].name);
        this.dataQuantityYear.push(d[i].orderQuantity);
      }
    });
  }


  createLineChartCustomerByWeek() {
    this.canvas = document.getElementById('myChartProductWeek');
    this.ctx = this.canvas.getContext('2d');
    // @ts-ignore
    const chart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.labelsCustomerWeek,
        datasets: [{
          label: 'Tuần',
          data: this.dataQuantityWeek,
          backgroundColor: '#ffbb33',
          borderColor: '#ffbb33',
          fill: false,
          borderWidth: 2
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Top khách hàng mua nhiều nhất tuần'
        },
        tooltips: {
          mode: 'index',
          intersect: true
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
      }
    });
  }

  createLineChartCustomerByMonth() {
    this.canvas = document.getElementById('myChartProductMonth');
    this.ctx = this.canvas.getContext('2d');
    // @ts-ignore
    const chart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.labelsCustomerMonth,
        datasets: [{
          label: 'Month',
          data: this.dataQuantityMonth,
          backgroundColor: '#8d1414',
          borderColor: '#8d1414',
          fill: false,
          borderWidth: 2
        },]
      },
      options: {
        title: {
          display: true,
          text: 'Top khách hàng mua nhiều nhất tháng'
        },
        tooltips: {
          mode: 'index',
          intersect: true
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
      }
    });
  }

  createLineChartCustomerByYear() {
    this.canvas = document.getElementById('myChartProductYear');
    this.ctx = this.canvas.getContext('2d');
    // @ts-ignore
    const chart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.labelsCustomerYear,
        datasets: [{
          label: 'Năm',
          data: this.dataQuantityYear,
          backgroundColor: '#3a5c8e',
          borderColor: '#3a5c8e',
          fill: false,
          borderWidth: 2
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Top khách hàng mua nhiều nhất năm'
        },
        tooltips: {
          mode: 'index',
          intersect: true
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
      }
    });
  }


  selectType(target: any) {
    console.log(target.value);
    switch (parseInt(target.value)) {
      case 1:
        document.getElementById('week').style.display = 'block';
        document.getElementById('month').style.display = 'none';
        document.getElementById('year').style.display = 'none';
        break;
      case 2:
        document.getElementById('week').style.display = 'none';
        document.getElementById('month').style.display = 'block';
        document.getElementById('year').style.display = 'none';
        break;
      case 3:
        document.getElementById('week').style.display = 'none';
        document.getElementById('month').style.display = 'none';
        document.getElementById('year').style.display = 'block';
        break;
    }
  }
}
