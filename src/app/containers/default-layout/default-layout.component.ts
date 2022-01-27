import { Component, Input } from '@angular/core';
import { User} from '../../models';
import { isArray, isString } from 'util';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css']
})
export class DefaultLayoutComponent {
  public currentUser: User;
  public navItems = [];
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  constructor(private router: Router) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getMenu();

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
  }

  getMenu() {
    if (this.getRoles(['super_admin','admin'])) {
      this.navItems.push(
        {
          name: 'Dashboard',
          url: '/page/dashboard',
          icon: 'icon-speedometer',
          children: null
          /*badge: {
            variant: 'info',
            text: 'NEW'
          }*/
        },
      );
    }
    if (this.getRoles(['admin','user'])) {
      this.navItems.push(
        {
          name: 'Clientes',
          url: '/page/clients',
          icon: 'fas fa-users',
          children: null
        },
        {
          name: 'Punto de venta',
          url: '/page/sale',
          icon: 'fas fa-shopping-bag',
          children: null
        },
        {
          name: 'Ventas',
          url: '/page/sales',
          icon: 'fas fa-piggy-bank',
          children: null
        },
        {
          name: 'Paquetes',
          url: '/page/packages',
          icon: 'fas fa-cubes',
          children: null
        }
      );
    }
    if (this.getRoles(['super_admin','admin'])) {
      this.navItems.push(
        {
          name: 'Balance',
          url: '/page/box',
          icon: 'fas fa-balance-scale',
          children: null
        },
        {
          name: 'Egresos',
          icon: 'fas fa-store',
          url: '/shopping',
          children: [
            {
              name: 'Registrar egresos',
              url: '/shopping/capture_purchase',
              icon: 'fa fa-cart-plus'
            },
            {
              name: 'Egresos por pagar',
              url: '/shopping/to_pay',
              icon: 'fas fa-cart-arrow-down'
            }
          ]
        },
        {
          name: 'Administración',
          icon: 'icon-settings',
          url: '/admin',
          children: [
            {
              name: 'Departamentos',
              url: '/admin/departments',
              icon: 'icon-briefcase '
            },
            {
              name: 'Prov./Acreedores',
              url: '/admin/creditors',
              icon: 'fas fa-user-tag'
            },
            {
              name: 'Usuarios',
              url: '/admin/users',
              icon: 'fas fa-users'
            },
            {
              name: 'Agentes',
              url: '/admin/agents',
              icon: 'icofont icofont-users-social'
            },
            {
              name: 'Roles/Permisos',
              url: '/admin/roles',
              icon: 'icon-lock-open '
            }
          ]
        },
        {
          name: 'Inventario',
          icon: 'fas fa-list-ul',
          url: '/inventory',
          children: [
            {
              name: 'Productos',
              url: '/inventory/products_inventory',
              icon: 'fas fa-shapes'
            },
            {
              name: 'Pastillas',
              url: '/inventory/pills_inventory',
              icon: 'icofont icofont-pills'
            }
          ]
        },
        {
          name: 'Catalogos',
          icon: 'icon-notebook',
          url: '/catalogs',
          children: [
            {
              name: 'Paquetes',
              url: '/catalog/cat_packages',
              icon: 'icofont icofont-sub-listing'
            },
            {
              name: 'Productos',
              url: '/catalog/cat_products',
              icon: 'icofont icofont-sub-listing'
            },
            {
              name: 'Pastillas',
              url: '/catalog/cat_pills',
              icon: 'icofont icofont-sub-listing'
            },
            {
              name: 'Referencias',
              url: '/catalog/cat_references',
              icon: 'icofont icofont-sub-listing'
            },
            {
              name: 'Servicios',
              url: '/catalog/cat_services',
              icon: 'icofont icofont-sub-listing'
            }
            ,
            {
              name: 'Conceptos',
              url: '/catalog/cat_concepts',
              icon: 'icofont icofont-sub-listing'
            }
            ,
            {
              name: 'Tipo de gastos',
              url: '/catalog/cat_expenses',
              icon: 'icofont icofont-sub-listing'
            }
          ]
        }
      );
    }
  }

  getRoles(p: any) {
    if (this.currentUser == null) {
      return false;
    }
    let result = false;
    if (isArray(p)) {
      p.forEach(v => {
        const i = this.currentUser.roles.findIndex(r => r.slug === v);
        if (i !== -1) {
          result = true;
        }
      });
    } else if (isString(p)) {
      const i = this.currentUser.roles.findIndex(r => r.slug === p);
      if (i !== -1) {
        result = true;
      }
    }
    return result;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
