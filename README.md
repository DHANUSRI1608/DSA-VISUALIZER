DSA Visualizer

A Data Structures & Algorithms Visualizer built with React (Vite), styled with Tailwind CSS, and fully containerized using Docker + Nginx.

This project helps you understand and visualize popular algorithms like sorting, searching, and graph traversal in an interactive way.

🚀 Features

🔄 Visualize sorting algorithms step-by-step

🌲 Tree and graph traversal animations

🎨 Clean UI powered by Tailwind CSS

🐳 Dockerized → run anywhere without dependencies

⚡ Fast development with Vite

🛠️ Tech Stack

Frontend: React (Vite)

Styling: Tailwind CSS

Containerization: Docker, Docker Compose

Web Server (Prod): Nginx

📂 Project Structure
src/
 ┣ pages/              # Algorithm pages
 ┣ App.jsx             # Root app
 ┣ main.jsx            # React entry point
 ┣ index.css           # Global styles
 ┣ index.html          # Root HTML
 ┗ ...
Dockerfile             # Production build (React + Nginx)
Dockerfile.dev         # Development build (React + Vite)
docker-compose.yml     # Compose config
nginx.conf             # Nginx config for SPA routing

🐳 Running with Docker
1️⃣ Production (Nginx build)

Build and run the production container:

docker build -t dsa-visualizer .
docker run -p 3000:80 dsa-visualizer


App available at 👉 http://localhost:3000

2️⃣ Development (Hot Reload with Vite)

Use Dockerfile.dev + Docker Compose:

docker compose -f docker-compose.yml up --build


App available at 👉 http://localhost:5173

🌍 Pull from Docker Hub

No need to build manually — just pull the prebuilt image:

docker run -p 3000:80 dhanusri1608/dsa-visualizer:latest

👩‍💻 Author

Dhanusri K R R
🔗 Docker Hub Profile

📜 License

This project is licensed under the MIT License.
