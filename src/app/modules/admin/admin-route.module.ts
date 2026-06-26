import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from '../../views/users/user.component';
import { AgentComponent } from '../../views/agents/agent.component';
import { DepartmentsComponent } from '../../views/departments/departments.component';
import { CreditorsComponent } from '../../views/creditors/creditors.component';
import { RolesComponent } from '../../views/roles/roles.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Administración'
    },
    children: [
      {
        path: 'users',
        component: UserComponent,
        data: {
          title: 'Usuarios'
        }
      },
      {
        path: 'agents',
        component: AgentComponent,
        data: {
          title: 'Agentes'
        }
      },
      {
        path: 'departments',
        component: DepartmentsComponent,
        data: {
          title: 'Departamentos'
        }
      },
      {
        path: 'creditors',
        component: CreditorsComponent,
        data: {
          title: 'Acreedores - Proveedores'
        }
      },
      {
        path: 'roles',
        component: RolesComponent,
        data: {
          title: 'Roles y permisos'
        }
      },
      {
        path: 'roles/create',
        loadComponent: () => import('../../views/roles/role-form.component').then(m => m.RoleFormComponent),
        data: {
          title: 'Nuevo Perfil'
        }
      },
      {
        path: 'roles/:id/edit',
        loadComponent: () => import('../../views/roles/role-form.component').then(m => m.RoleFormComponent),
        data: {
          title: 'Editar Perfil'
        }
      },
      {
        path: 'openwa',
        loadComponent: () => import('./openwa-config/openwa-config.component').then(m => m.OpenwaConfigComponent),
        data: {
          title: 'Configuración OpenWA'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
// tslint:disable-next-line:eofline
}
