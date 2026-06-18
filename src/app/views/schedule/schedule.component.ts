import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
import { Package } from '../../models';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule, NgSelectModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {

  showModal = false;

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
  allEvents: any[] = [];        // todos los eventos para filtrado client-side
  searchTerm = '';
  private searchSubject = new Subject<string>();

  formData = {
    id: null as number | null,
    title: '',
    description: '',
    client_id: null as number | null,
    package_id: null as number | null,
    start: '',
    end: '',
    color: '#a2d2ff',
    allDay: false
  };

  isTaken: boolean = false;

  readonly colorPalette = [
    '#a2d2ff', '#ffc8dd', '#bde0fe',
    '#ffadad', '#fdffb6', '#caffbf',
    '#c9b1ff', '#ffd6a5'
  ];

  clients: { id: number; fullname: string }[] = [];
  clientPackages: Package[] = [];

  constructor(
    private scheduleService: ScheduleService,
    private clientService: ClientService,
    private packageService: PackageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadClients();
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(term => {
      this.filterEvents(term);
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
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

  loadClients() {
    this.clientService.get().subscribe((res: any) => {
      const raw = Array.isArray(res) ? res : (res?.data || []);
      this.clients = raw.map((c: any) => ({
        ...c,
        id: Number(c.id),
        fullname: [c.name, c.lastname, c.motherlastname].filter(Boolean).join(' ')
      }));
    });
  }

  loadEvents() {
    this.scheduleService.getAll().subscribe((res: any) => {
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
            is_taken: isTaken,
            client_name: ev.client ? [ev.client.name, ev.client.lastname, ev.client.motherlastname].filter(Boolean).join(' ') : ''
          }
        };
      });
      this.filterEvents(this.searchTerm);
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

  closeModal() {
    this.showModal = false;
    this.formData = {
      id: null, title: '', description: '', client_id: null, package_id: null,
      start: '', end: '', color: '#a2d2ff', allDay: false
    };
    this.clientPackages = [];
    this.isTaken = false;
    this.cdr.detectChanges();
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
      start: ev.startStr.substring(0, 16),
      end: (ev.endStr || ev.startStr).substring(0, 16),
      color: ev.backgroundColor,
      allDay: ev.allDay
    };
    this.isTaken = ev.extendedProps['is_taken'] || false;

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

  saveEvent() {
    if (!this.formData.title?.trim()) return;

    const payload = { ...this.formData, allDay: this.formData.allDay ? 1 : 0 };

    if (this.formData.id) {
      this.scheduleService.update(this.formData.id, payload).subscribe({
        next: () => {
          this.closeModal();
          this.loadEvents();
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Cita actualizada', showConfirmButton: false, timer: 1800 });
        }
      });
    } else {
      this.scheduleService.add(payload).subscribe({
        next: () => {
          this.closeModal();
          this.loadEvents();
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Cita agendada', showConfirmButton: false, timer: 1800 });
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
    this.packageService.getActiveForClient(clientId).subscribe((packages: any) => {
      this.clientPackages = packages || [];
    });
  }

  onPackageChange(pkgId: number) {
    if (pkgId) {
      const pkg = this.clientPackages.find(p => p.id === pkgId);
      if (pkg && pkg.type && !this.formData.title) {
        this.formData.title = 'Sesión ' + pkg.type.name;
      }
    }
  }

  confirmCheckIn() {
    if (!this.formData.id) return;
    const currentUserStr = localStorage.getItem('currentUser');
    const user = currentUserStr ? JSON.parse(currentUserStr) : { id: 1 };
    
    Swal.fire({
      title: '¿Confirmar asistencia?',
      text: 'Se descontará una sesión del paquete y se restará del inventario.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed) {
        this.scheduleService.checkIn(this.formData.id!, user.id).subscribe({
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
