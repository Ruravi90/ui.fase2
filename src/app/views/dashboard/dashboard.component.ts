import { Component, OnInit } from '@angular/core';
import { BalanceService } from '../../services';


@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  salesChart: any[]=[];
  sales: any[]=[];
  packagesChart: any[]=[];
  packages: any[]=[];
  servicesChart: any[]=[];
  services: any[]=[];
  constructor(private bS:BalanceService) {
    //Object.assign(this, { single })
    
  }
  ngOnInit(): void {
    this.bS.getSaleChart().subscribe((r)=>{
      this.sales = r;
      r.forEach(element => {
        this.salesChart.push( {
          name: element.date,
          value: element.sales
        });
        console.log(this.salesChart);
      });
    });

    this.bS.getPackageChart().subscribe((r)=>{
      this.packages = r;
      r.forEach(element => {
        this.packagesChart.push( {
          name: (element.cat_package?element.cat_package.name:''),
          value: element.sales
        });
      });
    });

    this.bS.getServiceChart().subscribe((r)=>{
      this.services = r;
      r.forEach(element => {
        this.servicesChart.push( {
          name: (element.cat_service?element.cat_service.name:''),
          value: element.sales
        });
      });
    });
    // generate random values for mainChart
  }

  setLabelFormatting(c): string {
    return c;
  }

  getPackageName(v:string){
    const value = this.packages.find(s=> s.sales == v);
    return v + ' ' + (value? value.cat_package.name:'');
  }

  getSaleName(v:string){
    return v + ' ventas' ;
  }

  getServiceName(v:string){
    const value = this.services.find(s=> s.sales == v);
    return v + ' ' + (value? value.cat_service.name:'');
  }
}
