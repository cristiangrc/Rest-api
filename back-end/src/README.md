

API RESTful desarrollada con Node.js para la gestión de tareas, con autenticación JWT y roles de usuario (admin/user).


-  Autenticación JWT (usuarios y administradores).
-  CRUD completo de tareas.
-  Endpoints protegidos por roles.
-  Base de datos Mysql workbench.
-  Estructura modular (MVC).


Rest Api/
├── node_modules/
├── src/
│   ├── config/
│   │   └── db.js           # Configuración de la base de datos
│   ├── controllers/
│   │   ├── auth.controller.js  # Lógica de autenticación
│   │   └── task.controller.js  # Lógica de tareas
│   ├── middleware/
│   │   └── auth.middleware.js  # Middlewares de autenticación
│   ├── models/             # Task.model y user.model
│   ├── routes/
│   │   ├── auth.routes.js  # Rutas de autenticación
│   │   └── task.routes.js  # Rutas de tareas
│   └── services/
│       └── auth.service.js # Servicios de autenticación
├── .env                    # Variables de entorno
├── index.js                # Punto de entrada
└── tasks.db.sql            # Esquema SQL inicial

npm install y tambien dontenv // installar
 npm start // para correr la api

endpoints 

 Autenticación:
POST   http://localhost:3002/api/auth/register
POST   http://localhost:3002/api/auth/login
POST   http://localhost:3002/api/auth/refresh

Tareas 
GET    http://localhost:3002/api/tasks
POST   http://localhost:3002/api/tasks
GET    http://localhost:3002/api/tasks/id
PUT    http://localhost:3002/api/tasks/id
DELETE http://localhost:3002/api/tasks/id

Admin

GET    http://localhost:3002/api/tasks/admin/all

ejemplos de uso en postman 

 en el apartado de arriba escoge los distintas metodos y coloca las url de arriba con lo que desea hacer en ese momento.
 para registrar, se va al apartado de body activa la opcion raw y coloca json, en el body coloca esos campos que coinciden con la bd


{
    "id": ,
    "username": "",
    "email": "",
    "role": ""
}