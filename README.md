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

1\. Asegúrate de tener Python 3 instalado en tu máquina.

2\. Clona el repositorio:  

&nbsp;  `git clone https://github.com/nebu10524/Todo\_app.git`

3\. Accede a la carpeta del proyecto:  

&nbsp;  `cd Todo\_app`

4\. Instala las dependencias necesarias:  

&nbsp;  `pip install flask flask-cors`

5\. Verifica que el entorno esté listo antes de ejecutar el backend.



\## Cómo ejecutar:

1\. Backend: `cd backend \&\& python app.py`

2\. Frontend: Abrir `Todolist.html` en navegador

3\. Usar la nueva opción de "Perfil" en la app



\## Lista de Endpoints implementados:

\### Usuarios

\- POST /usuarios → Crear un nuevo usuario

\- GET /usuarios → Listar todos los usuarios

\- GET /usuarios/{id} → Obtener un usuario específico

\- PUT /usuarios/{id} → Actualizar usuario existente

\- DELETE /usuarios/{id} → Eliminar usuario



\### Tareas

\- POST /tareas → Crear nueva tarea

\- GET /tareas → Listar todas las tareas (opcional filtrar por usuario\_id)

\- GET /tareas/{id} → Obtener tarea específica

\- PUT /tareas/{id} → Actualizar tarea existente

\- DELETE /tareas/{id} → Eliminar tarea

\- DELETE /tareas/usuario/{usuario\_id} → Eliminar todas las tareas de un usuario



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



