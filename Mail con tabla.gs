function generarReporteConsolidado() {
  // --- 1. CONFIGURACIÓN ---
  const ID_PLANTILLA = '1ZTSRc8smnYImF_jNsDvFivrzBCV7RtxkvL2oIs3uDOE'; 
  const EMAIL_DESTINO = 'tmonteror04@educarex.es'; 
  const ID_CARPETA_HISTORICO = '1KmUCQdqXce0YiCgsTbrUNxi5jbBEGfzg';
  const ASUNTO_EMAIL = 'Reporte consolidado de respuestas';
  const NOMBRE_ARCHIVO = 'Reporte Global - ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");

  // --- NUEVA CONFIGURACIÓN: COLUMNAS SELECCIONADAS ---
  // Define aquí los índices de las columnas que quieres (A=0, B=1, C=2, etc.)
  // Ejemplo: [0, 1, 3] incluirá solo las columnas A, B y D.
  const COLUMNAS_A_INCLUIR = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; 
  const FORMATO_APAISADO = true; // <--- CAMBIA A 'false' PARA VERTICAL

  // --- 2. OBTENER DATOS DE LA HOJA ---
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const datosOriginales = hoja.getDataRange().getValues();

  if (datosOriginales.length === 0) {
    Logger.log("No hay datos para procesar.");
    return;
  }

  // --- 3. FILTRADO Y LIMPIEZA DE DATOS ---
  const datosFiltradosYLimpios = datosOriginales.map(fila => {
    // Primero filtramos la fila para quedarnos solo con las columnas deseadas
    return COLUMNAS_A_INCLUIR.map(indice => {
      const celda = fila[indice];
      
      // Aplicamos la lógica de limpieza que ya tenías
      if (celda instanceof Date) {
        return Utilities.formatDate(celda, Session.getScriptTimeZone(), "dd/MM/yyyy");
      } else if (celda === null || celda === undefined || celda === "") {
        return " "; // Espacio en blanco para evitar errores de tabla vacía
      } else {
        return String(celda);
      }
    });
  });

 try {
    // --- 4. PREPARAR EL DOCUMENTO ---
    const archivoCopia = DriveApp.getFileById(ID_PLANTILLA).makeCopy(NOMBRE_ARCHIVO);
    const docCopia = DocumentApp.openById(archivoCopia.getId());
    const cuerpo = docCopia.getBody();

    // --- NUEVO: CONFIGURAR ORIENTACIÓN DE PÁGINA ---
    // Medidas estándar A4 en puntos: 595.0 x 842.0
    if (FORMATO_APAISADO) {
      cuerpo.setPageHeight(595.0);
      cuerpo.setPageWidth(842.0);
    } else {
      cuerpo.setPageHeight(842.0);
      cuerpo.setPageWidth(595.0);
    }

    // Reemplazar marcador de fecha si existe
    const fechaHoy = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");
    cuerpo.replaceText('{{Fecha}}', fechaHoy);

    // --- NUEVO: SECCIÓN DE RESUMEN ---
    const totalRegistros = datosFiltradosYLimpios.length - 1; // Restamos la fila de encabezado
    
    cuerpo.appendParagraph('RESUMEN EJECUTIVO')
          .setHeading(DocumentApp.ParagraphHeading.HEADING1)
          .setAlignment(DocumentApp.HorizontalAlignment.CENTER);

    const resumen = cuerpo.appendParagraph(
      `Este reporte contiene un consolidado de las respuestas recibidas hasta la fecha.\n` +
      `• Total de registros procesados: ${totalRegistros}\n` +
      `• Fecha de generación: ${fechaHoy}\n`
    );
    resumen.setSpacingAfter(20);

    // --- 5. VOLCAR LOS DATOS (Tabla con Estilo Pro) ---
    cuerpo.appendParagraph('DETALLE DE LOS REGISTROS')
          .setHeading(DocumentApp.ParagraphHeading.HEADING2)
          .setSpacingBefore(15);
    
    const tabla = cuerpo.appendTable(datosFiltradosYLimpios);
    
    // Estilos de tabla
    tabla.setBorderColor('#BDBDBD').setBorderWidth(0.5).setAttributes({
      [DocumentApp.Attribute.FONT_FAMILY]: 'Arial',
      [DocumentApp.Attribute.FONT_SIZE]: 9
    });

    // Cabecera
    const filaHeader = tabla.getRow(0);
    for (let i = 0; i < filaHeader.getNumCells(); i++) {
      const celda = filaHeader.getCell(i);
      celda.setBackgroundColor('#2C3E50');
      celda.editAsText().setForegroundColor('#FFFFFF').setBold(true).setFontSize(10);
    }

    // Efecto Cebra
    for (let i = 1; i < tabla.getNumRows(); i++) {
      if (i % 2 !== 0) {
        for (let j = 0; j < tabla.getRow(i).getNumCells(); j++) {
          tabla.getRow(i).getCell(j).setBackgroundColor('#F2F2F2');
        }
      }
    }

    docCopia.saveAndClose();

    // --- 6. GENERAR PDF Y GUARDAR ---
    const pdfBlob = archivoCopia.getAs('application/pdf');
    pdfBlob.setName(NOMBRE_ARCHIVO + ".pdf");

    const carpetaDestino = DriveApp.getFolderById(ID_CARPETA_HISTORICO);
    carpetaDestino.createFile(pdfBlob);

    // --- 7. ENVIAR POR CORREO (HTML ENRIQUECIDO) ---
    
    // Definimos el cuerpo del mensaje en HTML
    const mensajeHTML = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2C3E50; padding: 20px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 22px; letter-spacing: 1px;">Reporte Consolidado</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.8; font-size: 14px;">Generado automáticamente por el Sistema</p>
        </div>
        
        <div style="padding: 30px; background-color: #ffffff;">
          <p style="color: #333; font-size: 16px;">Hola,</p>
          <p style="color: #555; line-height: 1.6;">Se ha generado el reporte correspondiente a los registros procesados. A continuación, un breve resumen de los datos incluidos:</p>
          
          <div style="background-color: #f8f9fa; border-left: 4px solid #2C3E50; padding: 15px; margin: 20px 0;">
            <p style="margin: 5px 0; color: #333;"><strong>Total de registros:</strong> ${totalRegistros}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Fecha:</strong> ${fechaHoy}</p>
          </div>
          
          <p style="color: #555; line-height: 1.6;">El detalle completo se encuentra en el archivo PDF adjunto a este mensaje.</p>
          
        </div>
        
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; color: #888; font-size: 12px;">
          Este es un correo automático. Por favor, no respondas a este mensaje.<br>
          &copy; ${new Date().getFullYear()} | Tu Institución/Empresa
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: EMAIL_DESTINO,
      subject: ASUNTO_EMAIL,
      htmlBody: mensajeHTML, // Aquí usamos htmlBody en lugar de body
      attachments: [pdfBlob]
    });

    // --- 8. LIMPIEZA ---
    archivoCopia.setTrashed(true);
    
    Logger.log('Reporte con resumen enviado con éxito.');

  } catch (e) {
    Logger.log('Ocurrió un error: ' + e.toString());
  }
}
