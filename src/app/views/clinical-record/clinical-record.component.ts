import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClinicalRecordService } from '../../core/services/clinical-record.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

export interface ClinicalNote {
  id: number | null;
  subjective: string;
  objective: string;
  analysis: string;
  plan: string;
  diagnoses: string[];
  weight: number | null;
  blood_pressure: string;
  temperature: number | null;
  heart_rate: number | null;
  respiratory_rate?: number | null;
  oxygen_saturation?: number | null;
  status?: string;
  signed_at?: string;
  doctor?: any;
}

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
  history: ClinicalNote[] = [];
  activeQueue: any[] = [];
  currentTurn: any = null;
  waitingQueue: any[] = [];
  nextTurn: any = null;
  remainingQueue: any[] = [];

  activeTab = 'soap';

  isReadOnly = false;
  isLoading = true;
  selectedPastNote: ClinicalNote | null = null;

  note: ClinicalNote = {
    id: null,
    subjective: '',
    objective: '',
    analysis: '',
    plan: '',
    diagnoses: [],
    weight: null,
    blood_pressure: '',
    temperature: null,
    heart_rate: null
  };

  newDiagnosisText = '';

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

  addDiagnosis() {
    if (this.newDiagnosisText.trim() && !this.isReadOnly) {
      if (!this.note.diagnoses) this.note.diagnoses = [];
      this.note.diagnoses.push(this.newDiagnosisText.trim());
      this.newDiagnosisText = '';
    }
  }

  removeDiagnosis(index: number) {
    if (!this.isReadOnly && this.note.diagnoses) {
      this.note.diagnoses.splice(index, 1);
    }
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
    const client = this.currentTurn?.schedule?.client || this.medicalRecord?.client;
    const clientName = client ? `${client.name} ${client.lastname}` : 'Paciente';
    const doctorName = noteData?.doctor ? `${noteData.doctor.name} ${noteData.doctor.lastname}` : 'Médico Tratante';
    const doctorSpecialty = noteData?.doctor?.specialty || 'Médico Cirujano y Partero';
    const doctorLicense = noteData?.doctor?.professional_license || 'PENDIENTE';
    const doctorUniversity = noteData?.doctor?.university ? `Egresado de: ${noteData.doctor.university}` : '';

    const age = client?.birthdate ? Math.floor((new Date().getTime() - new Date(client.birthdate).getTime()) / 31557600000) + ' años' : '--';
    
    // Convert newlines in plan to HTML breaks
    const planHtml = noteData?.plan ? noteData.plan.replace(/\n/g, '<br>') : 'Sin indicaciones registradas.';
    
    // Format diagnoses
    const diagnosesHtml = (noteData?.diagnoses && noteData.diagnoses.length > 0) 
      ? noteData.diagnoses.map(dx => `<li>${dx}</li>`).join('') 
      : '<li>Sin diagnóstico registrado</li>';

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Receta Médica - ${clientName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap');
            body { 
              font-family: 'Outfit', sans-serif; 
              padding: 40px; 
              color: #2b3a42; 
              line-height: 1.5; 
              background: #fff;
            }
            .recipe-container {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #e2e8f0;
              padding: 40px;
              border-radius: 12px;
              position: relative;
            }
            .header { 
              border-bottom: 3px solid #84a59d; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
              display: flex; 
              justify-content: space-between; 
              align-items: flex-end; 
            }
            .clinic-brand h1 { margin: 0; color: #3a4a40; font-size: 28px; font-weight: 600; }
            .clinic-brand p { margin: 5px 0 0; font-size: 14px; color: #64748b; }
            .doc-info { text-align: right; font-size: 14px; color: #475569; }
            .doc-info strong { color: #3a4a40; font-size: 16px; }
            
            .patient-box {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 15px 20px;
              display: flex;
              flex-wrap: wrap;
              gap: 20px;
              margin-bottom: 30px;
              font-size: 14px;
            }
            .patient-box div { flex: 1; min-width: 150px; }
            .patient-box label { display: block; font-size: 12px; color: #64748b; font-weight: 500; text-transform: uppercase; margin-bottom: 4px; }
            .patient-box span { font-weight: 500; color: #0f172a; }

            .vitals-bar {
              display: flex;
              gap: 15px;
              font-size: 13px;
              margin-bottom: 30px;
              border-bottom: 1px dashed #cbd5e1;
              padding-bottom: 15px;
            }
            .vitals-bar div { display: flex; align-items: center; gap: 5px; }
            .vitals-bar label { color: #64748b; font-weight: 500; }
            
            .section-title {
              font-size: 16px;
              color: #3a4a40;
              font-weight: 600;
              margin-bottom: 15px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .rx-symbol {
              font-size: 40px;
              color: #84a59d;
              font-weight: 300;
              font-family: serif;
              margin-bottom: 10px;
            }

            .diagnoses {
              margin-bottom: 30px;
              font-size: 14px;
              color: #334155;
            }
            .diagnoses ul { margin: 5px 0 0; padding-left: 20px; }

            .prescription {
              font-size: 15px;
              min-height: 250px;
              color: #1e293b;
            }

            .footer {
              margin-top: 60px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            
            .signature {
              text-align: center;
              width: 280px;
            }
            .signature-line {
              border-top: 1px solid #1e293b;
              padding-top: 8px;
              font-size: 14px;
              font-weight: 500;
              color: #334155;
            }
            
            .qr-code {
              width: 80px;
              height: 80px;
              border: 1px solid #cbd5e1;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              color: #94a3b8;
              text-align: center;
            }

            @media print { 
              body { padding: 0; background: none; } 
              .recipe-container { border: none; padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="recipe-container">
            <div class="header">
              <div class="clinic-brand">
                <h1>Serene Spa & Clinic</h1>
                <p>Especialidades Médicas y Bienestar</p>
              </div>
              <div class="doc-info">
                <strong>Dr. ${doctorName}</strong><br>
                ${doctorSpecialty}<br>
                Cédula Profesional: ${doctorLicense}<br>
                ${doctorUniversity ? doctorUniversity + '<br>' : ''}
                Fecha: ${new Date().toLocaleDateString()}
              </div>
            </div>

            <div class="patient-box">
              <div>
                <label>Paciente</label>
                <span>${clientName}</span>
              </div>
              <div>
                <label>Edad</label>
                <span>${age}</span>
              </div>
              <div>
                <label>Alergias</label>
                <span style="color: ${this.medicalRecord?.allergies ? '#dc2626' : 'inherit'}">${this.medicalRecord?.allergies || 'Negadas'}</span>
              </div>
            </div>

            <div class="vitals-bar">
              <div><label>Peso:</label> ${noteData?.weight || '--'} kg</div>
              <div><label>T/A:</label> ${noteData?.blood_pressure || '--'}</div>
              <div><label>Temp:</label> ${noteData?.temperature || '--'} °C</div>
              <div><label>FC:</label> ${noteData?.heart_rate || '--'} lpm</div>
            </div>

            <div class="diagnoses">
              <div class="section-title">Diagnósticos (CIE-10):</div>
              <ul>${diagnosesHtml}</ul>
            </div>

            <div class="rx-symbol">Rx.</div>
            <div class="prescription">
              ${planHtml}
            </div>

            <div class="footer">
              <div class="qr-code">Espacio<br>para QR</div>
              <div class="signature">
                <div class="signature-line">Firma del Médico Tratante</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Válido por 30 días a partir de su expedición</div>
              </div>
            </div>
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
