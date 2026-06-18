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
    start: '',
    end: '',
    color: '#a2d2ff',
    allDay: false
  };

  readonly colorPalette = [
    '#a2d2ff', '#ffc8dd', '#bde0fe',
    '#ffadad', '#fdffb6', '#caffbf',
    '#c9b1ff', '#ffd6a5'
  ];

  clients: { id: number; fullname: string }[] = [];

  constructor(
    private scheduleService: ScheduleService,
    private clientService: ClientService,
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
      this.clients = Array.isArray(res) ? res : [];
    });
  }

  loadEvents() {
    this.scheduleService.getAll().subscribe((res: any) => {
      const data = Array.isArray(res) ? res : [];
      this.allEvents = data.map((ev: any) => ({
        id: ev.id.toString(),
        title: ev.title || 'Sin título',
        start: ev.start,
        end: ev.end,
        allDay: ev.allDay == 1,
        backgroundColor: ev.color || '#a2d2ff',
        borderColor: ev.color || '#a2d2ff',
        textColor: '#3A4A40',
        extendedProps: {
          description: ev.description,
          client_id: ev.client_id,
          client_name: ev.client?.fullname || ev.client?.name || ''
        }
      }));
      this.filterEvents(this.searchTerm);
    });
  }

  openModal() {
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showModal = false;
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
      start: selectInfo.startStr.substring(0, 16),
      end: selectInfo.endStr.substring(0, 16),
      color: '#a2d2ff',
      allDay: selectInfo.allDay
    };

    this.openModal();
  }

  handleEventClick(clickInfo: EventClickArg) {
    const ev = clickInfo.event;
    this.formData = {
      id: Number(ev.id),
      title: ev.title,
      description: ev.extendedProps['description'] || '',
      client_id: ev.extendedProps['client_id'],
      start: ev.startStr.substring(0, 16),
      end: (ev.endStr || ev.startStr).substring(0, 16),
      color: ev.backgroundColor,
      allDay: ev.allDay
    };

    this.openModal();
  }

  handleEventDrop(dropInfo: EventDropArg) {
    this.updateEventDates(dropInfo.event);
  }

  handleEventResize(resizeInfo: EventResizeDoneArg) {
    this.updateEventDates(resizeInfo.event);
  }

  updateEventDates(ev: EventApi) {
    const payload = {
      title: ev.title,
      description: ev.extendedProps['description'],
      client_id: ev.extendedProps['client_id'],
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
}
