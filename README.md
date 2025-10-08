\# Todo App - Integración Backend


\## 👨‍💻 Integrantes

\- Mejía Cosíos, Xiomara Andrea

\- Torres Crisóstomo, Andy Brayan

\- Alvarez Caisahuana, Jasmi Janeli

\- Gavilán Arestegui, Saitd Diraks


\## ✨ Nueva Funcionalidad

Integración del \*\*backend\*\* con la aplicación de \*\*ToDo App\*\*.  

Se implementaron endpoints para gestionar \*\*usuarios\*\* y \*\*tareas\*\*, incluyendo:

\- Operaciones CRUD completas  

\- Manejo de sesiones de usuario (login y logout)  

\- Validaciones en los datos de entrada  

\- Respuestas en formato JSON para el consumo de la API  

\- Persistencia de datos en archivos \*\*JSON\*\*  


\## Cómo instalar aplicativo:

1. Asegúrate de tener Python 3 instalado en tu máquina.

-Entras al CMD y pones estos comandos:
python –version
py –version

-Si lo tienes salta los siguientes pasos y si no continua con el procedimiento
Descarga Python 3: https://www.python.org/downloads
En Windows, al instalar marca la casilla "Add Python to PATH" (muy importante).

2. Bajar el proyecto al PC
\-Descarga el ZIP en el GitHub entrando en el cuadro de color verde donde dice Code. (te saldrá Todo_app-main.zip).
\-Extrae el archivo, al extraerlo entra a la carpeta y te saldrá otra capeta con el mismo nombre esa capeta guárdalo en la ubicación que más desees.
\-Cambia el nombre de la carpeta que estas cambiando de ubicación de Todo_app-main a Todo_app.

3. Instala las dependencias necesarias:
  pip install flask flask-cors

4. Listo — ya está instalado


\## Cómo ejecutar:

1. Arrancar el backend (API)
\- Abre la terminal CMD y dirígete a la carpeta Todo_app/backend en la ubicación en la que la guardaste
\-Al encontrarte ahí ejecuta python app.py

2. Abrir la interfaz (frontend)
\- Ve a la carpeta Todo_app/frontend
\-La forma más simple: doble clic en Todolist.html para abrirlo en tu navegador o puedes también hacer click derecho y poner en abrir con y seleccionas el navegador que mas te guste.

3.Despues de seguir todos estos pasos podrás usar la app con total normalidad.

4. Detener el backend
En la terminal donde está corriendo el backend presiona Ctrl+C.


\## Lista de Endpoints implementados:

### Usuarios
- **POST /usuarios** → Se usa cuando una persona se registra por primera vez en la app para crear su cuenta.  
- **GET /usuarios** → El sistema muestra la lista de todos los usuarios registrados (normalmente solo lo ve el sistema o el administrador).  
- **GET /usuarios/{id}** → Sirve para buscar la información de un usuario específico, como su nombre o sus tareas (normalmente solo lo ve el sistema o el administrador).  
- **PUT /usuarios/{id}** → Se usa cuando el usuario cambia algo en su perfil, por ejemplo, su nombre o contraseña.  
- **DELETE /usuarios/{id}** → Se usa cuando el usuario decide eliminar su cuenta de la app.  

### Tareas
- **POST /tareas** → Se activa cuando añades una nueva tarea en la lista (“Agregar tarea”).  
- **GET /tareas** → Sirve para mostrar todas las tareas guardadas cuando entras a la aplicación.  
- **GET /tareas/{id}** → Se usa cuando quieres ver los detalles de una tarea específica, por ejemplo, para editarla o marcarla como completada.  
- **PUT /tareas/{id}** → Se activa cuando modificas una tarea existente, como cambiar su texto o marcarla como “hecha”.  
- **DELETE /tareas/{id}** → Se usa cuando eliminas una tarea individual de tu lista.  
- **DELETE /tareas/usuario/{usuario_id}** → Sirve cuando se eliminan todas las tareas de un usuario, por ejemplo, si el usuario borra su cuenta o reinicia su lista.  

\## 📂 Estructura de carpetas

Todo\_app/

│── backend/

│ ├── app.py # Código principal de la API en Flask

│ ├── usuarios.json # Archivo JSON donde se guardan los usuarios

│ └── tareas.json # Archivo JSON donde se guardan las tareas

│

│── frontend/

│ ├── Todolist.html # Interfaz principal de la aplicación (lista de tareas + login)

│ ├── styles.css # Estilos de la app

│ └── app.js # Lógica del frontend (manejo de tareas, login simulado)

│

└── README.md # Documentación del proyecto



