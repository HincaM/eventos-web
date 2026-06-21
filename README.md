# Eventos Web

Aplicación web para consultar administrar eventos y administrar reservas.

## Cómo ejecutar el proyecto en local

### Requisitos previos

- Node.js (versión 20 o superior)
- La API de Eventos corriendo (ver el README de `eventos-api`)

### Pasos

1. Clonar el repositorio y abrir una terminal en la carpeta raíz del proyecto.
2. Instalar las dependencias:
   ```
   npm install
   ```
3. Levantar la aplicación en modo desarrollo:
   ```
   ng serve
   ```
4. Abrir el navegador en `http://localhost:4200`.

La aplicación espera que la API esté disponible (por defecto en `http://localhost:5267`).

### Correr las pruebas

```
ng test
```

## Arquitectura

El proyecto también sigue una idea de **puertos y adaptadores** en conjunto con estructura de carpetas core-features-shared. 
El objetivo es que las pantallas (componentes) no tengan lógica de negocio dentro, solo se encargan de mostrar datos y capturar acciones del usuario.

Cada funcionalidad (eventos, reservas, venues) se organiza en carpetas `core` que contienen la arquitectura hexagonal:

- **domain**: 
Contiene los modelos y contratos (puertos).
- **application / use-cases**: 
Contiene los casos de uso y la lógica asociada a cada operación de negocio
- **infrastructure / implementations**: 
contiene las implementaciones de los contratos (adaptadores), encargadas de comunicarse con la API mediante HTTP.

Las páginas (pantallas) inyectan y llaman a los casos de uso, nunca hablan directamente con la API ni contienen reglas de negocio. Esto facilita probar la lógica de negocio sola, y permite cambiar cómo se obtienen los datos sin tocar las pantallas.

## Tecnologías utilizadas

- **Angular** — framework principal del frontend.
- **TypeScript** — lenguaje de desarrollo.
- **RxJS** — manejo de datos asíncronos (peticiones, eventos del usuario).
- **Angular Material / Bootstrap** — componentes visuales y estilos.
- **Server-Side Rendering (Angular SSR)** — renderizado en servidor para mejorar la carga inicial.
- **Vitest** — pruebas unitarias.
