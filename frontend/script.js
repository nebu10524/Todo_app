      document.addEventListener("DOMContentLoaded", () => {
      // ========== VARIABLES GLOBALES ==========
      let usuarioActivo = null; // Usuario actual logueado
      const loginContainer = document.getElementById("loginContainer");
      const registroContainer = document.getElementById("registroContainer");
      const tareasContainer = document.getElementById("tareasContainer");
      const API_URL = "http://127.0.0.1:5000"; // URL del backend

      // ========== NAVEGACIÓN ENTRE PANTALLAS ==========
      
      // Ir a pantalla de registro
      document.getElementById("irARegistro").addEventListener("click", () => {
        loginContainer.style.display = "none";
        registroContainer.style.display = "block";
      });

      // Volver a pantalla de login
      document.getElementById("volverLogin").addEventListener("click", () => {
        registroContainer.style.display = "none";
        loginContainer.style.display = "block";
      });

      // ========== FUNCIONES DE API ==========
      
      // Función para hacer login
      async function loginAPI(email, password) {
        const res = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw { status: res.status, body: data };
        return data.usuario;
      }

      // Función para registrar nuevo usuario
      async function registrarAPI(usuario, email, password) {
        const res = await fetch(`${API_URL}/usuarios`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ usuario, email, password })
        });
        const data = await res.json();
        if (!res.ok) throw { status: res.status, body: data };
        return data;
      }

      // Función para cargar tareas desde el servidor
      async function cargarTareasDesdeAPI(usuarioId) {
        try {
          const res = await fetch(`${API_URL}/tareas?usuario_id=${usuarioId}`);
          const data = await res.json();
          if (!data.success) {
            mostrarMensaje("Error al cargar tareas desde API", "error");
            return;
          }
          // Limpiar lista y agregar tareas
          listaElementosTarea.innerHTML = "";
          data.tareas.forEach(tarea => {
            anadirTareaAlDOM(tarea);
          });
          aplicarFiltroTareas();
        } catch (err) {
          mostrarMensaje("Error de conexión al cargar tareas", "error");
        }
      }

      // ========== MANEJO DE SESIÓN ==========
      
      // Cargar sesión guardada
      const cargarSesion = () => {
        const sesion = JSON.parse(sessionStorage.getItem("usuarioActivo"));
        if (sesion) {
          usuarioActivo = sesion;
          mostrarPantallaTareas();
        }
      };

      // Guardar sesión en sessionStorage
      const guardarSesion = () => {
        sessionStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));
      };

      // Cerrar sesión
      const cerrarSesion = () => {
        usuarioActivo = null;
        sessionStorage.removeItem("usuarioActivo");
        loginContainer.style.display = "block";
        registroContainer.style.display = "none";
        tareasContainer.style.display = "none";
        mostrarMensaje("Sesión cerrada", "exito");
      };

      // Mostrar pantalla de tareas
      const mostrarPantallaTareas = () => {
        document.getElementById("nombreUsuario").textContent = usuarioActivo.usuario;
        document.getElementById("emailUsuario").textContent = usuarioActivo.email;
        loginContainer.style.display = "none";
        registroContainer.style.display = "none";
        tareasContainer.style.display = "block";
      };

      // ========== EVENTOS DE AUTENTICACIÓN ==========
      
      // Botón de Login
      document.getElementById("btnLogin").addEventListener("click", async () => {
        try {
          const email = document.getElementById("loginEmail").value.trim();
          const password = document.getElementById("loginPassword").value.trim();

          // Validar campos vacíos
          if (!email || !password) {
            mostrarMensaje("Completa todos los campos", "error");
            return;
          }

          // Hacer login
          const u = await loginAPI(email, password);
          usuarioActivo = u;
          guardarSesion();
          mostrarMensaje(`Bienvenido ${u.usuario}`, "exito");
          mostrarPantallaTareas();
          await cargarTareasDesdeAPI(u.id);
        } catch (err) {
          if (err.status === 401) {
            mostrarMensaje("Credenciales incorrectas", "error");
          } else {
            mostrarMensaje("Error en login", "error");
          }
        }
      });

      // Botón de Registro
      document.getElementById("btnRegistro").addEventListener("click", async () => {
        try {
          const usuario = document.getElementById("registroUsuario").value.trim();
          const email = document.getElementById("registroEmail").value.trim();
          const password = document.getElementById("registroPassword").value.trim();

          // Validar campos vacíos
          if (!usuario || !email || !password) {
            mostrarMensaje("Completa todos los campos", "error");
            return;
          }

          // Registrar usuario
          const res = await registrarAPI(usuario, email, password);
          mostrarMensaje(res.message || "Usuario registrado exitosamente", "exito");
          
          // Limpiar formulario
          document.getElementById("registroUsuario").value = "";
          document.getElementById("registroEmail").value = "";
          document.getElementById("registroPassword").value = "";
          
          // Volver a login después de 2 segundos
          setTimeout(() => {
            registroContainer.style.display = "none";
            loginContainer.style.display = "block";
          }, 2000);
        } catch (err) {
          console.error("Error completo:", err);
          const mensajeError = err?.body?.message || err?.message || "Error al registrar usuario";
          mostrarMensaje(mensajeError, "error");
        }
      });

      // Botón de Cerrar Sesión
      document.getElementById("btnLogout").addEventListener("click", cerrarSesion);

      // ========== MODAL DE CONFIGURACIÓN ==========
      
      const modalConfiguracion = document.getElementById("modalConfiguracion");
      const btnConfiguracion = document.getElementById("btnConfiguracion");
      const closeModal = document.getElementById("closeModal");

      // Abrir modal de configuración
      btnConfiguracion.addEventListener("click", () => {
        document.getElementById("editUsuario").value = usuarioActivo.usuario;
        document.getElementById("editEmail").value = usuarioActivo.email;
        document.getElementById("editPassword").value = "";
        modalConfiguracion.style.display = "flex";
      });

      // Cerrar modal
      closeModal.addEventListener("click", () => {
        modalConfiguracion.style.display = "none";
      });

      // Cerrar modal al hacer click fuera
      window.addEventListener("click", (e) => {
        if (e.target === modalConfiguracion) {
          modalConfiguracion.style.display = "none";
        }
      });

      // Guardar cambios de cuenta
      document.getElementById("btnGuardarCambios").addEventListener("click", async () => {
        try {
          const nuevoUsuario = document.getElementById("editUsuario").value.trim();
          const nuevoEmail = document.getElementById("editEmail").value.trim();
          const nuevaPassword = document.getElementById("editPassword").value.trim();

          // Validar campos obligatorios
          if (!nuevoUsuario || !nuevoEmail) {
            mostrarMensaje("El nombre de usuario y email son obligatorios", "error");
            return;
          }

          // Preparar datos para actualizar
          const datosActualizacion = {
            usuario: nuevoUsuario,
            email: nuevoEmail
          };

          // Agregar password solo si se ingresó uno nuevo
          if (nuevaPassword) {
            datosActualizacion.password = nuevaPassword;
          }

          // Actualizar en el servidor
          const res = await fetch(`${API_URL}/usuarios/${usuarioActivo.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosActualizacion)
          });

          const data = await res.json();
          
          if (!res.ok || !data.success) {
            throw new Error(data.message || "Error al actualizar");
          }

          // Actualizar datos locales
          usuarioActivo.usuario = data.usuario.usuario;
          usuarioActivo.email = data.usuario.email;
          if (nuevaPassword) {
            usuarioActivo.password = data.usuario.password;
          }

          guardarSesion();

          // Actualizar UI
          document.getElementById("nombreUsuario").textContent = usuarioActivo.usuario;
          document.getElementById("emailUsuario").textContent = usuarioActivo.email;

          mostrarMensaje("Cuenta actualizada exitosamente", "exito");
          modalConfiguracion.style.display = "none";

        } catch (err) {
          console.error("Error al actualizar cuenta:", err);
          mostrarMensaje("Error al actualizar la cuenta", "error");
        }
      });

      // ========== MODAL DE CONFIRMACIÓN DE ELIMINACIÓN ==========
      
      // Abrir modal de confirmación
      document.getElementById("btnEliminarCuenta").addEventListener("click", async () => {
        document.getElementById("modalConfirmacion").style.display = "flex";
      });

      const modalConfirmacion = document.getElementById("modalConfirmacion");
      const closeConfirmacion = document.getElementById("closeConfirmacion");
      const btnCancelarEliminacion = document.getElementById("btnCancelarEliminacion");
      const btnConfirmarEliminacion = document.getElementById("btnConfirmarEliminacion");

      // Cerrar modal de confirmación
      closeConfirmacion.addEventListener("click", () => {
        modalConfirmacion.style.display = "none";
      });

      // Cancelar eliminación
      btnCancelarEliminacion.addEventListener("click", () => {
        modalConfirmacion.style.display = "none";
        mostrarMensaje("Eliminación cancelada", "advertencia");
      });

      // Confirmar eliminación de cuenta
      btnConfirmarEliminacion.addEventListener("click", async () => {
        try {
          // Primero eliminar todas las tareas del usuario
          await fetch(`${API_URL}/tareas/usuario/${usuarioActivo.id}`, {
            method: "DELETE"
          });

          // Luego eliminar el usuario
          const res = await fetch(`${API_URL}/usuarios/${usuarioActivo.id}`, {
            method: "DELETE"
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.message || "Error al eliminar cuenta");
          }

          mostrarMensaje("Cuenta eliminada exitosamente", "exito");
          
          // Cerrar modales
          modalConfirmacion.style.display = "none";
          modalConfiguracion.style.display = "none";
          
          // Cerrar sesión después de 2 segundos
          setTimeout(() => {
            cerrarSesion();
          }, 2000);

        } catch (err) {
          console.error("Error al eliminar cuenta:", err);
          mostrarMensaje("Error al eliminar la cuenta", "error");
          modalConfirmacion.style.display = "none";
        }
      });

      // Cerrar modal al hacer click fuera
      window.addEventListener("click", (e) => {
        if (e.target === modalConfirmacion) {
          modalConfirmacion.style.display = "none";
        }
      });

      // ========== MODAL DE USUARIOS ==========
      
      const modalUsuarios = document.getElementById("modalUsuarios");
      const btnVerUsuarios = document.getElementById("btnVerUsuarios");
      const closeUsuarios = document.getElementById("closeUsuarios");

      // Ver lista de usuarios
      btnVerUsuarios.addEventListener("click", async () => {
        try {
          const res = await fetch(`${API_URL}/usuarios`);
          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error("Error al cargar usuarios");
          }

          const container = document.getElementById("listaUsuariosContainer");
          
          // Mostrar mensaje si no hay usuarios
          if (data.usuarios.length === 0) {
            container.innerHTML = `
              <div class="no-users">
                <div class="no-users-icon">👥</div>
                <p>No hay usuarios registrados</p>
              </div>
            `;
          } else {
            // Crear tarjetas de usuarios
            container.innerHTML = data.usuarios.map(u => {
              const inicial = u.usuario.charAt(0).toUpperCase();
              const esTuCuenta = u.id === usuarioActivo.id;
              
              return `
                <div class="user-card">
                  <div class="user-avatar">${inicial}</div>
                  <div class="user-details">
                    <h4>${u.usuario} ${esTuCuenta ? '<span class="user-badge">Tu cuenta</span>' : ''}</h4>
                    <p>${u.email}</p>
                  </div>
                </div>
              `;
            }).join('');
          }

          modalUsuarios.style.display = "flex";

        } catch (err) {
          console.error("Error al cargar usuarios:", err);
          mostrarMensaje("Error al cargar usuarios", "error");
        }
      });

      // Cerrar modal de usuarios
      closeUsuarios.addEventListener("click", () => {
        modalUsuarios.style.display = "none";
      });

      // Cerrar modal al hacer click fuera
      window.addEventListener("click", (e) => {
        if (e.target === modalUsuarios) {
          modalUsuarios.style.display = "none";
        }
      });

      // ========== VARIABLES DE TAREAS ==========
      
      const elementoEntradaTarea = document.getElementById("entradaTarea");
      const elementoFechaTarea = document.getElementById("fechaLimite");
      const elementoPrioridad = document.getElementById("prioridadTarea");
      const botonAnadirTarea = document.getElementById("btnAgregar");
      const listaElementosTarea = document.getElementById("listaTareas");
      const selectorFiltro = document.getElementById("filtro");
      const botonEliminarTodas = document.getElementById("btnEliminarTodas");
      const MAXIMO_TAREAS = 20; // Límite de tareas
      const DURACION_MENSAJE = 3000; // Duración de mensajes en milisegundos

      // ========== FUNCIONES AUXILIARES ==========
      
      // Mostrar mensaje temporal
      const mostrarMensaje = (textoMensaje, tipoMensaje) => {
        const contenedorMensaje = document.createElement("div");
        contenedorMensaje.textContent = textoMensaje;
        contenedorMensaje.className = `mensaje ${tipoMensaje}`;
        document.body.appendChild(contenedorMensaje);
        setTimeout(() => contenedorMensaje.remove(), DURACION_MENSAJE);
      };

      // Obtener clase CSS según la fecha
      const obtenerClaseFecha = (fechaTarea) => {
        const fechaHoy = new Date().toISOString().split("T")[0];
        if (fechaTarea < fechaHoy) return "expired"; // Fecha pasada
        if (fechaTarea === fechaHoy) return "near"; // Fecha de hoy
        return "";
      };

      // Crear elemento de fecha con estilo
      const crearElementoFecha = (fechaTarea) => {
        const elementoFechaLimite = document.createElement("small");
        elementoFechaLimite.textContent = `Límite: ${fechaTarea}`;
        const claseFecha = obtenerClaseFecha(fechaTarea);
        if (claseFecha) {
          elementoFechaLimite.classList.add(claseFecha);
        }
        return elementoFechaLimite;
      };

      // Crear sección de información de la tarea
      const crearSeccionInformacion = (tarea) => {
        const contenedorInformacion = document.createElement("div");
        contenedorInformacion.classList.add("informacion");

        // Texto de la tarea
        const elementoTexto = document.createElement("span");
        elementoTexto.textContent = tarea.texto;
        elementoTexto.classList.add("task-text");
        contenedorInformacion.appendChild(elementoTexto);

        // Fecha límite
        if (tarea.fecha) {
          const elementoFecha = crearElementoFecha(tarea.fecha);
          contenedorInformacion.appendChild(elementoFecha);
        } else {
          const elementoFecha = document.createElement("small");
          elementoFecha.textContent = "Sin fecha";
          contenedorInformacion.appendChild(elementoFecha);
        }

        // Prioridad
        const elementoPrioridad = document.createElement("small");
        elementoPrioridad.textContent = `Prioridad: ${tarea.prioridad}`;
        contenedorInformacion.appendChild(elementoPrioridad);

        return contenedorInformacion;
      };

      // Actualizar texto del botón completar
      const actualizarBotonCompletar = (boton, elementoLista) => {
        const estaCompletada = elementoLista.classList.contains("completada");
        boton.textContent = estaCompletada ? "Desmarcar" : "Completar";
      };

      // Alternar estado de completado de una tarea
      const alternarEstadoCompletado = async (elementoLista, botonAlternar) => {
        const tareaId = elementoLista.dataset.tareaId;
        elementoLista.classList.toggle("completada");
        actualizarBotonCompletar(botonAlternar, elementoLista);
        
        // Actualizar en el servidor
        if (tareaId) {
          try {
            const completada = elementoLista.classList.contains("completada");
            const texto = elementoLista.querySelector(".task-text").textContent;
            const fecha = elementoLista.dataset.date || null;
            const prioridad = elementoLista.dataset.prioridad || "media";

            const res = await fetch(`${API_URL}/tareas/${tareaId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                texto, 
                completada, 
                fecha, 
                prioridad,
                usuario_id: usuarioActivo.id 
              })
            });
            
            if (!res.ok) throw new Error("Error al actualizar");
            
            await cargarTareasDesdeAPI(usuarioActivo.id);
          } catch (err) {
            mostrarMensaje("Error al actualizar tarea en el servidor", "error");
            console.error(err);
          }
        }
      };

      // ========== MODAL DE EDITAR TAREA ==========
      
      // Abrir modal de edición
      const editarTarea = (elementoTexto, elementoLista) => {
        const textoActual = elementoTexto.textContent;
        const fechaActual = elementoLista.dataset.date || "";
        const prioridadActual = elementoLista.dataset.prioridad || "media";
        
        const modal = document.getElementById('modalEditarTarea');
        const inputTexto = document.getElementById('editTextoInput');
        const inputFecha = document.getElementById('editFechaInput');
        const inputPrioridad = document.getElementById('editPrioridadInput');
        
        // Llenar campos del modal
        inputTexto.value = textoActual;
        inputFecha.value = fechaActual;
        inputPrioridad.value = prioridadActual;
        
        modal.style.display = 'flex';
        
        // Enfocar y seleccionar texto
        inputTexto.focus();
        inputTexto.select();
        
        // Guardar ID de la tarea
        modal.dataset.tareaElementoId = elementoLista.dataset.tareaId;
      };

      const modalEditarTarea = document.getElementById('modalEditarTarea');
      const closeEditarTarea = document.getElementById('closeEditarTarea');
      const btnCancelarEdicion = document.getElementById('btnCancelarEdicion');
      const btnGuardarEdicion = document.getElementById('btnGuardarEdicion');
      const inputTextoEdit = document.getElementById('editTextoInput');

      // Función para cerrar modal de edición
      const cerrarModalEditar = () => {
        modalEditarTarea.style.display = 'none';
        delete modalEditarTarea.dataset.tareaElementoId;
      };

      // Eventos para cerrar modal
      closeEditarTarea.addEventListener('click', cerrarModalEditar);
      btnCancelarEdicion.addEventListener('click', cerrarModalEditar);

      // Cerrar al hacer click fuera
      modalEditarTarea.addEventListener('click', (e) => {
        if (e.target === modalEditarTarea) {
          cerrarModalEditar();
        }
      });

      // Cerrar con tecla ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalEditarTarea.style.display === 'flex') {
          cerrarModalEditar();
        }
      });

      // Guardar con tecla Enter
      inputTextoEdit.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          btnGuardarEdicion.click();
        }
      });

      // Guardar cambios de tarea
      btnGuardarEdicion.addEventListener('click', async () => {
        const textoNuevo = document.getElementById('editTextoInput').value.trim();
        const fechaNueva = document.getElementById('editFechaInput').value;
        const prioridadNueva = document.getElementById('editPrioridadInput').value;
        
        // Validar texto no vacío
        if (!textoNuevo) {
          mostrarMensaje("El texto de la tarea no puede estar vacío", "error");
          return;
        }
        
        const tareaId = modalEditarTarea.dataset.tareaElementoId;
        
        // Actualizar en el servidor
        if (tareaId) {
          try {
            const elementoLista = document.querySelector(`li[data-tarea-id="${tareaId}"]`);
            const completada = elementoLista ? elementoLista.classList.contains("completada") : false;

            const res = await fetch(`${API_URL}/tareas/${tareaId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                texto: textoNuevo, 
                completada, 
                fecha: fechaNueva || null, 
                prioridad: prioridadNueva,
                usuario_id: usuarioActivo.id 
              })
            });
            
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.message || "Error al actualizar");
            }
            
            await cargarTareasDesdeAPI(usuarioActivo.id);
            mostrarMensaje("Tarea actualizada exitosamente", "exito");
          } catch (err) {
            mostrarMensaje("Error al actualizar tarea: " + err.message, "error");
            console.error(err);
          }
        }
        
        cerrarModalEditar();
      });

      // ========== FUNCIONES DE TAREAS ==========
      
      // Eliminar una tarea
      const eliminarTarea = async (elementoLista) => {
        const tareaId = elementoLista.dataset.tareaId;
        
        if (tareaId) {
          try {
            const res = await fetch(`${API_URL}/tareas/${tareaId}`, {
              method: "DELETE"
            });
            
            if (!res.ok) throw new Error("Error al eliminar");
            
            await cargarTareasDesdeAPI(usuarioActivo.id);
            mostrarMensaje("Tarea eliminada", "exito");
          } catch (err) {
            mostrarMensaje("Error al eliminar tarea del servidor", "error");
            console.error(err);
          }
        }
      };

      // Crear botones de acción de la tarea
      const crearBotonesAccion = (tarea, elementoLista, elementoTexto) => {
        const contenedorBotones = document.createElement("div");
        contenedorBotones.classList.add("task-buttons");

        // Botón Completar/Desmarcar
        const botonAlternar = document.createElement("button");
        botonAlternar.className = "alternar";
        actualizarBotonCompletar(botonAlternar, elementoLista);
        botonAlternar.addEventListener("click", () => alternarEstadoCompletado(elementoLista, botonAlternar));

        // Botón Editar
        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.className = "edit";
        botonEditar.addEventListener("click", () => editarTarea(elementoTexto, elementoLista));

        // Botón Eliminar
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "eliminar";
        botonEliminar.addEventListener("click", () => eliminarTarea(elementoLista));

        contenedorBotones.appendChild(botonAlternar);
        contenedorBotones.appendChild(botonEditar);
        contenedorBotones.appendChild(botonEliminar);

        return contenedorBotones;
      };

      // Añadir tarea al DOM
      const anadirTareaAlDOM = (datosTarea) => {
        const elementoLista = document.createElement("li");
        if (datosTarea.completada) elementoLista.classList.add("completada");
        elementoLista.dataset.date = datosTarea.fecha || "";
        elementoLista.dataset.prioridad = datosTarea.prioridad || "media";
        if (datosTarea.id) {
          elementoLista.dataset.tareaId = datosTarea.id;
        }

        const seccionInformacion = crearSeccionInformacion(datosTarea);
        const elementoTexto = seccionInformacion.querySelector(".task-text");
        const seccionBotones = crearBotonesAccion(datosTarea, elementoLista, elementoTexto);

        elementoLista.appendChild(seccionInformacion);
        elementoLista.appendChild(seccionBotones);
        listaElementosTarea.appendChild(elementoLista);
      };

      // ========== VALIDACIONES ==========
      
      // Validar que el texto no esté vacío
      const validarTextoTarea = (texto) => {
        if (!texto) {
          mostrarMensaje("No puedes añadir una tarea vacía", "error");
          return false;
        }
        return true;
      };

      // Validar límite de tareas
      const validarLimiteTareas = () => {
        if (listaElementosTarea.children.length >= MAXIMO_TAREAS) {
          mostrarMensaje(`Máximo ${MAXIMO_TAREAS} tareas`, "advertencia");
          return false;
        }
        return true;
      };

      // Validar que la tarea no esté duplicada
      const validarTareaUnica = (textoNuevo) => {
        const textosExistentes = Array.from(listaElementosTarea.querySelectorAll(".task-text"));
        const existe = textosExistentes.some(elemento => 
          elemento.textContent.toLowerCase() === textoNuevo.toLowerCase()
        );
        if (existe) {
          mostrarMensaje("Esa tarea ya existe", "advertencia");
          return false;
        }
        return true;
      };

      // Limpiar campos de entrada
      const limpiarCamposEntrada = () => {
        elementoEntradaTarea.value = "";
        elementoFechaTarea.value = "";
        elementoPrioridad.value = "media";
      };

      // Procesar nueva tarea
      const procesarNuevaTarea = async () => {
        const textoTarea = elementoEntradaTarea.value.trim();
        const fechaTarea = elementoFechaTarea.value;
        const prioridad = elementoPrioridad.value;

        // Validar tarea
        if (!validarTextoTarea(textoTarea)) return;
        if (!validarLimiteTareas()) return;
        if (!validarTareaUnica(textoTarea)) return;

        const nuevaTarea = { 
          texto: textoTarea, 
          completada: false, 
          fecha: fechaTarea,
          prioridad: prioridad,
          usuario_id: usuarioActivo.id
        };

        try {
          // Guardar en el servidor
          const res = await fetch(`${API_URL}/tareas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevaTarea)
          });
          const data = await res.json();
          if (!res.ok || !data.success) throw data;

          await cargarTareasDesdeAPI(usuarioActivo.id);
          limpiarCamposEntrada();
          mostrarMensaje("Tarea añadida", "exito");
        } catch (err) {
          mostrarMensaje("Error al guardar tarea en el servidor", "error");
          console.error(err);
        }
      };

      // ========== FILTROS ==========
      
      // Determinar si un elemento debe mostrarse según el filtro
      const debeElementoMostrarseConFiltro = (elementoLista, valorFiltro) => {
        const estaCompletada = elementoLista.classList.contains("completada");
        switch (valorFiltro) {
          case "todas": return true;
          case "completadas": return estaCompletada;
          case "pendientes": return !estaCompletada;
          default: return false;
        }
      };

      // Aplicar filtro a las tareas
      const aplicarFiltroTareas = () => {
        const valorFiltro = selectorFiltro.value;
        Array.from(listaElementosTarea.children).forEach(elementoLista => {
          elementoLista.style.display = debeElementoMostrarseConFiltro(elementoLista, valorFiltro) ? "flex" : "none";
        });
      };

      // ========== ELIMINAR Y EXPORTAR ==========
      
      // Eliminar todas las tareas
      const eliminarTodasLasTareas = async () => {
        if (!listaElementosTarea.children.length) {
          return mostrarMensaje("No hay tareas para borrar", "advertencia");
        }
        const confirmacion = confirm("¿Seguro que quieres borrar todas?");
        if (confirmacion) {
          try {
            const res = await fetch(`${API_URL}/tareas/usuario/${usuarioActivo.id}`, {
              method: "DELETE"
            });
            
            if (!res.ok) throw new Error("Error al eliminar");
            
            await cargarTareasDesdeAPI(usuarioActivo.id);
            mostrarMensaje("Todas las tareas eliminadas", "exito");
          } catch (err) {
            mostrarMensaje("Error al eliminar tareas del servidor", "error");
            console.error(err);
          }
        }
      };

      // Exportar tareas a JSON
      const exportarTareas = async () => {
        try {
          const res = await fetch(`${API_URL}/tareas?usuario_id=${usuarioActivo.id}`);
          const data = await res.json();
          
          if(!data.tareas || data.tareas.length === 0) {
            mostrarMensaje("No hay tareas para exportar", "advertencia");
            return;
          }
          
          // Crear archivo JSON y descargar
          const blob = new Blob([JSON.stringify(data.tareas, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const enlace = document.createElement("a");
          enlace.href = url;
          enlace.download = `tareas_${usuarioActivo.usuario}.json`;
          enlace.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          mostrarMensaje("Tareas exportadas", "exito");
        } catch (error) {
          mostrarMensaje("Error al exportar: " + error.message, "error");
        }
      };

      // ========== CONFIGURAR EVENTOS ==========
      
      const configurarEventos = () => {
        // Botón añadir tarea
        botonAnadirTarea.addEventListener("click", procesarNuevaTarea);
        
        // Tecla Enter en input de tarea
        elementoEntradaTarea.addEventListener("keydown", (e) => { 
          if (e.key === "Enter") procesarNuevaTarea(); 
        });
        
        // Selector de filtro
        selectorFiltro.addEventListener("change", aplicarFiltroTareas);
        
        // Botón eliminar todas
        botonEliminarTodas.addEventListener("click", eliminarTodasLasTareas);
        
        // Botón exportar
        const botonExportar = document.getElementById("btnExportar");
        if (botonExportar) {
          botonExportar.addEventListener("click", exportarTareas);
        }
      };

      // ========== INICIALIZACIÓN ==========
      
      const inicializarAplicacion = () => {
        cargarSesion(); // Cargar sesión si existe
        configurarEventos(); // Configurar todos los eventos
      };

      // Iniciar la aplicación
      inicializarAplicacion();
    });
