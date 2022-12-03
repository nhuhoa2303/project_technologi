import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
@Component({
  selector: 'app-statistical',
  templateUrl: './statistical.component.html',
  styleUrls: ['./statistical.component.css']
})
export class StatisticalComponent implements OnInit {

  public canvas: any;
  public ctx: any;
  public labels: any = ['Lap top', 'Phone'];
  public dataCases: any = {
    chart1: [300, 310],
    chart2: [500, 450],
    chart3: [800, 999]
  };

  constructor() {
  }

  ngOnInit(): void {
    this.createLineChart(this.labels, this.dataCases, 'myChart');
  }

  createLineChart(labels,dataCases,chartId) {

    this.canvas = document.getElementById(chartId);
    this.ctx = this.canvas.getContext('2d');
    // @ts-ignore
    let chart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Week',
          data: dataCases.chart1,
          backgroundColor: '#ffbb33',
          borderColor: '#ffbb33',
          fill: false,
          borderWidth: 2
        },
          {
            label: 'Month',
            data: dataCases.chart2,
            backgroundColor: '#ff4444',
            borderColor: '#ff4444',
            fill: false,
            borderWidth: 2
          },
          {
            label: 'Year',
            data: dataCases.chart3,
            backgroundColor: '#215239',
            borderColor: '#215239',
            fill: false,
            borderWidth: 2
          }]
      },
      options: {
        title: {
          display: true,
          text: 'First chart'
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

}
