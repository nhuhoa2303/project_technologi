import {Component, OnInit} from '@angular/core';
import * as Chart from 'chart.js';
import {StaticalMostService} from '../../service/StaticalMostService';
import {StaticalProductMost} from '../../model/StaticalProductMost';
import {Title} from '@angular/platform-browser';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-statical-product',
  templateUrl: './statical-product.component.html',
  styleUrls: ['./statical-product.component.css']
})
export class StaticalProductComponent implements OnInit {

  public canvas: any;
  public ctx: any;
  public labelsProductWeek: string[] = [];
  public labelsProductMonth: string[] = [];
  public labelsProductYear: string[] = [];

  public dataQuantityWeek: number[] = [];
  public dataQuantityMonth: number[] = [];
  public dataQuantityYear: number[] = [];

  staticalProductByWeekList: StaticalProductMost[] = [];
  staticalProductByMonthList: StaticalProductMost[] = [];
  staticalProductByYearList: StaticalProductMost[] = [];
  formChart: FormGroup;
  staticalProductToSearch: StaticalProductMost[] = [];
  private labelsProductToSearch: string [] = [];
  private dataQuantityToSearch: number[] = [];

  start: string;
  end: string;
  // @ts-ignore
  private myChart: Chart;

  constructor(private staticalProductMostService: StaticalMostService, private title: Title) {
    this.title.setTitle('Thống kê sản phẩm');
  }

  ngOnInit(): void {
    // this.displayProductOrderByWeek();
    this.displayProductOrderByMonth();
    this.displayProductOrderByYear();
    this.displayProductOrderToSearch(this.start, this.end);
    // this.createLineChartProductByWeek();
    this.createLineChartProductByMonth();
    this.createLineChartProductByYear();
    this.createLineChartProductToSearch();
    this.getForm();
  }

  displayProductOrderByWeek() {
    this.staticalProductMostService.getProductOrderByWeek().subscribe(d => {
      this.staticalProductByWeekList = d;
      // console.log(this.staticalProductByWeekList);
      for (let i = 0; i < d.length; i++) {
        this.labelsProductWeek.push(d[i].name);
        this.dataQuantityWeek.push(d[i].quantity);
      }
      this.dataQuantityWeek.push(0);
    });
  }

  displayProductOrderByMonth() {
    this.staticalProductMostService.getProductOrderByMonth().subscribe(d => {
      this.staticalProductByMonthList = d;
      // console.log(this.staticalProductByMonthList);
      for (let i = 0; i < d.length; i++) {
        this.labelsProductMonth.push(d[i].name);
        this.dataQuantityMonth.push(d[i].quantity);
      }
      this.dataQuantityMonth.push(0);
    });
  }

  displayProductOrderByYear() {
    this.staticalProductMostService.getProductOrderByYear().subscribe(d => {
      this.staticalProductByYearList = d;
      for (let i = 0; i < d.length; i++) {
        this.labelsProductYear.push(d[i].name);
        this.dataQuantityYear.push(d[i].quantity);
      }
      this.dataQuantityYear.push(0);
    });
  }

  displayProductOrderToSearch(start: string, end: string) {

    this.staticalProductMostService.getProductOrderBySearch(start, end).subscribe(d => {
      this.staticalProductToSearch = d;
      console.log(d);
      for (let i = 0; i < d.length; i++) {
        this.labelsProductToSearch.push(d[i].name);
        this.dataQuantityToSearch.push(d[i].quantity);
      }
      this.dataQuantityToSearch.push(0);
    });
  }

  createLineChartProductByWeek() {
    this.canvas = document.getElementById('myChartProductWeek');
    this.ctx = this.canvas.getContext('2d');
    // @ts-ignore
    const chart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.labelsProductWeek,
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
          text: 'Top 10 sản phẩm bán chạy nhất trong 7 ngày gần đây'
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


  createLineChartProductByMonth() {
    this.canvas = document.getElementById('myChartProductMonth');
    this.ctx = this.canvas.getContext('2d');
    // @ts-ignore
    const chart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.labelsProductMonth,
        datasets: [{
          label: 'Tháng',
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
          text: 'Top 10 sản phẩm bán chạy nhất trong 30 ngày gần đây'
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

  createLineChartProductByYear() {
    this.canvas = document.getElementById('myChartProductYear');
    this.ctx = this.canvas.getContext('2d');
    // @ts-ignore
    const chart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.labelsProductYear,
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
          text: 'Top 10 sản phẩm bán chạy nhất trong  năm '
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

  createLineChartProductToSearch() {
    this.canvas = document.getElementById('myChartProductToSearch');
    this.ctx = this.canvas.getContext('2d');
    // @ts-ignore
    const chart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.labelsProductToSearch,
        datasets: [{
          label: 'Theo ngày tìm kiếm',
          data: this.dataQuantityToSearch,
          backgroundColor: '#ffbb33',
          borderColor: '#ffbb33',
          fill: false,
          borderWidth: 2
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Top 10 sản phẩm bán chạy nhất'
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
      case 0:
        document.getElementById('toSearch').style.display = 'block';
        document.getElementById('week').style.display = 'none';
        document.getElementById('month').style.display = 'none';
        document.getElementById('year').style.display = 'none';
        break;
      case 1:
        document.getElementById('toSearch').style.display = 'none';
        document.getElementById('week').style.display = 'block';
        document.getElementById('month').style.display = 'none';
        document.getElementById('year').style.display = 'none';
        break;
      case 2:
        document.getElementById('toSearch').style.display = 'none';
        document.getElementById('week').style.display = 'none';
        document.getElementById('month').style.display = 'block';
        document.getElementById('year').style.display = 'none';
        break;
      case 3:
        document.getElementById('toSearch').style.display = 'none';
        document.getElementById('week').style.display = 'none';
        document.getElementById('month').style.display = 'none';
        document.getElementById('year').style.display = 'block';
        break;
    }
  }

  getForm() {
    this.formChart = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });
  }
  destroyChart() {
    if (this.myChart != null) {
      this.myChart.destroy();
    }
  }
  onSubmit() {
    this.destroyChart();
    this.createLineChartProductToSearch();
  }
}
