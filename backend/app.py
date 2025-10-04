from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# === ARCHIVOS JSON ===
USUARIOS_FILE = "usuarios.json"
TAREAS_FILE = "tareas.json"

# === FUNCIONES DE AYUDA PARA JSON ===
def leer_json(archivo):
    if os.path.exists(archivo):
        with open(archivo, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def guardar_json(archivo, datos):
    with open(archivo, "w", encoding="utf-8") as f:
        json.dump(datos, f, indent=4, ensure_ascii=False)

# === INICIALIZAR "BASE DE DATOS" ===
usuarios = leer_json(USUARIOS_FILE)
tareas = leer_json(TAREAS_FILE)
contador_tareas = len(tareas) + 1

# === ENDPOINT PRINCIPAL ===
@app.route("/")
def home():
    return jsonify({"mensaje": "🚀 API de ToDo funcionando con CRUD de Usuarios y Tareas con JSON"})

# ========================================
# === CRUD DE USUARIOS ===
# ========================================

# CREATE
@app.route("/usuarios", methods=["POST"])
def crear_usuario():
    global usuarios
    datos = request.get_json()

    if not datos or "usuario" not in datos or "email" not in datos or "password" not in datos:
        return jsonify({"success": False, "message": "Faltan datos"}), 400

    nuevo_id = f"U{len(usuarios)+1:03d}"
    usuario = {
        "id": nuevo_id,
        "usuario": datos["usuario"],
        "email": datos["email"],
        "password": datos["password"]
    }

    usuarios[nuevo_id] = usuario
    guardar_json(USUARIOS_FILE, usuarios)

    return jsonify({
        "success": True,
        "message": "Usuario creado exitosamente",
        "usuario": usuario
    }), 201

# READ (todos los usuarios)
@app.route("/usuarios", methods=["GET"])
def listar_usuarios():
    return jsonify({"success": True, "usuarios": list(usuarios.values())}), 200

# READ (un usuario específico)
@app.route("/usuarios/<id>", methods=["GET"])
def obtener_usuario(id):
    if id not in usuarios:
        return jsonify({"success": False, "message": "Usuario no encontrado"}), 404
    return jsonify({"success": True, "usuario": usuarios[id]}), 200

# UPDATE
@app.route("/usuarios/<id>", methods=["PUT"])
def actualizar_usuario(id):
    global usuarios
    if id not in usuarios:
        return jsonify({"success": False, "message": "Usuario no encontrado"}), 404

    datos = request.get_json()
    if not datos:
        return jsonify({"success": False, "message": "No enviaste datos"}), 400

    usuario = usuarios[id]
    if "usuario" in datos:
        usuario["usuario"] = datos["usuario"]
    if "email" in datos:
        usuario["email"] = datos["email"]
    if "password" in datos:
        usuario["password"] = datos["password"]

    usuarios[id] = usuario
    guardar_json(USUARIOS_FILE, usuarios)

    return jsonify({
        "success": True,
        "message": "Usuario actualizado correctamente",
        "usuario": usuario
    }), 200

# DELETE
@app.route("/usuarios/<id>", methods=["DELETE"])
def eliminar_usuario(id):
    global usuarios
    if id not in usuarios:
        return jsonify({"success": False, "message": "Usuario no encontrado"}), 404

    eliminado = usuarios.pop(id)
    guardar_json(USUARIOS_FILE, usuarios)

    return jsonify({
        "success": True,
        "message": "Usuario eliminado correctamente",
        "usuario": eliminado
    }), 200

# LOGIN
@app.route("/login", methods=["POST"])
def login():
    datos = request.get_json()
    if not datos or "email" not in datos or "password" not in datos:
        return jsonify({"success": False, "message": "Faltan credenciales"}), 400

    for u in usuarios.values():
        if u["email"] == datos["email"] and u["password"] == datos["password"]:
            return jsonify({"success": True, "message": "Login exitoso", "usuario": u}), 200

    return jsonify({"success": False, "message": "Credenciales incorrectas"}), 401

# ========================================
# === CRUD DE TAREAS ===
# ========================================

# CREATE - Crear nueva tarea
@app.route('/tareas', methods=['POST'])
def crear_tarea():
    global tareas, contador_tareas
    datos = request.get_json()
    
    if not datos or "usuario_id" not in datos or "texto" not in datos:
        return jsonify({"success": False, "message": "Faltan datos (usuario_id y texto son requeridos)"}), 400
    
    if datos["usuario_id"] not in usuarios:
        return jsonify({"success": False, "message": "Usuario no encontrado"}), 404
    
    id_tarea = f"T{contador_tareas:03d}"
    contador_tareas += 1
    
    tarea = {
        "id": id_tarea,
        "usuario_id": datos["usuario_id"],
        "texto": datos["texto"],
        "fecha": datos.get("fecha"),
        "prioridad": datos.get("prioridad", "media"),
        "completada": datos.get("completada", False)
    }
    
    tareas[id_tarea] = tarea
    guardar_json(TAREAS_FILE, tareas)
    
    return jsonify({
        "success": True, 
        "message": "Tarea creada exitosamente", 
        "tarea": tarea
    }), 201

# READ - Obtener todas las tareas
@app.route('/tareas', methods=['GET'])
def obtener_todas_tareas():
    usuario_id = request.args.get('usuario_id')
    
    if usuario_id:
        tareas_filtradas = [t for t in tareas.values() if t["usuario_id"] == usuario_id]
        return jsonify({"success": True, "tareas": tareas_filtradas}), 200
    
    return jsonify({"success": True, "tareas": list(tareas.values())}), 200

# READ - Obtener una tarea específica
@app.route('/tareas/<id>', methods=['GET'])
def obtener_tarea(id):
    if id not in tareas:
        return jsonify({"success": False, "message": "Tarea no encontrada"}), 404
    return jsonify({"success": True, "tarea": tareas[id]}), 200

# UPDATE - Actualizar tarea existente
@app.route('/tareas/<id>', methods=['PUT'])
def actualizar_tarea(id):
    global tareas
    if id not in tareas:
        return jsonify({"success": False, "message": "Tarea no encontrada"}), 404
    
    datos = request.get_json()
    if not datos:
        return jsonify({"success": False, "message": "Debe enviar datos para actualizar"}), 400
    
    tarea = tareas[id]
    
    if "texto" in datos:
        tarea["texto"] = datos["texto"]
    if "fecha" in datos:
        tarea["fecha"] = datos["fecha"]
    if "prioridad" in datos:
        tarea["prioridad"] = datos["prioridad"]
    if "completada" in datos:
        tarea["completada"] = datos["completada"]
    
    tareas[id] = tarea
    guardar_json(TAREAS_FILE, tareas)
    
    return jsonify({
        "success": True, 
        "message": "Tarea actualizada correctamente", 
        "tarea": tarea
    }), 200

# DELETE - Eliminar tarea
@app.route('/tareas/<id>', methods=['DELETE'])
def eliminar_tarea(id):
    global tareas
    if id not in tareas:
        return jsonify({"success": False, "message": "Tarea no encontrada"}), 404
    
    eliminada = tareas.pop(id)
    guardar_json(TAREAS_FILE, tareas)
    
    return jsonify({
        "success": True, 
        "message": "Tarea eliminada correctamente",
        "tarea": eliminada
    }), 200

# DELETE - Eliminar todas las tareas de un usuario
@app.route('/tareas/usuario/<usuario_id>', methods=['DELETE'])
def eliminar_tareas_usuario(usuario_id):
    global tareas
    if usuario_id not in usuarios:
        return jsonify({"success": False, "message": "Usuario no encontrado"}), 404
    
    tareas_eliminadas = []
    ids_a_eliminar = []
    
    for id_tarea, tarea in tareas.items():
        if tarea["usuario_id"] == usuario_id:
            tareas_eliminadas.append(tarea)
            ids_a_eliminar.append(id_tarea)
    
    for id_tarea in ids_a_eliminar:
        del tareas[id_tarea]
    
    guardar_json(TAREAS_FILE, tareas)
    
    return jsonify({
        "success": True,
        "message": f"Se eliminaron {len(tareas_eliminadas)} tareas del usuario",
        "tareas_eliminadas": tareas_eliminadas
    }), 200

# === EJECUTAR SERVIDOR ===
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)