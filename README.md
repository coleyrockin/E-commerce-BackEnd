# E-Commerce Back End

![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=flat&logo=express&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-5.x-52B0E7?style=flat&logo=sequelize&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-2.x_Driver-4479A1?style=flat&logo=mysql&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?style=flat&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat)

## About

A RESTful API back end for an e-commerce platform built with Express.js and Sequelize ORM. Provides full CRUD operations for managing products, categories, and tags with relational database associations including many-to-many relationships through a junction table.

## Features

- **RESTful API** — Full CRUD endpoints for products, categories, and tags
- **Sequelize ORM** — Model definitions with associations and validations
- **Many-to-Many** — Products and tags linked through ProductTag junction table
- **Database Seeding** — Pre-built seed data for quick development setup
- **Environment Config** — dotenv-based configuration for database credentials
- **Error Handling** — Graceful error responses across all endpoints

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Express.js 4 |
| ORM | Sequelize 5 |
| Database | MySQL (mysql2 driver) |
| Config | dotenv 8 |
| Dev Tools | Nodemon 2 |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/coleyrockin/E-commerce-BackEnd.git
cd E-commerce-BackEnd

# Install dependencies
npm install

# Set up environment variables
cp .env.EXAMPLE .env
# Edit .env with your MySQL credentials

# Create the database
mysql -u root -p < db/schema.sql

# Seed the database
npm run seed

# Start the server
npm start
```

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:id` | Get category by ID |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |
| GET | `/api/tags` | Get all tags |
| GET | `/api/tags/:id` | Get tag by ID |
| POST | `/api/tags` | Create tag |
| PUT | `/api/tags/:id` | Update tag |
| DELETE | `/api/tags/:id` | Delete tag |

## Project Structure

```
E-commerce-BackEnd/
├── assets/img/     # Demo screenshots
├── config/         # Sequelize connection config
├── db/             # Schema SQL
├── models/         # Sequelize models (Product, Category, Tag, ProductTag)
├── routes/         # Express route handlers
├── seeds/          # Seed data scripts
├── server.js       # Server entry point
└── package.json
```

---

Built by [Boyd Roberts](https://github.com/coleyrockin)
