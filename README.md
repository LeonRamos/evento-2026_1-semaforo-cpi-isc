# Semáforo para el Concurso de Proyectos de  Innovación ISC 2026_1

Este repositorio contiene la implementación del **semáforo de tiempos** para el _Concurso de Proyectos de Innovación_ de ISC 2026_1.  
El recurso está diseñado para usarse durante las presentaciones, demostraciones de prototipo y sesiones de preguntas, y forma parte del sitio del evento:

[Concurso Proyectos Innovación](https://leonramos.github.io/Concurso_Proyectos_ISC/)

---

## ¿Qué historia queremos contar?

Al final de cada semestre, el aula deja de ser solo un salón de clases y se convierte en un pequeño **laboratorio de innovación**.  
Los estudiantes de Ingeniería en Sistemas Computacionales llegan con sus ideas ya materializadas: prototipos, demos funcionales, integraciones con servicios en la nube o soluciones para empresas reales.

En este concurso, cada equipo tiene **un solo intento en vivo** para demostrar:

- Qué tanto han comprendido los fundamentos técnicos vistos en las asignaturas.
- Cómo transforman conceptos en soluciones que generan valor.
- De qué manera se comunican, negocian, responden bajo presión y trabajan en equipo.

Un grupo de jueces —docentes, profesionales de TI y representantes de empresas locales y extranjeras— evalúa no solo el resultado técnico, sino también las **competencias blandas y duras** que el mercado laboral exige hoy: claridad al exponer, gestión del tiempo, capacidad de respuesta ante preguntas difíciles, dominio de herramientas modernas y buenas prácticas de desarrollo.

El **semáforo de este proyecto** se convierte así en algo más que un cronómetro: es el “director de escena” que marca el ritmo de cada historia, ayudando a que todos los equipos tengan condiciones de tiempo justas, predecibles y visibles.  
Verde abre la narrativa, amarillo invita a cerrar el mensaje clave y rojo recuerda que, igual que en el mundo real, cada oportunidad tiene un límite claro.

---

## Objetivo del proyecto

Proveer una **herramienta clara y visual** que apoye la gestión del tiempo en el evento, alineada con criterios de UX y con la identidad gráfica institucional:

- Tres bloques de 5 minutos:
  - Bloque 1: Presentación.
  - Bloque 2: Demostración del prototipo.
  - Bloque 3: Preguntas y respuestas.
- Cambio de estado mediante el **color de toda la pantalla**:
  - Verde: inicio del bloque.
  - Amarillo: mitad del tiempo.
  - Rojo: cierre del bloque.
- Alertas auditivas en:
  - Mitad del bloque (amarillo).
  - Final del bloque (rojo).
- Botones de control:
  - Iniciar, Pausar, Reiniciar.
  - **Siguiente sección** para saltar a la siguiente fase cuando se termina de manera anticipada.

---

## Estructura del repositorio

```text
evento-2026_1-semaforo-cpi-isc/
├── README.md
├── LICENSE
├── .gitignore
├── index.html                 # Página principal con el semáforo de tiempos
├── pages/
│   ├── convocatoria.html
│   ├── programa.html
│   ├── sedes.html
│   └── resultados.html
├── assets/
│   ├── css/
│   │   ├── main.css           # Estilos base del sitio y del semáforo
│   │   └── theme_itjmmpyh.css # Ajustes de identidad institucional
│   ├── js/
│   │   ├── main.js            # Lógica del semáforo y comportamiento general
│   │   └── tracking_analytics.js
│   └── img/
│       ├── logo_itjmmpyh.png
│       ├── logo_evento.png
│       ├── semaforo/
│       │   └── logo_semaforo.png
│       └── patrocinadores/
│           ├── empresa1.png
│           └── empresa2.png
├── docs/
│   ├── cronograma_organizacion.md
│   ├── lineamientos_participacion.md
│   └── minuta_comite.md
└── .github/
    └── workflows/
        └── deploy-pages.yml   # Workflow opcional para GitHub Pages
```

El semáforo se implementa principalmente en:

- `index.html`
- `assets/css/main.css`
- `assets/js/main.js`

---

## Funcionalidad del semáforo

### Fases y tiempos

El sistema gestiona automáticamente tres bloques consecutivos:

1. **Presentación** – 5 minutos.  
2. **Demostración del prototipo** – 5 minutos.  
3. **Preguntas y respuestas** – 5 minutos.  

### Cambios de color en pantalla

- **Verde**: de 05:00 a 02:31.  
- **Amarillo**: de 02:30 a 00:01.  
- **Rojo**: al llegar a 00:00 y cierre del bloque.

### Controles

- `Iniciar`  
- `Pausar`  
- `Siguiente sección` (salto anticipado al siguiente bloque).  
- `Reiniciar`  

---

## Lógica principal (resumen técnico)

- Definición de fases con duración en segundos.
- Temporizador con actualización por segundo.
- Cálculo del color de fondo según tiempo restante.
- Alertas sonoras en mitad y fin de bloque.
- Botón de salto anticipado que ajusta tiempos y avanza de fase.

---

## Deploy con GitHub Pages

- `index.html` en la raíz del repositorio.  
- Publicación desde la rama configurada en GitHub Pages (`Settings → Pages`).  
- Workflow opcional en `.github/workflows/deploy-pages.yml` para automatizar el despliegue.

---

## Contribuciones

Se aceptan mejoras en:

- Diseño UX/UI.
- Accesibilidad (contraste, atajos de teclado, mensajes ARIA).
- Parametrización de tiempos por interfaz.
- Integración con módulos de evaluación y registro de resultados.
