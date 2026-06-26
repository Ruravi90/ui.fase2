import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

import { RoleService, PermissionService } from '../../services';
import { Role, Permission } from '../../models';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './role-form.component.html'
})
export class RoleFormComponent implements OnInit {
  public isEdit = false;
  public loading = false;
  
  public rol: Role = new Role();
  public permissions: Permission[] = [];
  public groupedPermissions: { module: string, perms: Permission[] }[] = [];
  public selectedPermissionIds: Set<number> = new Set();

  constructor(
    private rS: RoleService, 
    private pS: PermissionService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loadRole(Number(id));
    } else {
      this.isEdit = false;
      this.getPermissions();
    }
  }

  loadRole(id: number) {
    this.loading = true;
    this.rS.getById(id).subscribe(result => {
      this.rol = result;
      this.selectedPermissionIds.clear();
      if (this.rol.permissions) {
        this.rol.permissions.forEach((p: any) => this.selectedPermissionIds.add(p.id));
      }
      this.getPermissions();
    });
  }

  getPermissions() {
    this.loading = true;
    this.pS.get().subscribe({
      next: (r: any) => {
        this.permissions = r;
        this.groupPermissions(r);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private moduleTranslations: { [key: string]: string } = {
    'rol': 'Perfiles',
    'user': 'Usuarios',
    'client': 'Clientes',
    'provider': 'Proveedores',
    'creditor': 'Acreedores',
    'product_inventory': 'Inventario de Productos',
    'pill_inventory': 'Inventario de Pastillas',
    'cat_reference': 'Cat. Referencias',
    'cat_package': 'Cat. Paquetes',
    'cat_product': 'Cat. Productos',
    'cat_pill': 'Cat. Pastillas',
    'sale': 'Ventas',
    'schedule': 'Agenda',
    'package': 'Paquetes Adquiridos',
    'purchases': 'Compras',
    'box': 'Caja',
    'clinical_note': 'Notas Clínicas',
    'medical_record': 'Expediente Médico'
  };

  private groupPermissions(perms: Permission[]) {
    const groups: { [key: string]: Permission[] } = {};
    for (const p of perms) {
      let base = p.slug || '';
      base = base.replace(/^(module|add|edit|delete|view)_/, '');
      
      if (!groups[base]) groups[base] = [];
      groups[base].push(p);
    }
    
    this.groupedPermissions = Object.keys(groups).map(key => {
      const translatedName = this.moduleTranslations[key] || key.replace(/_/g, ' ').toUpperCase();
      return {
        module: translatedName,
        perms: groups[key]
      };
    });
  }

  formatPermissionName(slug: string): string {
    if (!slug) return '';
    if (slug.startsWith('module_')) return 'Acceder al Módulo';
    if (slug.startsWith('add_')) return 'Crear / Agregar';
    if (slug.startsWith('edit_')) return 'Editar';
    if (slug.startsWith('delete_')) return 'Eliminar';
    if (slug.startsWith('view_')) return 'Ver detalles';
    
    return slug;
  }

  togglePermission(perm: Permission) {
    if (this.selectedPermissionIds.has(perm.id!)) {
      this.selectedPermissionIds.delete(perm.id!);
    } else {
      this.selectedPermissionIds.add(perm.id!);
    }
    this.rol.permissions = this.permissions.filter(p => this.selectedPermissionIds.has(p.id!));
  }

  isPermissionSelected(permId: number): boolean {
    return this.selectedPermissionIds.has(permId);
  }

  saveRol() {
    this.loading = true;
    if (this.isEdit) {
      this.rS.put(this.rol).subscribe(() => {
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Perfil actualizado', showConfirmButton: false, timer: 2000 });
        this.router.navigate(['/admin/roles']);
      });
    } else {
      this.rS.post(this.rol).subscribe(() => {
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Perfil creado', showConfirmButton: false, timer: 2000 });
        this.router.navigate(['/admin/roles']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin/roles']);
  }
}
