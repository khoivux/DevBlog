
# DevBlog

## 1. Introduction
DevBlog is a blog app using Java Spring Boot for the backend and ReactJS for the frontend.

## 2. Key Features
- Auth (JWT, OAuth2): register, login, social login
- Post, comment, follow user, like post, report post/comment
- Realtime notifications
- Admin & moderator management
- Redis caching, Cloudinary upload

## 3. Technologies
- **Backend:** Spring Boot, Spring Security, Spring Data JPA
- **Frontend:** ReactJS, TailwindCSS
- **Database:** MySQL, Redis
- **Authentication**: JWT, Oauth2 with Google/Github
- **Storage**: Cloudinary for storing images
- **API Docs**: Swagger

## 4. Getting Started

### Backend
1. Configure your database in `backend/src/main/resources/application.yml`
2. Run:
   ```sh
   cd backend
   ./mvnw spring-boot:run
   ```
3. API docs: `/swagger-ui.html`

### Frontend
1. Install dependencies:
   ```sh
   cd frontend
   npm install
   npm run dev
   ```
2. Visit: http://localhost:5173

