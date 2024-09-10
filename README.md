# E-Commerce Platform

A full-stack e-commerce platform built with a Spring Boot backend and a React frontend. The platform enables product management, order tracking, and secure user authentication.

## Tutorial Video

Check out the tutorial video for a detailed walkthrough.

https://github.com/user-attachments/assets/50207c8d-88e6-4c90-b842-c6afefbc2670

## Features

- **Product Management (Admin):**
  - Add new products and remove existing ones.
  - Monitor incoming orders in real-time using Kafka and WebSocket.

- **User Functionality:**
  - Browse and add products to the cart.
  - Reset the cart and view order history.
  - Secure login and access with JWT-based authentication.

- **Responsive Frontend:**
  - User-friendly interface designed with React for seamless interaction.

## Technologies Used

- **Spring Boot:** Backend framework.
- **React:** Frontend library.
- **Kafka:** Real-time order tracking with WebSocket.
- **PostgreSQL:** Database management.
- **Docker:** Containerization for deployment.
- **JWT:** Secure authentication.

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/eycwave/e-commerce-platform.git
   ```
2. Navigate to the project directory:
   ```bash
   cd e-commerce-platform
   ```
3. Before running the project, update the `application.yml` file and the PostgreSQL section in the `docker-compose.yml` file with your database credentials and JWT secret key:

   **`application.yml` configuration:**
   ```yaml
   datasource:
       url: jdbc:postgresql://localhost:5432/your_db
       username: your_username
       password: your_password
       driver-class-name: org.postgresql.Driver

   application:
     security:
       jwt:
         secret-key: your_256bit_hex_key
         expiration: 86400000 # a day
         refresh-token:
           expiration: 604800000 # 7 days
   ```

   **`docker-compose.yml` configuration:**
   ```yaml
   postgres:
       image: postgres:13  # Use PostgreSQL version 13
       environment:
         POSTGRES_USER: YOUR_DB_USERNAME  # Database username
         POSTGRES_PASSWORD: YOUR_DB_PASSWORD  # Database password
         POSTGRES_DB: YOUR_DB  # Database name
       ports:
         - "5433:5432"  # PostgreSQL runs on port 5432
       volumes:
         - pgdata:/var/lib/postgresql/data  # Persist PostgreSQL data
   ```

**Note for Bot Users:**

If you wish to test the order functionality with bot users, you need to update the product UUID in the BotService file. This UUID is currently set statically and does not affect the core functionality of the project. Ensure you replace it with the UUID of an   existing product in your database for the bot to function correctly.
   
4. Build and run the Docker containers:
   ```bash
   docker-compose up --build
   ```
   
5. Start the Spring Boot application.
   
6. Start the React application.
   
7. Access the application:
   - Backend: `http://localhost:8080`
   - Frontend: `http://localhost:3000`
