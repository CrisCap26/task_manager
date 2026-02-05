# Datos de Prueba para Insomnia

## Configuración en Insomnia

### Headers requeridos para todas las peticiones:

```
Content-Type: application/json
user-id: usuario123
```

---

## Crear Tareas - JSON Bodies

### Tarea 1 - Pública

```json
{
  "title": "Reunión de equipo",
  "description": "Reunión semanal para revisar avances del proyecto",
  "completed": false,
  "dueDate": "2025-02-10",
  "isPublic": true,
  "comments": "Traer reportes de progreso",
  "responsible": "Juan Pérez",
  "tags": ["reunión", "semanal"]
}
```

### Tarea 2 - Pública

```json
{
  "title": "Actualizar documentación",
  "description": "Actualizar README del proyecto con nuevas features",
  "completed": true,
  "dueDate": "2025-02-05",
  "isPublic": true,
  "comments": "",
  "responsible": "María García",
  "tags": ["documentación", "urgente"]
}
```

### Tarea 3 - Pública

```json
{
  "title": "Deploy a producción",
  "description": "Subir nueva versión al servidor de producción",
  "completed": false,
  "dueDate": "2025-02-15",
  "isPublic": true,
  "comments": "Verificar backups primero",
  "responsible": "Carlos López",
  "tags": ["deploy", "producción"]
}
```

### Tarea 4 - Privada

```json
{
  "title": "Revisar salaries",
  "description": "Revisar y aprobar incrementos salariales del equipo",
  "completed": false,
  "dueDate": "2025-02-20",
  "isPublic": false,
  "comments": "Información confidencial",
  "responsible": "Director",
  "tags": ["rrhh", "confidencial"]
}
```

### Tarea 5 - Privada

```json
{
  "title": "Planificar presupuesto",
  "description": "Elaborar presupuesto del próximo trimestre",
  "completed": false,
  "dueDate": "2025-02-25",
  "isPublic": false,
  "comments": "Reunión con finanzas",
  "responsible": "Gerente",
  "tags": ["presupuesto", "finanzas"]
}
```

### Tarea 6 - Privada (completada)

```json
{
  "title": "Entrevista candidato",
  "description": "Entrevista técnica para posición de backend",
  "completed": true,
  "dueDate": "2025-02-01",
  "isPublic": false,
  "comments": "Candidato推荐的 por LinkedIn",
  "responsible": "RRHH",
  "tags": ["rrhh", "entrevista"]
}
```

### Tarea 7 - Pública (completada)

```json
{
  "title": "Configurar servidor CI/CD",
  "description": "Configurar pipeline de integración continua",
  "completed": true,
  "dueDate": "2025-01-28",
  "isPublic": true,
  "comments": "",
  "responsible": "DevOps",
  "tags": ["devops", "automatización"]
}
```

### Tarea 8 - Pública

```json
{
  "title": "Code review",
  "description": "Revisar PR #45 del feature de pagos",
  "completed": false,
  "dueDate": "2025-02-08",
  "isPublic": true,
  "comments": "Verificar tests primero",
  "responsible": "Tech Lead",
  "tags": ["code-review", "calidad"]
}
```

### Tarea 9 - Privada

```json
{
  "title": "Evaluación de desempeño",
  "description": "Completar evaluaciones del Q1",
  "completed": false,
  "dueDate": "2025-02-28",
  "isPublic": false,
  "comments": "一人独担当",
  "responsible": "Manager",
  "tags": ["rrhh", "evaluación"]
}
```

### Tarea 10 - Pública

```json
{
  "title": "Entrenamiento nuevo miembros",
  "description": "Sesión de onboarding para nuevos developers",
  "completed": false,
  "dueDate": "2025-02-12",
  "isPublic": true,
  "comments": "Preparar materiales",
  "responsible": "Mentor",
  "tags": ["onboarding", "training"]
}
```

---

## Endpoints para probar

### POST - Crear tarea

```
POST http://localhost:3000/tasks
```

### GET - Mis tareas (con filtros)

```
GET http://localhost:3000/tasks?page=1&limit=5
GET http://localhost:3000/tasks?completed=false
GET http://localhost:3000/tasks?completed=true
GET http://localhost:3000/tasks?isPublic=false
GET http://localhost:3000/tasks?responsible=Juan
GET http://localhost:3000/tags=reunión
```

### GET - Tareas públicas

```
GET http://localhost:3000/tasks/public
GET http://localhost:3000/tasks/public?completed=false
GET http://localhost:3000/tasks/public?page=1&limit=3
```

### PUT - Actualizar tarea

```
PUT http://localhost:3000/tasks/1
Body: {"completed": true}
```

### DELETE - Eliminar tarea

```
DELETE http://localhost:3000/tasks/1
```

---

## Después de crear las 10 tareas, prueba estos filtros:

### Filtrar por completadas

```
GET http://localhost:3000/tasks?completed=true
GET http://localhost:3000/tasks/public?completed=true
```

### Filtrar por pendientes

```
GET http://localhost:3000/tasks?completed=false
```

### Filtrar por público/privado

```
GET http://localhost:3000/tasks?isPublic=true
GET http://localhost:3000/tasks?isPublic=false
```

### Ordenar por fecha

```
GET http://localhost:3000/tasks?sortBy=dueDate&sortOrder=ASC
GET http://localhost:3000/tasks?sortBy=dueDate&sortOrder=DESC
```

### Paginación

```
GET http://localhost:3000/tasks?page=1&limit=3
GET http://localhost:3000/tasks?page=2&limit=3
GET http://localhost:3000/tasks?page=3&limit=3
```

### Combinado

```
GET http://localhost:3000/tasks?page=1&limit=5&completed=false&sortBy=dueDate
GET http://localhost:3000/tasks/public?page=1&limit=10&completed=false
```
