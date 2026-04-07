# 📝 Automatización de herramientas de Google - Varios casos de uso a continuación:

# Envío de Rúbricas en PDF con Google Apps Script

Este proyecto permite automatizar la evaluación de alumnos. Al rellenar un Formulario de Google con las calificaciones de una exposición u otra actividad, el sistema genera automáticamente un documento PDF personalizado con los resultados, lo envía por correo electrónico al alumno y registra la nota numérica en la Hoja de Cálculo.

## 🛠️ Requisitos Previos

Para que este sistema funcione, necesitas tener preparados 3 elementos en tu Google Drive:
1. Una **Plantilla en Google Docs**.
2. Un **Google Forms** (Formulario).
3. Una **Hoja de Cálculo** (Google Sheets) vinculada al formulario.

---

## 🚀 Guía de Instalación Paso a Paso

### Paso 1: Configurar la Plantilla de Google Docs
Crea un documento de Google con el diseño que quieras para tu rúbrica. Debes incluir las siguientes "etiquetas cortas" exactamente como están escritas, incluyendo las llaves dobles. El código buscará estas etiquetas y las sustituirá por los datos reales:

* `{{Nombre}}` - Nombre del alumno.
* `{{Comentarios}}` - Comentarios cualitativos.
* `{{Texto_Destreza1}}`, `{{Texto_Destreza2}}`, `{{Texto_Destreza3}}` - Las valoraciones de texto (Excelente, Bien, etc.).
* `{{Nota_Destreza1}}`, `{{Nota_Destreza2}}`, `{{Nota_Destreza3}}` - La puntuación numérica (4, 3, etc.).
* `{{Nota_Total}}` - La suma de los puntos.
* `{{Nota_Sobre_10}}` - La nota final calculada sobre 10.

> **Importante:** Copia la **ID** de tu documento. La encontrarás en la barra de direcciones de tu navegador, es la serie de letras y números entre `/d/` y `/edit`.

### Paso 2: Configurar el Google Form
Crea un formulario de Google. Los títulos de las preguntas **deben ser exactamente iguales** a los que espera el código (si los cambias, deberás actualizar el código).

1. `Correo del alumno` (Respuesta corta).
2. `Nombre del alumno` (Respuesta corta).
3. Tres preguntas de Cuadrícula de varias opciones o Desplegable con las opciones: *Excelente, Bien, Regular, Necesita mejorar*.
   * `Evaluación de la Presentación [Expresión Oral (Fluidez, dicción, tono)]`
   * `Evaluación de la Presentación [Contenido (Claridad, organización, profundidad del tema)]`
   * `Evaluación de la Presentación [Lenguaje no verbal (Contacto visual, postura, gestos)]`
4. `Comentarios finales (Áreas de fortaleza y sugerencias de mejora)` (Párrafo).

Vincula este formulario a una Hoja de Cálculo.


---
# 📅 Automatización de Tutorías: Google Forms + Google Calendar

Este módulo permite gestionar automáticamente las citas para tutorías con las familias. Al rellenar un Formulario de Google, el sistema comprueba si tienes ese hueco libre en tu calendario. Si estás libre, crea el evento (generando un enlace de Google Meet si es online o asignando un lugar si es presencial), invita a los padres y les envía un correo de confirmación. Si el hueco ya está ocupado, les avisa para que elijan otra hora.

## 🛠️ Requisitos Previos

Para que este sistema funcione, necesitas:
1. Un **Google Forms** (Formulario) para solicitar la cita.
2. Una **Hoja de Cálculo** vinculada a ese formulario.
3. Tu **Google Calendar** principal.

---

## 🚀 Guía de Instalación Paso a Paso

### Paso 1: Configurar el Google Form
Crea un formulario de Google. Los títulos de las preguntas **deben ser idénticos** a los que espera el código. Configura las siguientes preguntas:

1. `Dirección de correo electrónico` (Respuesta corta).
2. `Nombre y apellidos (Padre/Madre/Tutor legal)` (Respuesta corta).
3. `Nombre completo del alumno/a` (Respuesta corta).
4. `¿En qué curso está matriculado/a el/la estudiante?` (Respuesta corta o Desplegable).
5. `Fecha preferida para la tutoría (Recuerda: Martes de 13h a 14h)` (Tipo Fecha: El código espera el formato DD/MM/AAAA).
6. `Hora preferida para la tutoría (Recuerda: Martes entre 13:00 y 14:00)` (Tipo Hora).
7. `Materia sobre la que quiere hablar` (Respuesta corta).
8. `¿Necesita traductor o ayuda especial?` (Respuesta corta o Varias opciones).
9. `¿Cómo prefieres que se realice la tutoría?` (Desplegable o Varias opciones). **Debe contener estas opciones exactas para que funcione la lógica del lugar:**
   * `Online (Google Meet)`
   * `Presencial`

### Paso 2: Añadir el Código en Apps Script
1. Abre la Hoja de Cálculo donde llegan las respuestas.
2. Ve al menú superior: **Extensiones > Apps Script**.
3. Pega el siguiente código del fichero Agendar_tutoria.gs

### Paso 3: Activar el Servicio Avanzado de Google Calendar (MUY IMPORTANTE)
Este script utiliza un servicio avanzado para generar automáticamente los enlaces de Google Meet. Si no lo activas, el código dará un error.
1. En el editor de Apps Script, fíjate en la barra lateral izquierda.
2. Busca la sección que dice "Servicios" y haz clic en el botón + (Añadir un servicio).
3. En la lista que aparece, baja hasta encontrar Google Calendar API.
4. Haz clic en ella y presiona el botón Añadir. (Verás que aparece "Calendar" debajo de "Servicios" en la barra lateral).

### Paso 4: Crear el Activador (Trigger)
Para que esto ocurra de forma automática al recibir una solicitud:
1. Ve al menú de la izquierda y haz clic en el icono del reloj (Activadores).
2. Haz clic en "Añadir activador" (abajo a la derecha).
3. Configúralo así:
        Función a ejecutar: agendarTutoria
        Implementación: Principal (Head)
        Fuente del evento: En la hoja de cálculo
        Tipo de evento: Al enviarse el formulario
4. Haz clic en Guardar (Acepta los permisos de Google si te los pide).

💡 Notas sobre el funcionamiento:
    Control de Solapamiento: Si dos padres eligen exactamente el mismo martes a las 13:00, el primero que envíe el formulario se quedará la cita. El código detectará que el hueco ya está ocupado para el segundo y le enviará un correo amable pidiendo que escoja otro día/hora.
    Duración: Las tutorías están programadas por defecto para durar 30 minutos (Línea 18: var duracionMinutos = 30;). Puedes modificar ese número a tu gusto.
