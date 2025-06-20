# EasyFarma 🩺💊

**EasyFarma** es una aplicación médica centrada en el cliente, diseñada para facilitar la gestión integral de servicios médicos de forma segura, accesible y multiplataforma.

---

## 📌 Descripción General

EasyFarma ofrece un conjunto de funcionalidades orientadas tanto a pacientes como a sus familias, garantizando una experiencia intuitiva y adaptada a diferentes niveles de alfabetización digital.

### Funcionalidades clave:

- 📅 **Gestión de citas** médicas y recordatorios.
- 💊 **Seguimiento de tratamientos** activos.
- 👨‍👩‍👧 **Gestión familiar** para usuarios con personas a cargo.
- 🧑‍⚕️ **Gestión de médicos** con mapa interactivo.
- 👤 **Gestión de perfil** personal.
- 📧 **Gestor de correos electrónicos** personalizados.
- 🪪 **Tarjetas de asegurado** con código QR escaneable.
- 🧒 **Modo tutor** para control parental de cuentas infantiles.
- 📄 **Exportación de datos a PDF cifrado**.
- ♿ **Adaptación a modos de accesibilidad** para personas poco digitalizadas.
- 📱 **Diseño responsive**, optimizado para dispositivos móviles, tablets y escritorio gracias a **Ionic + React**.

---

## 🛠 Requisitos Previos

Compatible con **Windows**, **Linux** y **macOS**. Requiere:

- [Node.js](https://nodejs.org/) v22 (recomendado)
- NPM v10.9.2
- Firebase CLI → `npm install -g firebase-tools`
- Ionic CLI → `npm install -g @ionic/cli`
- Visual Studio Code (opcional pero recomendado)

---

## 📥 Instalación

Clona el repositorio y accede a la raíz:

```bash
git clone https://github.com/carlgar512/EasyFarma
cd EasyFarma
```

---

## 🔧 Backend – Firebase Functions

```bash
cd gestionMedicaBack/functions
npm install
npm run build
npm run serve
```

Esto compilará el backend en TypeScript y lo desplegará localmente con Firebase Emulator.

---

## 💻 Frontend – Ionic React

En otra terminal:

```bash
cd gestionMedicaFront
npm install
ionic build
ionic serve
```

Accede a la app desde: [http://localhost:8100](http://localhost:8100)

---

## 🛑 Parar la Ejecución

Presiona `Ctrl + C` en la terminal correspondiente para detener tanto backend como frontend.

---

## 📱 Versión Móvil

Se dispone de versiones móviles generadas con **AppFlow** para:
- Android (APK)
- iOS

Solo requieren descarga e instalación.

---

## 📂 Estructura del Proyecto

```
EasyFarma/
├── gestionMedicaBack/       # Backend (Firebase Functions)
│   └── functions/
├── gestionMedicaFront/      # Frontend (Ionic React)
```

---

## 📜 Scripts útiles

### Backend

- `npm run build`: Compilar TypeScript.
- `npm run serve`: Lanzar emulador local.
- `npm run deploy`: Desplegar funciones a Firebase.

### Frontend

- `ionic build`: Compilar proyecto.
- `ionic serve`: Ejecutar en local.

---

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más información.