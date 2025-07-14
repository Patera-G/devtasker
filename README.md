# 🗂️ TaskManager

A lightweight project and task management system built with **Symfony**, **Doctrine ORM**, and a clean **vanilla HTML + JS frontend**. Designed as a full-stack demo application showcasing secure API design, Dockerized deployment, and professional testing practices.

---

## ✨ Features

- 🔐 JWT Authentication (Login + Protected Routes)
- 🧾 Project & Task CRUD (with validation and relationships)
- 🔍 Filtering, Sorting, and Pagination
- 📦 RESTful API built with Symfony controllers & services
- 🎨 Styled frontend with cards, modals, and background visuals
- 🧪 PHPUnit-based API tests
- 🐳 Dockerized environment for easy local development

---

## 🧰 Tech Stack

| Layer      | Tools Used                                        |
|------------|---------------------------------------------------|
| Backend    | Symfony, Doctrine ORM, PHP 8+                     |
| Frontend   | HTML, CSS, Vanilla JS                             |
| Security   | JWT Authentication (LexikJWTAuthenticationBundle) |
| Database   | MySQL (or SQLite for tests)                       |
| DevOps     | Docker, Docker Compose                            |
| Testing    | PHPUnit, Symfony WebTestCase                      |

---

## 🚀 Getting Started

### 1. Clone and Setup

```bash
git clone https://github.com/your-username/taskmanager-pro.git
cd taskmanager-pro
cp .env .env.local
```

### 2. Start Docker

```bash
docker-compose up -d --build
```

### 3. Install & Migrate

```bash
docker exec php bash -c "composer install"
docker exec php bash -c "bin/console doctrine:migrations:migrate --no-interaction"
docker exec php bash -c "bin/console doctrine:fixtures:load --no-interaction"
```

---

## 🔐 Authentication

### Login Endpoint

```http
POST /api/login_check
Content-Type: application/json

{
  "email": "dev@example.com",
  "password": "password"
}
```

Use the token returned to authorize further requests:

```http
Authorization: Bearer {token}
```

---

## 📦 API Reference

### ✅ Projects

| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| GET    | `/api/projects`     | List with filters and sorting |
| POST   | `/api/projects`     | Create new project   |
| PUT    | `/api/projects/{id}`| Update a project     |
| DELETE | `/api/projects/{id}`| Delete a project     |

### ✅ Tasks

| Method | Endpoint         | Description            |
|--------|------------------|------------------------|
| GET    | `/api/tasks`     | List tasks             |
| POST   | `/api/tasks`     | Create new task        |
| PUT    | `/api/tasks/{id}`| Update a task          |
| DELETE | `/api/tasks/{id}`| Delete a task          |

#### Filtering & Sorting

### Tasks

The tasks list endpoint supports filtering, sorting, and pagination using query parameters:

```
/api/tasks?limit=5&page=1&sort=priority&direction=ASC&filter[status]=todo&filter[priority]=high&filter[projectId]=3
```

- `limit`: Number of items per page (max 100)
- `page`: Page number (starting from 1)
- `sort`: Field to sort by (e.g., priority, dueDate)
- `direction`: Sorting direction (`ASC` or `DESC`)
- `filter[status]`: Filter tasks by status
- `filter[priority]`: Filter tasks by priority
- `filter[projectId]`: Filter tasks belonging to a specific project

### Projects

The projects list endpoint supports pagination but **does not support sorting**:

```
/api/projects?limit=10&page=2
```

- `limit`: Number of items per page (max 100)
- `page`: Page number (starting from 1)


---

## 🧪 Running Tests

Tests are written using Symfony’s `WebTestCase` and cover:

- ✅ CRUD API functionality
- ✅ Validation scenarios
- ✅ Authenticated and unauthenticated routes
- ✅ Pagination and filtering logic

### Run All Tests

```bash
php bin/phpunit
```


---

## 🖥️ Frontend

The app includes a minimal but functional vanilla HTML/CSS/JS frontend, featuring:

- 🗂️ Project and Task lists with pagination, filtering, and sorting
- 🔐 Login with JWT token handling (stored in memory)
- 📝 Modal forms for create/edit actions
- 🎨 Clean styling with card layouts and background visuals
- 🔄 Loading indicators during API calls (UX polish)

---

## 🐳 Docker Support

The app is ready for containerized development with Docker.

### Services

- `php` - PHP 8 + Symfony CLI
- `mysql` - Database
- `nginx` or Symfony server (optional)

### Useful Commands

```bash
# Start containers
docker-compose up -d

# Access the PHP container
docker exec -it php bash

# Run Symfony commands inside container
bin/console doctrine:migrations:migrate
```

---

## 👤 Author

*Jiri Patera**  
[github.com/Patera-G](https://github.com/Patera-G)

---

## 📄 License

MIT — Free to use, learn from, or build upon.
