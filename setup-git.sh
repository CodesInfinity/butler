#!/bin/bash
cd /Users/agustinrodriguez/Desktop/butler

# Inicializar git si no existe
if [ ! -d .git ]; then
    git init
fi

# Agregar remote si no existe
if ! git remote | grep -q origin; then
    git remote add origin https://github.com/CodesInfinity/butler.git
fi

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit: Tauri + React + TypeScript + Tailwind setup"

# Subir al repositorio
git branch -M main
git push -u origin main
