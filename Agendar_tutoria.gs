function agendarTutoria(e) {
  // 1. Recoger los datos del formulario
  // ¡OJO! Cambia los textos entre comillas si tus preguntas se llaman diferente 
  var emailPadre = e.namedValues['Dirección de correo electrónico'][0]; 
  var nombrePadre = e.namedValues['Nombre y apellidos (Padre/Madre/Tutor legal)'][0];
  var nombreAlumno = e.namedValues['Nombre completo del alumno/a'][0];
  var curso = e.namedValues['¿En qué curso está matriculado/a el/la estudiante?'][0];
  var fecha = e.namedValues['Fecha preferida para la tutoría (Recuerda: Martes de 13h a 14h)'][0]; 
  var hora = e.namedValues['Hora preferida para la tutoría (Recuerda: Martes entre 13:00 y 14:00)'][0].replace(/'/g, '').trim();
  var materia = e.namedValues['Materia sobre la que quiere hablar'][0];
  var traductor = e.namedValues['¿Necesita traductor o ayuda especial?'][0];
  var modalidad = e.namedValues['¿Cómo prefieres que se realice la tutoría?'][0];
  

  // 2. Calcular las fechas
  var partesFecha = fecha.split("/"); 
  var partesHora = hora.split(":");
  var fechaInicio = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0], partesHora[0], partesHora[1]);
  var duracionMinutos = 30;
  var fechaFin = new Date(fechaInicio.getTime() + duracionMinutos * 60000);

  // --- ¡NUEVO! 3. COMPROBAR DISPONIBILIDAD EN EL CALENDARIO ---
  var calendario = CalendarApp.getDefaultCalendar(); // Coge tu calendario principal
  var eventosExistentes = calendario.getEvents(fechaInicio, fechaFin); // Busca eventos en ese hueco
  
  // Si encuentra 1 o más eventos, significa que estás ocupado
  if (eventosExistentes.length > 0) {
    var asuntoOcupado = 'Aviso: Horario no disponible para tutoría de ' + nombreAlumno;
    var mensajeOcupado = 'Hola ' + nombrePadre + ',\n\n' +
                         'Lamentablemente, el horario que has elegido (' + fecha + ' a las ' + hora + ') ya acaba de ser reservado por otra familia.\n\n' +
                         'Por favor, vuelve a rellenar el formulario eligiendo un horario diferente.\n\n' +
                         // Opcional: Puedes pegar aquí el enlace a tu formulario de Google para facilitarle la vida
                         'Enlace al formulario: https://forms.gle/BzSPo8qGQ87uDUyG7 \n\n' + 
                         'Un saludo,\nTu Profesor/a';
                         
    GmailApp.sendEmail(emailPadre, asuntoOcupado, mensajeOcupado);
    
    // SALIMOS: El "return" hace que el script se detenga aquí inmediatamente y no siga ejecutando lo de abajo
    return; 
  }
  // -----------------------------------------------------------

  // 4. Crear la base del evento (Si el script llega aquí, es que estás libre)
  var calendarioId = 'primary'; 
  var evento = {
    summary: 'Tutoría ' + modalidad + ': ' + nombreAlumno,
    description: 'Tutoría con ' + nombrePadre + '.',
    start: { dateTime: fechaInicio.toISOString() },
    end: { dateTime: fechaFin.toISOString() },
    attendees: [{ email: emailPadre }]
  };

  // 5. LÓGICA CONDICIONAL: ¿Online o Presencial?
  var eventoCreado;
  var informacionLugar = ''; 

  if (modalidad.toLowerCase() === 'online (google meet)') {
    evento.conferenceData = {
      createRequest: {
        requestId: "tutoria-" + new Date().getTime(),
        conferenceSolutionKey: { type: "hangoutsMeet" }
      }
    };
    eventoCreado = Calendar.Events.insert(evento, calendarioId, {
      conferenceDataVersion: 1,
      sendUpdates: 'all'
    });
    informacionLugar = 'Enlace a la videollamada (Google Meet): ' + eventoCreado.hangoutLink;
    
  } else if (modalidad.toLowerCase() === 'presencial') {
    evento.location = 'Sala de visitas del Instituto / Despacho'; 
    eventoCreado = Calendar.Events.insert(evento, calendarioId, {
      sendUpdates: 'all'
    });
    informacionLugar = 'Lugar: ' + evento.location + '\nPor favor, pregunta por mí en conserjería al llegar.';
    
  } else {
    eventoCreado = Calendar.Events.insert(evento, calendarioId, { sendUpdates: 'all' });
    informacionLugar = '⚠️ Modalidad sin especificar (' + modalidad + '). Te contactaré para confirmarla.';
  }

  // 6. Enviar el correo de confirmación de éxito
  var asunto = 'Confirmación de Tutoría: ' + nombreAlumno;
  var mensaje = 'Hola ' + nombrePadre + ',\n\n' +
                'Se ha agendado correctamente la tutoría para hablar sobre ' + nombreAlumno + ' de ' + materia + '.\n\n' +
                'Fecha: ' + fecha + '\n' +
                '⏰ Hora: ' + hora + '\n' +
                'Modalidad: ' + modalidad + '\n' +
                'Necesita traductor: ' + traductor + '\n' +
                informacionLugar + '\n\n' + 
                'Un saludo,\nTu Profesor/a';

  GmailApp.sendEmail(emailPadre, asunto, mensaje);
}
