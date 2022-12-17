import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from '../../views/users/user.component';
import { AgentComponent } from '../../views/agents/agent.component';
import { DepartmentsComponent } from '../../views/departments/departments.component';
import { CreditorsComponent } from '../../views/creditors/creditors.component';

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
