# 📝 Automatización de Rúbricas en PDF con Google Apps Script

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

### Paso 3: Añadir el Código en Apps Script
1. Abre la Hoja de Cálculo donde llegan las respuestas.
2. Ve al menú superior: **Extensiones > Apps Script**.
3. Borra cualquier código que haya y pega el script del fichero Mail_con_rúbrica.gs.
