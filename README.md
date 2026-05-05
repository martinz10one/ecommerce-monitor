# 🛒 Ecommerce Monitor

##  Descripción

Este proyecto monitorea cambios en productos de un e-commerce mediante scraping automático.

El sistema detecta:

* Cambios de precio
* Productos nuevos
* Productos eliminados

---

##  Tecnologías usadas

* Python + Playwright → scraping
* Node.js + Express → API
* MongoDB → base de datos

---

##  Estructura del proyecto

```
ecommerce-monitor/
│
├── api/        # Backend (Node.js)
├── worker/     # Scraper (Python)
└── .env        # Variables de entorno
```

---

##  Cómo ejecutar

### 1. Iniciar API

```
cd api
node app.js
```

---

### 2. Ejecutar scraper

```
cd worker
python3 main.py
```

---

##  Flujo del sistema

1. Python scrapea productos desde la web
2. Envía los datos a la API (Node.js)
3. Node guarda un snapshot en MongoDB
4. Se comparan snapshots para detectar cambios

---

##  Endpoint principal

### POST /snapshots

Recibe productos y guarda un snapshot

---

### GET /snapshots/changes

Devuelve los cambios entre los últimos snapshots

#### Ejemplo:

```
http://localhost:3000/snapshots/changes
```

#### Filtros:

```
?snapshots/changes?type=price
?snapshots/changes?type=new
?snapshots/changes?type=removed
```

---

##  Ejemplo de respuesta

```json
{
  "changes": [
    {
      "type": "price",
      "title": "Libro X",
      "oldPrice": 20,
      "newPrice": 25,
      "change": "25%"
    }
  ]
}
```

---

##  Funcionalidades clave

* Scraping concurrente con asyncio
* Uso de Playwright para automatización web
* API REST con Express
* Persistencia con MongoDB
* Comparación de datos (diff)

---

##  Comunicación Worker ↔ API

###  JSON enviado por el worker

El worker (Python) envía un arreglo de productos en formato JSON:

```json
[
  {
    "title": "Nombre del producto",
    "price": "£20.99"
  },
  {
    "title": "Otro producto",
    "price": "£15.50"
  }
]
```

Cada objeto contiene:

* `title`: nombre del producto
* `price`: precio en texto

---

## ¿Qué hace el worker si la API no responde?

El worker maneja errores usando `try/except`.

Actualmente:

* Si ocurre un error, lo muestra en consola
* No detiene todo el proceso

Mejoras posibles:

* Reintentos automáticos
* Guardar datos en archivo local como respaldo

---

##  ¿Qué hace la API si recibe datos malformados?

La API valida que los datos sean un array:

```js
if (!Array.isArray(products)) {
    return res.status(400).json({ error: "Debe ser un array de productos" });
}
```

Respuestas:

* `400 Bad Request` → datos inválidos
* `500 Internal Server Error` → error interno

---

##  ¿Cómo sabe el worker que todo salió bien?

La API responde con un resumen:

```json
{
  "message": "Snapshot guardado",
  "total": 60,
  "changes": []
}
```

Esto indica:

* que los datos fueron guardados
* cuántos productos se procesaron
* qué cambios se detectaron

El worker imprime esta respuesta en consola.


## ✅ Estado

Proyecto funcional completo ✔
