function generarYEnviarCertificados() {
  // --- CONFIGURACIÓN ---
  const ID_PLANTILLA = '1cA4MN3tC03DVkw-NIyUO-m8ZBv5JD90LffDsj8vxkr8'; // Google Doc utilizando {{ }}
  const ASUNTO_EMAIL = 'Tu Certificado de Asistencia - Formación';
  const NOMBRE_ARCHIVO_PREFIJO = 'Certificado_'; 
  
  // --- CONEXIÓN CON LA HOJA ---
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const filas = hoja.getDataRange().getDisplayValues();
  
  // --- ÍNDICES DE COLUMNAS (Basado en tu lista 1-9) ---
  const COL_EMAIL = 1;      // 1 Dirección de correo
  const COL_TRATAMIENTO = 2; // 2 Tratamiento (Sr./Sra.)
  const COL_NOMBRE = 3;      // 3 Nombre
  const COL_APELLIDOS = 4;   // 4 Apellidos
  const COL_DNI = 5;         // 5 DNI
  const COL_FORMACION = 6;   // 6 Nombre de la formación
  const COL_INICIO = 7;      // 7 Fecha inicio
  const COL_FIN = 8;         // 8 Fecha fin
  const COL_DURACION = 9;    // 9 Duración
  const COL_ESTADO = 10;      // 10 Columna J (Donde pondremos "Enviado") - Asegúrate que existe

  // --- PROCESO ---
  for (let i = 1; i < filas.length; i++) {
    const fila = filas[i];
    
    // Asignación de variables desde la fila
    const emailDestino = fila[COL_EMAIL];
    const tratamiento = fila[COL_TRATAMIENTO];
    const nombre = fila[COL_NOMBRE];
    const apellidos = fila[COL_APELLIDOS];
    const dni = fila[COL_DNI];
    const curso = fila[COL_FORMACION];
    const fInicio = fila[COL_INICIO];
    const fFin = fila[COL_FIN];
    const duracion = fila[COL_DURACION];
    const estado = fila[COL_ESTADO];
    
    // Validación: Si ya enviado o no hay email, saltar
    if (estado === 'Enviado' || !emailDestino) continue;

    try {
      // 1. Crear copia de la plantilla y reemplazar datos en el DOC
      const copiaId = DriveApp.getFileById(ID_PLANTILLA).makeCopy().getId();
      const docCopia = DocumentApp.openById(copiaId);
      const cuerpoDoc = docCopia.getBody();
      
      cuerpoDoc.replaceText('{{Tratamiento}}', tratamiento);
      cuerpoDoc.replaceText('{{Nombre}}', nombre);
      cuerpoDoc.replaceText('{{Apellidos}}', apellidos);
      cuerpoDoc.replaceText('{{DNI}}', dni);
      cuerpoDoc.replaceText('{{Nombre de la Formación}}', curso);
      cuerpoDoc.replaceText('{{Fecha de inicio de la formación}}', fInicio);
      cuerpoDoc.replaceText('{{Fecha de finalización de la formación}}', fFin);
      cuerpoDoc.replaceText('{{Duración}}', duracion);
      
      docCopia.saveAndClose();
      
      // 2. Convertir a PDF
      const pdfBlob = DriveApp.getFileById(copiaId).getAs('application/pdf');
      pdfBlob.setName(NOMBRE_ARCHIVO_PREFIJO + apellidos + "_" + nombre + ".pdf");

      // 3. DISEÑO DEL CUERPO DEL EMAIL (HTML)
      const mensajeHTML = `
        <div style="background-color: #f4f7f9; padding: 25px; font-family: sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; border: 1px solid #ddd;">
            <tr>
              <td style="background-color: #2c3e50; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Diploma de Aprovechamiento</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px; color: #333; line-height: 1.5;">
                <p>Estimado/a <strong>${tratamiento} ${nombre} ${apellidos}</strong> (DNI: ${dni}),</p>
                <p>Es un placer para nosotros enviarle el certificado oficial tras haber completado satisfactoriamente la formación:</p>
                
                <div style="background-color: #eef2f7; padding: 15px; border-left: 4px solid #2c3e50; margin: 15px 0;">
                  <p style="margin: 5px 0;"><strong>Curso:</strong> ${curso}</p>
                  <p style="margin: 5px 0;"><strong>Periodo:</strong> del ${fInicio} al ${fFin}</p>
                  <p style="margin: 5px 0;"><strong>Reconocimiento:</strong> ${duracion}</p>
                </div>
                
                <p>En el archivo adjunto encontrará su certificado en formato PDF listo para descargar e imprimir.</p>
                <p>Atentamente,<br><strong>Departamento de Formación</strong></p>
              </td>
            </tr>
            <tr>
              <td style="padding: 15px; text-align: center; font-size: 11px; color: #999;">
                Este correo ha sido generado automáticamente para el alumno ${emailDestino}.
              </td>
            </tr>
          </table>
        </div>
      `;

      // 4. ENVIAR EMAIL
      MailApp.sendEmail({
        to: emailDestino,
        subject: ASUNTO_EMAIL + ": " + curso,
        htmlBody: mensajeHTML,
        attachments: [pdfBlob]
      });
      
      // 5. LIMPIEZA: Borrar copia temporal y marcar hoja
      DriveApp.getFileById(copiaId).setTrashed(true);
      hoja.getRange(i + 1, COL_ESTADO + 1).setValue('Enviado');
      
      Logger.log('Enviado correctamente a: ' + emailDestino);
      
    } catch (e) {
      Logger.log('Error en fila ' + (i+1) + ': ' + e.toString());
      hoja.getRange(i + 1, COL_ESTADO + 1).setValue('Error');
    }
  }
}
