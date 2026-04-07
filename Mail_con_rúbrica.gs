function generarRubricaPDF(e) {
  // 1. CONFIGURACIÓN INICIAL
  // Sustituye esto por la ID real de tu plantilla de Google Docs
  var idPlantilla = '1pEj1lkGrLS6CqKj3LUWIYwrzC0NnuI6JHoWQuoNhhKo'; 
  
  // 2. RECOGER DATOS BÁSICOS DEL FORMULARIO
  var emailAlumno = e.namedValues['Correo del alumno'][0].trim();
  var nombreAlumno = e.namedValues['Nombre del alumno'][0].trim();
  var comentarios = e.namedValues['Comentarios finales (Áreas de fortaleza y sugerencias de mejora)'][0] || '';

  // 3. DICCIONARIO DE PUNTUACIONES (De texto a número)
  var puntos = {
    "Excelente": 4,
    "Bien": 3,
    "Regular": 2,
    "Necesita mejorar": 1
  };

  // 4. RECOGER TEXTOS DE LA CUADRÍCULA Y TRADUCIR A NÚMEROS
  // ¡OJO! Cambia el texto entre corchetes por el nombre exacto de tus columnas del Excel
  var textoDestreza1 = e.namedValues['Evaluación de la Presentación [Expresión Oral (Fluidez, dicción, tono)]'][0] || '';
  var textoDestreza2 = e.namedValues['Evaluación de la Presentación [Contenido (Claridad, organización, profundidad del tema)]'][0] || '';
  var textoDestreza3 = e.namedValues['Evaluación de la Presentación [Lenguaje no verbal (Contacto visual, postura, gestos)]'][0] || '';

  // El código busca la palabra en el diccionario y guarda su valor numérico
  var nota1 = puntos[textoDestreza1] || 0;
  var nota2 = puntos[textoDestreza2] || 0;
  var nota3 = puntos[textoDestreza3] || 0;

  // 5. CÁLCULO DE NOTAS
  var notaTotal = nota1 + nota2 + nota3; // Máximo 12 puntos
  var notaMedia10 = (notaTotal * 10) / 12; // Regla de 3 para calcular sobre 10
  var notaFinalFormateada = notaMedia10.toFixed(2); // Deja solo 2 decimales (ej. 8.33)

  // 6. CREAR DOCUMENTO TEMPORAL
  var archivoPlantilla = DriveApp.getFileById(idPlantilla);
  var copiaTemporal = archivoPlantilla.makeCopy('Feedback - ' + nombreAlumno);
  var idCopiaTemporal = copiaTemporal.getId();
  var documento = DocumentApp.openById(idCopiaTemporal);
  var cuerpo = documento.getBody();

  // 7. REEMPLAZAR LAS ETIQUETAS EN EL DOCUMENTO
  cuerpo.replaceText('{{Nombre}}', nombreAlumno);
  cuerpo.replaceText('{{Comentarios}}', comentarios);
  
  // Reemplazamos los textos cualitativos (Excelente, Bien...)
  cuerpo.replaceText('{{Texto_Destreza1}}', textoDestreza1);
  cuerpo.replaceText('{{Texto_Destreza2}}', textoDestreza2);
  cuerpo.replaceText('{{Texto_Destreza3}}', textoDestreza3);
  
  // Reemplazamos los puntos cuantitativos (4, 3...)
  cuerpo.replaceText('{{Nota_Destreza1}}', nota1.toString());
  cuerpo.replaceText('{{Nota_Destreza2}}', nota2.toString());
  cuerpo.replaceText('{{Nota_Destreza3}}', nota3.toString());
  
  // Reemplazamos las notas finales
  cuerpo.replaceText('{{Nota_Total}}', notaTotal.toString());
  cuerpo.replaceText('{{Nota_Sobre_10}}', notaFinalFormateada.toString())
  
  documento.saveAndClose();

  // 8. CONVERTIR A PDF
  var archivoPDF = DriveApp.getFileById(idCopiaTemporal).getAs('application/pdf');
  archivoPDF.setName('Informe_Evaluacion_' + nombreAlumno + '.pdf');

  // 9. ENVIAR EL CORREO AL ALUMNO
  var asunto = 'Tu informe de evaluación - ' + nombreAlumno;
  var mensaje = 'Hola ' + nombreAlumno + ',\n\n' +
                'Adjunto a este correo encontrarás el PDF con tu informe detallado de la última evaluación.\n\n' +
                'Tu calificación final es de ' + notaFinalFormateada + ' sobre 10.\n\n' +
                'Un saludo,\nTu profesor.';

  GmailApp.sendEmail(emailAlumno, asunto, mensaje, {
    attachments: [archivoPDF],
    name: 'Tu Profesor' 
  });

  // 10. LIMPIEZA
  copiaTemporal.setTrashed(true); // Envía el documento temporal a la papelera

  // 11. GUARDAR LA NOTA EN LA HOJA DE CÁLCULO
  var hoja = e.range.getSheet(); // Identifica en qué hoja estamos trabajando
  var fila = e.range.getRow();   // Identifica en qué fila exacta acaba de entrar la respuesta
  
  // ¡ATENCIÓN! Escribe el número de la columna correspondiente a la nota final
  hoja.getRange(fila, 10).setValue(notaFinalFormateada);
}
