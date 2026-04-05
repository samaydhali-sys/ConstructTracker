from flask import Flask, jsonify, request, send_from_directory
import json
import os

app = Flask(__name__, static_folder="../frontend")

DATA_FILE = "backend/data.json"

# Initialize data.json if not exists
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump({"tasks": []}, f)

def read_data():
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def write_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)

# Serve frontend files
@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(app.static_folder, path)

# API: Get all tasks
@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    data = read_data()
    return jsonify(data["tasks"])

# API: Add task
@app.route("/api/tasks", methods=["POST"])
def add_task():
    data = read_data()
    task = request.json
    task["id"] = len(data["tasks"]) + 1
    data["tasks"].append(task)
    write_data(data)
    return jsonify(task), 201

# API: Get single task
@app.route("/api/tasks/<int:task_id>", methods=["GET"])
def get_task(task_id):
    data = read_data()
    task = next((t for t in data["tasks"] if t["id"] == task_id), None)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(task)


# API: Update task
@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = read_data()
    task = next((t for t in data["tasks"] if t["id"] == task_id), None)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    updated = request.json
    task.update(updated)
    write_data(data)
    return jsonify(task)

if __name__ == "__main__":
    app.run(debug=True)