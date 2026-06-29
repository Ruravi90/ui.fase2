import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventApi, DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import Swal from 'sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ScheduleService } from '../../services/schedule.service';
import { ClientService } from '../../services/client.service';
import { PackageService } from '../../services/package.service';
import { SaleService } from '../../services/sale.service';
import { AgentService } from '../../services/agent.service';
import { TypeService } from '../../services/type.service';
import { DepartmentService } from '../../services/department.service';
import { UserService } from '../../services/user.service';
import { Package, PackageTracking, Sale, User, _Type } from '../../models';
import { HttpClient } from '@angular/common/http';
import { InitService } from '../../services/init.service';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule, NgSelectModule, RouterModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {

  showModal = false;
  showQuickSaleModal = false;
  quickSaleBusy = false;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día'
    },
    initialView: 'timeGridWeek',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this),
    eventsSet: this.handleEvents.bind(this),
    events: []
  };

  currentEvents: EventApi[] = [];
  allEvents: any[] = [];
  searchTerm = '';
  private searchSubject = new Subject<string>();

  formData = {
    id: null as number | null,
    title: '',
    description: '',
    client_id: null as number | null,
    package_id: null as number | null,
    service_id: null as number | null,
    start: '',
    end: '',
    color: '#a2d2ff',
    allDay: false
  };

  quickSale = {
    catPackageId: null as number | null,
    responsibleId: null as number | null,
    typeSaleId: null as number | null,
    totalPrice: 0,
    amountToday: 0
  };

  isTaken = false;
  currentUser: User = new User();
  defaultDepartmentId = 0;
  catPackages: _Type[] = [];
  catServices: _Type[] = [];
  agents: User[] = [];
  typeSales: _Type[] = [];

  readonly colorPalette = [
    '#a2d2ff', '#ffc8dd', '#bde0fe',
    '#ffadad', '#fdffb6', '#caffbf',
    '#c9b1ff', '#ffd6a5'
  ];

  clients: { id: number; fullname: string }[] = [];
  clientPackages: Package[] = [];

  activeQueue: any[] = [];
  currentTurn: any = null;

  showQuickClient = false;
  quickClientData = { name: '', lastname: '', phone_mobile: '' };
  savingQuickClient = false;
  isExpressMode = false;

  isEventsLoading = true;
  isQueueLoading = true;

  get isLoading(): boolean {
    return this.isEventsLoading || this.isQueueLoading;
  }

  constructor(
    private scheduleService: ScheduleService,
    private clientService: ClientService,
    private packageService: PackageService,
    private saleService: SaleService,
    private agentService: AgentService,
    private typeService: TypeService,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private http: HttpClient,
    private initService: InitService
  ) {
    this.currentUser = this.userService.currentUser;
  }

  ngOnInit(): void {
    this.loadEvents();
    this.loadQueue();
    this.initService.getScheduleInit().subscribe(res => {
      this.catPackages = res.cat_packages;
      this.catServices = res.cat_services;
      this.agents = res.agents;
      this.typeSales = res.cat_type_sales;
      
      const rawClients = Array.isArray(res.clients) ? res.clients : [];
      this.clients = rawClients.map((c: any) => ({
        ...c,
        id: Number(c.id),
        fullname: [c.name, c.lastname, c.motherlastname].filter(Boolean).join(' ')
      }));

      const r = res.departments;
      if (r && r.length) {
        this.defaultDepartmentId = r[0].id!;
        const updates: Partial<CalendarOptions> = {};
        if (r[0].business_hours_start) {
          updates.slotMinTime = r[0].business_hours_start + ':00';
        }
        if (r[0].business_hours_end) {
          updates.slotMaxTime = r[0].business_hours_end + ':00';
        }
        if (Object.keys(updates).length > 0) {
          this.calendarOptions = { ...this.calendarOptions, ...updates };
        }
      }
      this.cdr.detectChanges();
    });
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(term => {
      this.filterEvents(term);
    });
    this.route.queryParams.subscribe(params => {
      const clientId = params['client_id'] ? Number(params['client_id']) : null;
      const packageId = params['package_id'] ? Number(params['package_id']) : null;
      if (clientId) {
        this.openFromQueryParams(clientId, packageId);
      }
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  loadQueue(): void {
    this.isQueueLoading = true;
    const environment = (window as any).__env || { apiUrl: 'http://localhost:8000/api' };
    this.http.get<any[]>(`${environment.apiUrl}/queue/active`).subscribe({
      next: (res) => {
        this.activeQueue = res || [];
        this.currentTurn = this.activeQueue.find(q => q.status === 'in_progress');
        this.isQueueLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isQueueLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getWaitingQueue(): any[] {
    return this.activeQueue.filter(q => q.status === 'waiting');
  }

  advanceTurn(): void {
    const environment = (window as any).__env || { apiUrl: 'http://localhost:8000/api' };
    this.http.post<any>(`${environment.apiUrl}/queue/advance`, {}).subscribe(res => {
      if (res.success) {
        this.loadQueue();
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Turno avanzado', showConfirmButton: false, timer: 1500 });
      }
    });
  }



  filterEvents(term: string) {
    const t = term.trim().toLowerCase();
    const filtered = t
      ? this.allEvents.filter(ev =>
          (ev.extendedProps?.client_name || '').toLowerCase().includes(t) ||
          (ev.title || '').toLowerCase().includes(t)
        )
      : this.allEvents;
    this.calendarOptions = { ...this.calendarOptions, events: filtered };
    this.cdr.detectChanges();
  }

  onSearch(value: string) {
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchSubject.next('');
  }



  loadEvents() {
    this.isEventsLoading = true;
    this.scheduleService.getAll().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : [];
        this.allEvents = data.map((ev: any) => {
          const isTaken = !!ev.tracking;
          const packageId = ev.package_id;
          const evTitle = packageId ? '📦 ' + ev.title : ev.title;

          return {
            id: ev.id.toString(),
            title: evTitle,
            start: ev.start,
            end: ev.end,
            allDay: ev.allDay === 1,
            backgroundColor: ev.color || '#a2d2ff',
            borderColor: ev.color || '#a2d2ff',
            textColor: '#3A4A40',
            extendedProps: {
              description: ev.description,
              client_id: ev.client_id,
              package_id: ev.package_id,
              service_id: ev.service_id,
              is_taken: isTaken,
              client_name: ev.client ? [ev.client.name, ev.client.lastname, ev.client.motherlastname].filter(Boolean).join(' ') : ''
            }
          };
        });
        this.filterEvents(this.searchTerm);
        this.isEventsLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isEventsLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openModal() {
    this.showModal = true;
    if (this.formData.client_id) {
      this.onClientChange(this.formData.client_id);
    } else {
      this.clientPackages = [];
    }
    this.cdr.detectChanges();
  }

  openModalNew() {
    const start = new Date();
    start.setMinutes(0, 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    
    this.formData = {
      id: null,
      title: '',
      description: '',
      client_id: null,
      package_id: null,
      service_id: null,
      start: this.toDatetimeLocal(start),
      end: this.toDatetimeLocal(end),
      color: '#a2d2ff',
      allDay: false
    };
    this.isTaken = false;
    this.isExpressMode = false;
    this.openModal();
  }

  findNextAvailableSlot(baseStart: Date, durationMinutes: number): {start: Date, end: Date} {
    const ms15 = 1000 * 60 * 15;
    let current = new Date(Math.ceil(baseStart.getTime() / ms15) * ms15);
    const durationMs = durationMinutes * 60000;

    while (true) {
      const e1 = new Date(current.getTime() + durationMs);
      const s1Time = current.getTime();
      const e1Time = e1.getTime();
      
      let overlap = false;
      for (const ev of this.allEvents) {
        if (this.formData.id && ev.id === this.formData.id.toString()) continue;
        const s2 = new Date(ev.start).getTime();
        const e2 = new Date(ev.end).getTime();
        if (s1Time < e2 && e1Time > s2) {
          overlap = true;
          break;
        }
      }
      if (!overlap) {
        return { start: current, end: e1 };
      }
      current = new Date(current.getTime() + ms15);
    }
  }

  openExpressModal() {
    const slot = this.findNextAvailableSlot(new Date(), 60); // Default 60 min if no service
    
    this.formData = {
      id: null,
      title: 'Turno Express',
      description: 'Turno generado automáticamente (Walk-in)',
      client_id: null,
      package_id: null,
      service_id: null,
      start: this.toDatetimeLocal(slot.start),
      end: this.toDatetimeLocal(slot.end),
      color: '#ffadad', // Red color for express
      allDay: false
    };
    this.isTaken = false;
    this.isExpressMode = true;
    this.openModal();
  }

  closeModal() {
    this.showModal = false;
    this.formData = {
      id: null, title: '', description: '', client_id: null, package_id: null, service_id: null,
      start: '', end: '', color: '#a2d2ff', allDay: false
    };
    this.clientPackages = [];
    this.isTaken = false;
    this.showQuickClient = false;
    this.quickClientData = { name: '', lastname: '', phone_mobile: '' };
    this.cdr.detectChanges();
  }

  openQuickSaleModal(): void {
    if (!this.formData.client_id) return;
    this.resetQuickSale();
    this.showQuickSaleModal = true;
    this.cdr.detectChanges();
  }

  closeQuickSaleModal(): void {
    this.showQuickSaleModal = false;
    this.resetQuickSale();
    this.cdr.detectChanges();
  }

  resetQuickSale(): void {
    this.quickSale = {
      catPackageId: null,
      responsibleId: null,
      typeSaleId: null,
      totalPrice: 0,
      amountToday: 0
    };
    this.quickSaleBusy = false;
  }

  onQuickPackageSelect(): void {
    const pkg = this.catPackages.find(p => p.id === this.quickSale.catPackageId);
    this.quickSale.totalPrice = Number(pkg?.price || 0);
    if (this.quickSale.amountToday > this.quickSale.totalPrice) {
      this.quickSale.amountToday = this.quickSale.totalPrice;
    }
  }

  onQuickAmountChange(): void {
    if (this.quickSale.amountToday > this.quickSale.totalPrice) {
      this.quickSale.amountToday = this.quickSale.totalPrice;
    }
    if (this.quickSale.amountToday <= 0) {
      this.quickSale.typeSaleId = null;
    }
  }

  canSaveQuickSale(): boolean {
    if (!this.formData.client_id || !this.quickSale.catPackageId || !this.quickSale.responsibleId) {
      return false;
    }
    if (this.quickSale.amountToday > 0 && !this.quickSale.typeSaleId) {
      return false;
    }
    return !this.quickSaleBusy;
  }

  saveQuickSale(): void {
    if (!this.canSaveQuickSale()) return;

    this.quickSaleBusy = true;
    const line = new Sale();
    line.department_id = this.defaultDepartmentId;
    line.client_id = this.formData.client_id!;
    line.responsible_id = this.quickSale.responsibleId!;
    line.user_id = this.currentUser.id;
    line.type_sale_id = this.quickSale.amountToday > 0 ? this.quickSale.typeSaleId! : 0;
    line.count = 1;
    line.price = this.quickSale.totalPrice;
    line.amount = this.quickSale.amountToday || 0;
    line.package_id = this.quickSale.catPackageId!;

    this.saleService.post([line]).subscribe({
      next: (primary) => {
        const packageLine = primary.sales?.find((s: Sale) => s.package_id);
        const instanceId = packageLine?.packages?.[0]?.id;
        this.applyNewPackageSelection(instanceId, this.quickSale.catPackageId!);
        this.closeQuickSaleModal();
        Swal.fire({
          toast: true, position: 'top-end', icon: 'success',
          title: 'Paquete registrado', showConfirmButton: false, timer: 1800
        });
      },
      error: (err) => {
        this.quickSaleBusy = false;
        Swal.fire('Error', err?.error?.error || 'No se pudo registrar la venta', 'error');
      }
    });
  }

  private applyNewPackageSelection(instanceId: number | undefined, catPackageId: number): void {
    this.packageService.getActiveForClient(this.formData.client_id!).subscribe((packages: Package[]) => {
      this.clientPackages = packages || [];
      let selectedId = instanceId;
      if (!selectedId) {
        const match = [...this.clientPackages]
          .filter(p => p.cat_package_id === catPackageId)
          .sort((a, b) => (b.id || 0) - (a.id || 0))[0];
        selectedId = match?.id;
      }
      if (selectedId) {
        this.formData.package_id = selectedId;
        this.onPackageChange(selectedId);
      }
      this.quickSaleBusy = false;
      this.cdr.detectChanges();
    });
  }

  openFromQueryParams(clientId: number, packageId: number | null): void {
    const start = new Date();
    start.setMinutes(0, 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    this.formData = {
      id: null,
      title: '',
      description: '',
      client_id: clientId,
      package_id: packageId,
      service_id: null,
      start: this.toDatetimeLocal(start),
      end: this.toDatetimeLocal(end),
      color: '#a2d2ff',
      allDay: false
    };

    this.packageService.getActiveForClient(clientId).subscribe((packages: Package[]) => {
      this.clientPackages = packages || [];
      if (packageId) {
        this.formData.package_id = packageId;
        this.onPackageChange(packageId);
      }
      this.openModal();
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true
      });
    });
  }

  private toDatetimeLocal(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    this.formData = {
      id: null,
      title: '',
      description: '',
      client_id: null,
      package_id: null,
      service_id: null,
      start: selectInfo.startStr.substring(0, 16),
      end: selectInfo.endStr.substring(0, 16),
      color: '#a2d2ff',
      allDay: selectInfo.allDay
    };

    this.openModal();
  }

  handleEventClick(clickInfo: EventClickArg) {
    const ev = clickInfo.event;
    let cleanTitle = ev.title;
    if (cleanTitle.startsWith('📦 ')) cleanTitle = cleanTitle.substring(3);

    this.formData = {
      id: Number(ev.id),
      title: cleanTitle,
      description: ev.extendedProps['description'] || '',
      client_id: ev.extendedProps['client_id'] ? Number(ev.extendedProps['client_id']) : null,
      package_id: ev.extendedProps['package_id'] ? Number(ev.extendedProps['package_id']) : null,
      service_id: ev.extendedProps['service_id'] ? Number(ev.extendedProps['service_id']) : null,
      start: ev.startStr.substring(0, 16),
      end: (ev.endStr || ev.startStr).substring(0, 16),
      color: ev.backgroundColor,
      allDay: ev.allDay
    };
    this.isTaken = ev.extendedProps['is_taken'] || false;
    this.isExpressMode = ev.backgroundColor === '#ffadad' || cleanTitle.includes('Express');

    this.openModal();
  }

  handleEventDrop(dropInfo: EventDropArg) {
    this.updateEventDates(dropInfo.event);
  }

  handleEventResize(resizeInfo: EventResizeDoneArg) {
    const ev = resizeInfo.event;
    this.scheduleService.update(Number(ev.id), {
      title: ev.title.startsWith('📦 ') ? ev.title.substring(3) : ev.title,
      description: ev.extendedProps['description'],
      client_id: ev.extendedProps['client_id'],
      package_id: ev.extendedProps['package_id'],
      service_id: ev.extendedProps['service_id'],
      start: ev.startStr,
      end: ev.endStr || ev.startStr,
      color: ev.backgroundColor,
      allDay: ev.allDay ? 1 : 0
    }).subscribe();
  }

  updateEventDates(ev: EventApi) {
    const payload = {
      title: ev.title.startsWith('📦 ') ? ev.title.substring(3) : ev.title,
      description: ev.extendedProps['description'],
      client_id: ev.extendedProps['client_id'],
      package_id: ev.extendedProps['package_id'],
      service_id: ev.extendedProps['service_id'],
      start: ev.startStr,
      end: ev.endStr || ev.startStr,
      color: ev.backgroundColor,
      allDay: ev.allDay ? 1 : 0
    };

    this.scheduleService.update(Number(ev.id), payload).subscribe({
      next: () => {
        Swal.fire({
          toast: true, position: 'top-end', icon: 'success',
          title: 'Cita reagendada', showConfirmButton: false, timer: 1500
        });
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar la cita', 'error');
        this.loadEvents();
      }
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  hasOverlap(): boolean {
    const s1 = new Date(this.formData.start).getTime();
    const e1 = new Date(this.formData.end).getTime();

    for (const ev of this.allEvents) {
      if (this.formData.id && ev.id === this.formData.id.toString()) continue;
      
      const s2 = new Date(ev.start).getTime();
      const e2 = new Date(ev.end).getTime();

      if (s1 < e2 && e1 > s2) {
        return true;
      }
    }
    return false;
  }

  saveEvent() {
    if (!this.formData.title?.trim()) return;

    if (this.hasOverlap()) {
      Swal.fire('Atención', 'El horario se empalma con otra cita.', 'warning');
      return;
    }

    const payload = { ...this.formData, allDay: this.formData.allDay ? 1 : 0, is_express: this.isExpressMode };

    if (this.formData.id) {
      this.scheduleService.update(this.formData.id, payload).subscribe({
        next: () => {
          this.closeModal();
          this.loadEvents();
          this.loadQueue();
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Cita actualizada', showConfirmButton: false, timer: 1800 });
        },
        error: (err) => {
          Swal.fire('Error', err?.error?.error || 'No se pudo actualizar la cita', 'error');
        }
      });
    } else {
      this.scheduleService.add(payload).subscribe({
        next: () => {
          this.closeModal();
          this.loadEvents();
          this.loadQueue();
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Cita agendada', showConfirmButton: false, timer: 1800 });
        },
        error: (err) => {
          Swal.fire('Error', err?.error?.error || 'No se pudo agendar la cita', 'error');
        }
      });
    }
  }

  deleteEvent() {
    if (!this.formData.id) return;

    Swal.fire({
      title: '¿Eliminar esta cita?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e85d5d',
      cancelButtonColor: '#bdc3c7',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.scheduleService.delete(this.formData.id!).subscribe({
          next: () => {
            this.closeModal();
            this.loadEvents();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Cita eliminada', showConfirmButton: false, timer: 1800 });
          }
        });
      }
    });
  }

  onClientChange(clientId: number) {
    if (!clientId) {
      this.clientPackages = [];
      this.formData.package_id = null;
      return;
    }
    this.packageService.getActiveForClient(clientId).subscribe((packages: Package[]) => {
      this.clientPackages = packages || [];
    });
  }

  onPackageChange(pkgId: number) {
    if (pkgId) {
      const pkg = this.clientPackages.find(p => p.id === pkgId);
      if (pkg && pkg.type) {
        if (!this.formData.title || this.formData.title === 'Turno Express') {
          this.formData.title = 'Sesión ' + pkg.type.name;
        }
        if (pkg.type.duration_minutes && this.formData.start) {
          if (this.isExpressMode) {
             const slot = this.findNextAvailableSlot(new Date(), pkg.type.duration_minutes);
             this.formData.start = this.toDatetimeLocal(slot.start);
             this.formData.end = this.toDatetimeLocal(slot.end);
          } else {
             const start = new Date(this.formData.start);
             const end = new Date(start.getTime() + pkg.type.duration_minutes * 60000);
             this.formData.end = this.toDatetimeLocal(end);
          }
        }
      }
    }
  }

  onServiceChange(srvId: number) {
    if (srvId) {
      const srv = this.catServices.find(s => s.id === srvId);
      if (srv) {
        if (!this.formData.title || this.formData.title === 'Turno Express') {
          this.formData.title = srv.name || '';
        }
        if (srv.duration_minutes && this.formData.start) {
          if (this.isExpressMode) {
             const slot = this.findNextAvailableSlot(new Date(), srv.duration_minutes);
             this.formData.start = this.toDatetimeLocal(slot.start);
             this.formData.end = this.toDatetimeLocal(slot.end);
          } else {
             const start = new Date(this.formData.start);
             const end = new Date(start.getTime() + srv.duration_minutes * 60000);
             this.formData.end = this.toDatetimeLocal(end);
          }
        }
      }
    }
  }

  saveQuickClient() {
    if (!this.quickClientData.name || !this.quickClientData.lastname || !this.quickClientData.phone_mobile) {
      Swal.fire('Atención', 'Por favor, llena nombre, apellido y teléfono.', 'warning');
      return;
    }
    this.savingQuickClient = true;
    const payload = {
      ...this.quickClientData,
      phone_home: this.quickClientData.phone_mobile,
      reference_id: -1,
      other_ref: 'Turno Express / Agenda'
    };

    const environment = (window as any).__env || { apiUrl: 'http://localhost:8000/api' };
    this.http.post<any>(`${environment.apiUrl}/clients`, payload).subscribe({
      next: (res) => {
        this.savingQuickClient = false;
        this.showQuickClient = false;
        const newClient = res.data || res;
        this.clients = [...this.clients, {
          ...newClient,
          id: Number(newClient.id),
          fullname: [newClient.name, newClient.lastname].filter(Boolean).join(' ')
        }];
        this.formData.client_id = Number(newClient.id);
        this.onClientChange(this.formData.client_id);
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Cliente registrado', showConfirmButton: false, timer: 1500 });
      },
      error: (err) => {
        this.savingQuickClient = false;
        Swal.fire('Error', err?.error?.message || err?.error || 'No se pudo registrar el cliente', 'error');
      }
    });
  }

  getSessionsRemaining(pkg: Package): number {
    const total = pkg.type?.session_count || 0;
    const used = pkg.tracking?.length || 0;
    return Math.max(total - used, 0);
  }

  getLastTakenSessionDate(pkg: Package): Date | null {
    const taken = (pkg.tracking || []).filter(t => this.isSessionTaken(t));
    if (!taken.length) return null;

    const timestamps = taken
      .map(t => new Date(t.scheduled_date as string).getTime())
      .filter(ts => !Number.isNaN(ts));

    if (!timestamps.length) return null;
    return new Date(Math.max(...timestamps));
  }

  private isSessionTaken(track: PackageTracking): boolean {
    const taken = track.is_taken as boolean | number | string;
    return taken === true || taken === 1 || taken === '1';
  }

  confirmCheckIn() {
    if (!this.formData.id) return;
    const userId = this.currentUser?.id;

    if (!userId) {
      Swal.fire('Sesión requerida', 'No se pudo identificar al usuario activo.', 'warning');
      return;
    }

    Swal.fire({
      title: '¿Confirmar asistencia?',
      text: 'Se descontará una sesión del paquete y se restará del inventario.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed) {
        this.scheduleService.checkIn(this.formData.id!, userId).subscribe({
          next: () => {
            Swal.fire('¡Confirmado!', 'La asistencia se ha registrado.', 'success');
            this.closeModal();
            this.loadEvents();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'Hubo un problema al confirmar asistencia', 'error');
          }
        });
      }
    });
  }
}
