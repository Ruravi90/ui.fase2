import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClinicalRecordService } from '../../core/services/clinical-record.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clinical-record',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './clinical-record.component.html',
  styleUrls: ['./clinical-record.component.scss']
})
export class ClinicalRecordComponent implements OnInit {

  clientId!: number;
  scheduleId!: number;

  medicalRecord: any = null;
  history: any[] = [];
  activeQueue: any[] = [];
  currentTurn: any = null;
  waitingQueue: any[] = [];
  nextTurn: any = null;
  remainingQueue: any[] = [];

  activeTab = 'soap';

  isReadOnly = false;
  isLoading = true;
  selectedPastNote: any = null;

  note = {
    id: null,
    subjective: '',
    objective: '',
    analysis: '',
    plan: '',
    weight: null,
    blood_pressure: '',
    temperature: null,
    heart_rate: null
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recordService: ClinicalRecordService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.clientId = Number(params.get('clientId'));
      this.scheduleId = Number(params.get('scheduleId'));
      this.loadHistory();
      this.loadQueue();
    });
  }

  selectHistoryNote(h: any) {
    this.selectedPastNote = h;
    this.isReadOnly = true;
  }

  resumeCurrentNote() {
    this.selectedPastNote = null;
    this.isReadOnly = false;
  }

  loadHistory() {
    this.isLoading = true;
    this.recordService.getHistory(this.clientId).subscribe({
      next: (res) => {
        this.medicalRecord = res.medical_record;
        this.history = res.history;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadQueue(): void {
    const environment = (window as any).__env || { apiUrl: 'http://localhost:8000/api' };
    this.http.get<any[]>(`${environment.apiUrl}/queue/active`).subscribe(res => {
      this.activeQueue = res || [];
      this.currentTurn = this.activeQueue.find(q => q.schedule_id == this.scheduleId) 
                         || this.activeQueue.find(q => q.status === 'in_progress');
      this.waitingQueue = this.activeQueue.filter(q => q.status === 'waiting');
      this.nextTurn = this.waitingQueue.length > 0 ? this.waitingQueue[0] : null;
      this.remainingQueue = this.waitingQueue.slice(1);
      this.cdr.detectChanges();
    });
  }


  advanceTurn(): void {
    const environment = (window as any).__env || { apiUrl: 'http://localhost:8000/api' };
    this.http.post<any>(`${environment.apiUrl}/queue/advance`, {}).subscribe(res => {
      if (res.success) {
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Turno finalizado', showConfirmButton: false, timer: 1500 });
        this.router.navigate(['/schedule']);
      }
    });
  }

  saveDraft() {
    const payload = {
      ...this.note,
      client_id: this.clientId,
      schedule_id: this.scheduleId
    };

    this.recordService.saveDraft(payload).subscribe({
      next: (res) => {
        this.note.id = res.note.id;
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Borrador Guardado', showConfirmButton: false, timer: 1500 });
      },
      error: () => Swal.fire('Error', 'No se pudo guardar el borrador', 'error')
    });
  }

  signAndFinish() {
    if (!this.note.id) {
      // Si no hay ID, guardamos borrador primero y luego firmamos
      const payload = { ...this.note, client_id: this.clientId, schedule_id: this.scheduleId };
      this.recordService.saveDraft(payload).subscribe(res => {
        this.doSign(res.note.id);
      });
    } else {
      this.doSign(this.note.id);
    }
  }

  private doSign(noteId: number) {
    Swal.fire({
      title: '¿Firmar Nota Médica?',
      text: 'Una vez firmada, la nota quedará bloqueada por NOM-024.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, firmar'
    }).then(result => {
      if (result.isConfirmed) {
        this.recordService.signNote(noteId, this.note).subscribe({
          next: () => {
            this.advanceTurn();
          },
          error: () => Swal.fire('Error', 'No se pudo firmar la nota', 'error')
        });
      }
    });
  }

  printRecipe() {
    const noteData = this.isReadOnly ? this.selectedPastNote : this.note;
    const client = this.currentTurn?.schedule?.client;
    const clientName = client ? `${client.name} ${client.lastname}` : 'Paciente';
    
    const printContent = `
      <html>
        <head>
          <title>Receta Médica - ${clientName}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 2rem; color: #3A4A40; line-height: 1.5; }
            .header { border-bottom: 2px solid #84A59D; padding-bottom: 1rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-end; }
            h2 { margin: 0; color: #3A4A40; font-size: 1.5rem; }
            .meta p { margin: 0.25rem 0; font-size: 0.95rem; color: #555; }
            .content { white-space: pre-wrap; font-size: 1rem; margin-top: 2rem; border: 1px solid #eee; padding: 1.5rem; border-radius: 8px; min-height: 300px; }
            .signature { margin-top: 4rem; text-align: center; width: 250px; float: right; }
            .signature-line { border-top: 1px solid #333; padding-top: 0.5rem; font-size: 0.9rem; }
            @media print { body { padding: 0; } .header { margin-top: 1rem; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h2>Serene Spa & Clinic</h2>
              <span style="font-size: 0.85rem; color: #8C9C93;">Receta Médica y Prescripción</span>
            </div>
            <div style="text-align: right; font-size: 0.9rem;">
              <strong>Fecha:</strong> ${new Date().toLocaleDateString()}
            </div>
          </div>
          <div class="meta">
            <p><strong>Paciente:</strong> ${clientName}</p>
            <p><strong>Signos vitales capturados:</strong> Peso: ${noteData.weight || '--'} kg | T/A: ${noteData.blood_pressure || '--'} | Temp: ${noteData.temperature || '--'} °C</p>
          </div>
          <div class="content">${noteData.plan || 'Sin indicaciones registradas.'}</div>
          <div class="signature">
            <div class="signature-line">Firma del Médico Tratante</div>
          </div>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 300);
    }
  }
}
