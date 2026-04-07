# 📝 Automatización de herramientas de Google - Varios casos de uso a continuación:

# Caso de uso 1: Envío de Rúbricas en PDF con Google Apps Script

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

# 📅 Caso de uso 2: Automatización de Tutorías: Google Forms + Google Calendar

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


# 🎓 Caso de uso 3: Sistema de Certificación e Informes Automatizados con Google Apps Script

Este proyecto contiene dos potentes automatizaciones para Google Workspace diseñadas para gestionar la finalización de cursos o eventos:
1. **Certificados Individuales (`MailporFila.gs`)**: Lee una fila de datos, genera un diploma en PDF personalizado, lo envía por correo electrónico con un diseño HTML profesional y marca al alumno como "Enviado" para evitar duplicados.
2. **Reporte Consolidado (`MailporTabla.gs`)**: Recopila los datos de todos los alumnos, genera una tabla con formato profesional (efecto cebra, cabeceras destacadas), calcula un resumen ejecutivo y envía el informe global a coordinación.

---

## 📋 Índice

1. [Requisitos Previos](#-requisitos-previos)
2. [Instalación del Código](#-instalación-del-código)
3. [Configuración: Certificados Individuales](#1%EF%B8%8F⃣-configuración-certificados-individuales-mailporfilags)
4. [Configuración: Reporte Consolidado](#2%EF%B8%8F⃣-configuración-reporte-consolidado-mailportablags)
5. [Automatización (Triggers)](#%E2%8F%B0-automatización-triggers)

---

## 🛠️ Requisitos Previos

Para que este sistema funcione, necesitas tener preparados los siguientes elementos en tu Google Drive:

1. **Una Hoja de Cálculo (Google Sheets)**: Con los datos de los participantes.
2. **Plantilla de Certificado (Google Docs)**: El diseño de tu diploma. Debe contener las siguientes etiquetas exactas (con las llaves):
   * `{{Tratamiento}}`, `{{Nombre}}`, `{{Apellidos}}`, `{{DNI}}`, `{{Nombre de la Formación}}`, `{{Fecha de inicio de la formación}}`, `{{Fecha de finalización de la formación}}`, `{{Duración}}`.
3. **Plantilla de Reporte (Google Docs)**: Un documento base para el informe. Solo necesita tener la etiqueta `{{Fecha}}` (el script dibujará la tabla y el resumen automáticamente debajo).
4. **Carpeta en Drive**: Una carpeta específica donde se guardará el histórico de los reportes globales en PDF.

---

## 💻 Instalación del Código

1. Abre tu Hoja de Cálculo.
2. Ve al menú superior: **Extensiones > Apps Script**.
3. Crea un archivo llamado `MailporFila.gs` y pega el código del primer script.
4. Haz clic en el botón `+` (Añadir un archivo > Secuencia de comandos), llámalo `MailporTabla.gs` y pega el segundo script.
5. Guarda los cambios (icono del disquete).

---

## 1️⃣ Configuración: Certificados Individuales (`MailporFila.gs`)

Este script se encarga de recorrer la tabla y enviar los diplomas a quienes aún no lo han recibido.

### Ajustes necesarios en el código:
Ve a las primeras líneas de `MailporFila.gs` y modifica:
* `ID_PLANTILLA`: Pon el ID de tu documento de Google Docs del diploma (lo encuentras en la URL del documento, entre `/d/` y `/edit`).
* Revisa que el orden de las columnas (`COL_EMAIL`, `COL_TRATAMIENTO`, etc.) coincida con tu Excel. El código asume que el Email está en la columna 1 (A), el Tratamiento en la 2 (B), etc.
* **Importante:** El script escribirá la palabra `Enviado` en la columna 10 (J). Asegúrate de tener esa columna libre o cambia el número en `const COL_ESTADO = 10;`.

---

## 2️⃣ Configuración: Reporte Consolidado (`MailporTabla.gs`)

Este script coge la tabla entera, la pone bonita y se la envía a coordinación.

### Ajustes necesarios en el código:
Ve a las primeras líneas de `MailporTabla.gs` y modifica:
* `ID_PLANTILLA`: El ID de tu Google Doc vacío (el que servirá de base para el informe).
* `EMAIL_DESTINO`: El correo de la persona que debe recibir el informe global.
* `ID_CARPETA_HISTORICO`: El ID de la carpeta de Drive donde quieres que se guarden los PDFs (lo sacas de la URL de la carpeta).
* `COLUMNAS_A_INCLUIR`: Si no quieres que salgan todas las columnas en el PDF, ajusta los números aquí. (Ojo: En programación se empieza a contar desde el 0. La columna A es 0, la B es 1, etc.).
* `FORMATO_APAISADO`: Déjalo en `true` si tienes muchas columnas, o cámbialo a `false` si prefieres el PDF en vertical.

---

## ⏰ Automatización (Triggers)

Para que no tengas que darle al botón de "Ejecutar" manualmente, vamos a programar los scripts:

1. En el editor de Apps Script, ve al menú izquierdo y haz clic en el icono del reloj (**Activadores**).
2. Haz clic en **Añadir activador** (abajo a la derecha).

### Para los Certificados Individuales:
Si quieres que se envíen en cuanto se añade un alumno (por ejemplo, desde un formulario):
* **Fichero:** Mail por fila.gs
* **Función:** `generarYEnviarCertificados`
* **Fuente del evento:** `En la hoja de cálculo`
* **Tipo de evento:** `Al enviarse el formulario` (o "Al editarse" si metes los datos a mano).

### Para el Reporte Consolidado:
Si quieres recibir un resumen todos los viernes, por ejemplo:
* **Fichero:** Mail por tabla.gs
* **Función:** `generarReporteConsolidado`
* **Fuente del evento:** `Según el tiempo`
* **Tipo de activador:** `Temporizador semanal`
* Selecciona el día y la hora a la que quieres recibir el correo.

> **⚠️ Nota de Seguridad:** La primera vez que ejecutes o guardes un activador, Google te pedirá permisos. Haz clic en "Revisar permisos", elige tu cuenta, ve a "Configuración avanzada" y dale a "Ir a Proyecto sin título" para autorizar el acceso a tu Drive y Gmail.
