# Acadex - University Management System API

Unicore is a robust, scalable, and secure backend API built for managing core university operations. The system handles authentication, role-based access control, academic records, course registrations, doctor schedules, and payment workflows.

---

## Tech Stack

* **Framework:** NestJS (Node.js)
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** JWT (Access & Refresh Tokens)
* **Documentation:** Swagger UI
* **Validation & Transformation:** `class-validator`, `class-transformer`

---

## Features

* **Authentication & Authorization:** Secure login system with JWT tokens, refresh token rotation, and Role-Based Access Control (RBAC) for Admins, Doctors, and Students.
* **Academic Management:** Full control over Academic Years, Departments, Courses, and Schedules.
* **Course Registration System:** Validates credit-hour limits, prerequisites, and prevents scheduling conflicts.
* **Standardized API Responses:** Global interceptor wrapping all successful outputs into a uniform JSON response structure.
* **Global Error Handling:** Custom Prisma Exception Filters providing clean, actionable error messages.
* **Interactive API Docs:** Fully integrated Swagger UI for easy endpoint testing.

---

## Installation & Local Setup

### Prerequisites
* Node.js (v18 or higher)
* PostgreSQL database

### 1. Clone the Repository
```bash
git clone [git clone https://github.com/AbdElazizYasser2/Acadex.git](git clone https://github.com/AbdElazizYasser2/Acadex.git)
cd Acadex

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


