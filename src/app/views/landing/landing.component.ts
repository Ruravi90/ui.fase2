import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  plans = [
    {
      name: 'Básico',
      price: '500',
      period: 'mes',
      features: [
        'Agenda Inteligente',
        'Expediente COFEPRIS',
        'Soporte por Email'
      ]
    },
    {
      name: 'Profesional',
      price: '1,200',
      period: 'mes',
      features: [
        'Todo lo del Básico',
        'Facturación SAT 4.0',
        'Gestión de Inventario',
        'Soporte Prioritario'
      ],
      popular: true
    },
    {
      name: 'Empresarial',
      price: 'Contactar',
      period: '-',
      features: [
        'Multisucursal',
        'Reportes Avanzados',
        'Integraciones API',
        'Manager Dedicado'
      ]
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Scroll to top on init
    window.scrollTo(0, 0);
  }

}
