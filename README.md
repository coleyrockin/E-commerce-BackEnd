# E-Commerce Back End

![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=flat&logo=express&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-6.x-52B0E7?style=flat&logo=sequelize&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-3.x_Driver-4479A1?style=flat&logo=mysql&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?style=flat&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat)

## About

A RESTful API back end for an e-commerce platform built with Express.js and Sequelize ORM. Provides CRUD operations for managing products, categories, and tags with relational database associations, including many-to-many relationships through a junction table.

## Features

- **RESTful API** - CRUD endpoints for products, categories, and tags
- **Protected Writes** - POST, PUT, and DELETE routes require an `x-api-key` header
- **Validated Payloads** - request bodies and route IDs are normalized before database writes
- **Sequelize ORM** - model definitions with associations and validations
- **Many-to-Many** - products and tags linked through ProductTag junction table
- **Database Seeding** - seed data for local development setup
- **Security Baseline** - request parser limits, basic security headers, and generic error handling

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Express.js 5 |
| ORM | Sequelize 6 |
| Database | MySQL with mysql2 driver |
| Config | dotenv 17 |
| Dev Tools | Nodemon 3, Node test runner |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/coleyrockin/E-commerce-BackEnd.git
cd E-commerce-BackEnd

# Install dependencies
npm install

# Create a local .env file with your credentials
cp .env.EXAMPLE .env

# Create the database
mysql -u root -p < db/schema.sql

# Seed the database
npm run seed

# Start the server
npm start
```

Add these values to `.env`:

```text
DB_NAME='ecommerce_db'
DB_USER='xxx'
DB_PASSWORD='xxx'
WRITE_API_KEY='change-me'
```

Write requests (`POST`, `PUT`, `DELETE`) must include the same value in the `x-api-key` header.

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

```text
E-commerce-BackEnd/
├── assets/img/     # Demo screenshots
├── config/         # Sequelize connection config
├── db/             # Schema SQL
├── middleware/     # API security middleware
├── models/         # Sequelize models
├── routes/         # Express route handlers
├── seeds/          # Seed data scripts
├── tests/          # Node test runner coverage
├── utils/          # Validation helpers
├── server.js       # Server entry point
└── package.json
```

## Tests

```bash
npm test
```

Built by [Boyd Roberts](https://github.com/coleyrockin)
