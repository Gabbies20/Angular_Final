import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import moment from 'moment';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { GuardiaService } from '../servicios/guardias/guardia.service';
import { HeaderComponent } from '../header/header.component';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-guardia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    HeaderComponent,
    FormsModule
  ],
  templateUrl: './guardia.component.html',
  styleUrls: ['./guardia.component.css']
})
export class GuardiaComponent implements OnInit {
  guardiaForm: FormGroup;
  guardias: any[] = [];
  ausencias: any[] = [];
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private guardiaService: GuardiaService
  ) {
    this.guardiaForm = this.fb.group({
      fecha: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.guardiaForm.get('fecha')?.valueChanges.subscribe(value => {
      this.onFechaChange(value);
    });
  }

  onFechaChange(fecha: string) {
    const formattedFecha = moment(fecha).format('YYYY-MM-DD');
    this.guardiaService.obtenerGuardias(formattedFecha).subscribe(
      response => {
        this.guardias = response;
      },
      error => {
        console.error('Error al obtener guardias:', error);
      }
    );
    this.guardiaService.obtenerAusencias(formattedFecha).subscribe(
      response => {
        this.ausencias = response;
      },
      error => {
        console.error('Error al obtener ausencias:', error);
      }
    );
  }

  onSubmit() {
    if (this.guardiaForm.valid) {
      const fecha = this.guardiaForm.value.fecha;
      this.onFechaChange(fecha);
    }
  }

  formatFecha(fecha: string): string {
    const formattedFecha = moment(fecha).format('HH:mm') === '00:00'
      ? 'Todo el día'
      : moment(fecha).format('DD-MM-YYYY HH:mm');
    return formattedFecha;
  }

  crearPDF(): jsPDF {
    const doc = new jsPDF();
    const fecha = moment(this.guardiaForm.value.fecha).format('DD-MM-YYYY');

    // Título
    doc.setFontSize(18);
    doc.setTextColor(34, 139, 34); // Verde
    doc.text('Reporte de Guardias y Ausencias', 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Negro
    doc.text(`Fecha: ${fecha}`, 14, 30);

    // Guardias
    if (this.guardias.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(34, 139, 34); // Verde
      doc.text('Guardias', 14, 40);

      (doc as any).autoTable({
        startY: 45,
        head: [['Profesor', 'Franja', 'Asignatura']],
        body: this.guardias.map(guardia => [
          guardia.profesor,
          guardia.franja,
          guardia.asignatura
        ]),
        theme: 'grid',
        headStyles: { fillColor: [34, 139, 34], textColor: [255, 255, 255] }, // Verde y texto blanco
        bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }, // Blanco y texto negro
        alternateRowStyles: { fillColor: [216, 240, 232] }, // Verde claro
      });
    } else {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Negro
      doc.text('No se encontraron guardias para la fecha seleccionada.', 14, 45);
    }

    // Espacio entre tablas
    const lastTableY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : 60;

    // Ausencias
    if (this.ausencias.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(34, 139, 34); // Verde
      doc.text('Ausencias', 14, lastTableY + 20);

      (doc as any).autoTable({
        startY: lastTableY + 25,
        head: [['Profesor', 'Fecha', 'Asignatura']],
        body: this.ausencias.map(ausencia => {
          const fechaAusencia = moment(ausencia.fecha);
          const hora = fechaAusencia.format('HH:mm');
          if (hora === '00:00') {
            return [ausencia.profesor, 'Todo el día', ''];
          } else {
            return [ausencia.profesor, fechaAusencia.format('DD-MM-YYYY HH:mm'), ausencia.asignatura];
          }
        }),
        theme: 'grid',
        headStyles: { fillColor: [34, 139, 34], textColor: [255, 255, 255] }, // Verde y texto blanco
        bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }, // Blanco y texto negro
        alternateRowStyles: { fillColor: [216, 240, 232] }, // Verde claro
      });
    } else {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Negro
      doc.text('No se encontraron ausencias para la fecha seleccionada.', 14, lastTableY + 20);
    }

    return doc;
  }

  imprimirPDF() {
    const doc = this.crearPDF();
    const fecha = moment(this.guardiaForm.value.fecha).format('DD-MM-YYYY');
    doc.save(`reporte_guardias_ausencias_${fecha}.pdf`);
  }

  // enviarPDF() {
  //   const doc = this.crearPDF();
  //   const pdfBlob = doc.output('blob');
  //   const email = this.email; // Reemplaza con el email del destinatario
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     const base64data = reader.result?.toString().split(',')[1];
  //     if (base64data) {
  //       this.guardiaService.enviarPDFCorreo(base64data, email).subscribe(
  //         response => {
  //           console.log('PDF enviado por correo:', response);
  //           alert('PDF enviado exitosamente por correo.');
  //         },
  //         error => {
  //           console.error('Error al enviar el PDF por correo:', error);
  //           alert('Error al enviar el PDF por correo.');
  //         }
  //       );
  //     }
  //   };
  //   reader.readAsDataURL(pdfBlob);
  // }
}
