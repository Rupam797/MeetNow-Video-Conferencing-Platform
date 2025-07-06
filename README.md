# 📹 VideoConnect - Full Stack Video Conferencing Platform

A full-stack video conferencing web application built with **Spring Boot**, **MySQL**, **WebSockets**, **AgoraRTC**, **React**, **Vite**, and **Tailwind CSS**.

---

## 🚀 Features

- ✅ User Authentication (Register/Login)
- 📅 Create & Join Meeting Rooms
- 🎥 Real-time Video & Audio Communication (via AgoraRTC)
- 💬 Live Chat within meetings (WebSocket powered)
- 👥 Participant Management
- 📝 Meeting History
- 🔐 Secure JWT-based Authorization
- 📱 Fully Responsive UI

---

## 🛠️ Tech Stack

### 💻 Backend:
- Spring Boot
- MySQL
- JPA (Hibernate)
- WebSockets (STOMP over SockJS)
- Spring Security + JWT
- RESTful APIs

### 🌐 Frontend:
- React (with Vite)
- Tailwind CSS
- AgoraRTC SDK
- Axios, React Router
- WebSocket Client (SockJS + STOMP)

---

## ⚙️ Getting Started

### 🔧 Prerequisites

- Java 17+
- Node.js 18+
- MySQL Server
- Agora Developer Account

---

### 🧪 Backend Setup

1. Clone the repo and navigate to `backend/`:
    ```bash
    cd backend
    ```

2. Set up your MySQL database:
    ```sql
    CREATE DATABASE videoconnect;
    ```

3. Configure your `application.properties`:

    ```properties
    # MySQL
    spring.datasource.url=jdbc:mysql://localhost:3306/videoconnect
    spring.datasource.username=root
    spring.datasource.password=yourpassword

    # Hibernate
    spring.jpa.hibernate.ddl-auto=update

    # JWT Secret
    jwt.secret=your_jwt_secret_key

    # Agora
    agora.app-id=your_agora_app_id
    ```

4. Run the Spring Boot App:
    ```bash
    ./mvnw spring-boot:run
    ```

---

### 🎨 Frontend Setup

1. Navigate to the frontend folder:
    ```bash
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root of `frontend/`:

    ```env
    VITE_BACKEND_URL=http://localhost:8080
    VITE_AGORA_APP_ID=your_agora_app_id
    ```

4. Start the React development server:
    ```bash
    npm run dev
    ```

---

## 🔐 Authentication Flow

- JWT-based authentication
- Secure API routes
- Role-based access control (optional)

---

## 🔌 WebSocket Configuration

- **Endpoint:** `ws://localhost:8080/ws`
- Uses STOMP over SockJS
- Subscriptions:
  - `/topic/chat/{roomId}`
  - `/topic/participants/{roomId}`

---

## 🗂️ Sample REST API Endpoints

| Method | Endpoint                 | Description              |
|--------|--------------------------|--------------------------|
| POST   | `/api/auth/register`     | Register a new user      |
| POST   | `/api/auth/login`        | User login               |
| GET    | `/api/meetings`          | Get all meetings         |
| POST   | `/api/meetings/create`   | Create a meeting room    |
| GET    | `/api/meetings/{id}`     | Join a meeting by ID     |

---

## 🧠 Agora Integration

1. Create an account at [Agora.io](https://www.agora.io/)
2. Create a project and get the **App ID**
3. Add the **App ID** to:
   - `application.properties` (backend)
   - `.env` (frontend)
4. Agora handles video/audio streaming

---

## 📷 UI Preview

> *(Replace these with your real images)*

![Dashboard](https://your-image-url.com/dashboard.png)
![Meeting Room](https://your-image-url.com/meeting-room.png)

---

## 📌 Future Improvements

- 🖥️ Screen Sharing
- 📼 Cloud Recording
- 🛎️ Notification System
- 🔎 Meeting Search/Filter
- 🧾 Meeting Summary & Notes
- 📱 PWA Support

---

## 📦 Tools Used

- Postman
- MySQL Workbench
- Agora Developer Console
- IntelliJ / VSCode

---

## 🤝 Contribution

Contributions are welcome! To get started:

```bash
# Fork and clone this repo
git clone https://github.com/yourusername/videoconnect.git
cd videoconnect

