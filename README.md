# Academic Management Mobile System
> Mobile application built with **Ionic + Angular** to manage students, courses, evaluations and academic performance with different access levels based on user type.

![CI](https://github.com/UNAPLANNER/Ionic-project-academic-system-Mobile/actions/workflows/ci.yml/badge.svg)
![Angular](https://img.shields.io/badge/Angular-20.x-red)
![Ionic](https://img.shields.io/badge/Ionic-7.x-blue)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)

---

## Technical Video
> [Watch on YouTube](https://youtu.be/gerJrx91a_o)

---

## Table of Contents
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Firebase Setup](#firebase-setup)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Features](#features)
- [Roles & Permissions](#roles--permissions)
- [Testing](#testing)
- [CI/CD with GitHub Actions](#cicd-with-github-actions)
- [Git Workflow](#git-workflow)
- [Team Members](#team-members)

---

## Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| Ionic | 7.x | Main mobile framework |
| Angular | 19.x | Frontend framework |
| TypeScript | 5.x | Programming language |
| Firebase Auth | 10.x | User authentication |
| Cloud Firestore | 10.x | Cloud database |
| AngularFire | 17.x | Firebase + Angular integration |
| Capacitor | 6.x | Native Android/iOS build |
| @ionic/storage-angular | 4.x | Local storage |
| Chart.js + ng2-charts | 4.x / 10.x | Dashboard charts |
| @capacitor/push-notifications | 6.x | Push notifications |
| @capacitor/camera | 6.x | Image handling |
| Node.js | 20.x LTS | Runtime environment |

---

## Prerequisites

Before cloning the project, make sure you have the following installed:

### 1. Node.js (LTS version)
```bash
# Download from: https://nodejs.org/en/download
# Verify installation:
node --version   # should show v20.x.x or higher
npm --version    # should show 10.x.x or higher
```

### 2. Git
```bash
# Download from: https://git-scm.com/download/win
# Verify installation:
git --version    # should show git version 2.x.x
```

### 3. Angular CLI
```bash
npm install -g @angular/cli
ng version       # should show Angular CLI: 17.x.x or higher
```

### 4. Ionic CLI
```bash
npm install -g @ionic/cli
ionic --version  # should show 7.x.x or higher
```

### 5. Visual Studio Code (recommended)
Download from: https://code.visualstudio.com/download

**Recommended extensions:**
- Angular Language Service
- ESLint
- Prettier - Code formatter
- GitLens

---

## Installation

### Step 1 — Clone the repository

```bash
git clone https://github.com/UNAPLANNER/Ionic-project-academic-system-Mobile.git
cd Ionic-project-academic-system-Mobile
```

### Step 2 — Install dependencies

```bash
npm install
```

> If you get a dependency conflict error, run:
> ```bash
> npm install --legacy-peer-deps
> ```

### Step 3 — Set up Firebase (see section below)

### Step 4 — Run the project

```bash
ionic serve
# App opens at http://localhost:8100
```

---

## Firebase Setup

> **IMPORTANT:** The project uses a single shared Firebase project for the entire team.
> All collaborators use the **same credentials** — do **NOT** create your own Firebase project.
> Contact the team leader to get the credentials if you don't have them.

### Configure the credentials

Open `src/environments/environment.ts` and replace the content with:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCDf7p81RogGmx85Ag1ee1szV5J6ffl0O0',
    authDomain: 'academic-system-una.firebaseapp.com',
    projectId: 'academic-system-una',
    storageBucket: 'academic-system-una.firebasestorage.app',
    messagingSenderId: '473029646366',
    appId: '1:473029646366:web:600ec84d4ccf7889c7f60f'
  }
};
```

Also open `src/environments/environment.prod.ts` and add the same firebase config:

```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: 'AIzaSyCDf7p81RogGmx85Ag1ee1szV5J6ffl0O0',
    authDomain: 'academic-system-una.firebaseapp.com',
    projectId: 'academic-system-una',
    storageBucket: 'academic-system-una.firebasestorage.app',
    messagingSenderId: '473029646366',
    appId: '1:473029646366:web:600ec84d4ccf7889c7f60f'
  }
};
```
## Running the Project

### Development mode (browser)
```bash
ionic serve
# Opens: http://localhost:8100
```

### Lab mode (iOS + Android side by side)
```bash
ionic serve --lab
```

### Production build
```bash
npm run build
```

### Run tests
```bash
ng test
# With coverage report:
ng test --code-coverage
```

---

## Project Structure

```
Ionic-project-academic-system-Mobile/
├── .github/
│   └── workflows/
│       └── ci.yml                  ← GitHub Actions (CI/CD)
├── docs/
│   ├── research/                   ← Framework research PDF
│   ├── architecture/               ← Architecture diagrams & decisions
│   ├── api-contracts/              ← API endpoints & contracts
│   └── screenshots/                ← App screenshots
├── src/
│   └── app/
│       ├── core/
│       │   ├── models/             ← Student, Course, Evaluation, User
│       │   ├── services/           ← auth, student, course, evaluation
│       │   └── guards/             ← auth.guard, role.guard
│       ├── shared/
│       │   └── components/         ← Reusable components
│       └── features/
│           ├── auth/               ← Login, register, password recovery
│           ├── students/           ← Student CRUD
│           ├── courses/            ← Course CRUD
│           ├── evaluations/        ← Evaluation records
│           └── dashboard/          ← Metrics & charts
├── www/                            ← Generated build output (do not edit)
├── angular.json
├── capacitor.config.ts
├── ionic.config.json
├── package.json
└── README.md
```

---

## Features

### Student Module
- ✅ List all students
- ✅ Create new student
- ✅ Edit student information
- ✅ Delete student
- ✅ Search and filter students

### Course Module
- ✅ List available courses
- ✅ Create new course
- ✅ Assign students to courses
- ✅ Edit and delete courses

### Evaluation Module
- ✅ Register evaluations (exam, assignment, project)
- ✅ View evaluation history per student
- ✅ Automatically calculate averages

### Dashboard
- ✅ Total students, courses and evaluations
- ✅ Overall system average
- ✅ At-risk students
- ✅ Performance charts by course

---

## Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Full access — manages users, courses, students and evaluations |
| **Teacher** | Manages own courses, registers evaluations, views dashboard |
| **Student** | Views own performance and enrolled courses only |

---

## Testing

The project includes automated tests:

```bash
# Run all tests
ng test

# Run tests without watch mode (for CI)
ng test --watch=false --browsers=ChromeHeadless

# View coverage report
ng test --code-coverage
# Report is generated in: coverage/
```

**Types of tests implemented:**
- Unit tests for services (AuthService, StudentService, etc.)
- Unit tests for guards (AuthGuard, RoleGuard)
- Integration tests for main components

---

## CI/CD with GitHub Actions

Continuous integration is configured in `.github/workflows/ci.yml`.

**Automatically runs when:**
- You push to `main` or `develop`
- You open a Pull Request targeting `main` or `develop`

**What the workflow does:**
1. Sets up Node.js 20
2. Installs dependencies with `npm ci`
3. Runs unit tests with ChromeHeadless
4. Runs production build

View the status at: [GitHub Actions](https://github.com/UNAPLANNER/Ionic-project-academic-system-Mobile/actions)

---

## Git Workflow

### Branch structure

```
main          ← Stable, reviewed code only (production)
develop       ← Team integration branch
feature/xxx   ← One branch per feature
```

### How to work on a new feature

```bash
# 1. Update develop
git checkout develop
git pull origin develop

# 2. Create your branch
git checkout -b feature/feature-name

# 3. Work on your code...

# 4. Push your changes
git add .
git commit -m "feat: description of what you did"
git push origin feature/feature-name

# 5. Open a Pull Request on GitHub targeting develop
# 6. Ask a teammate to do a Code Review
# 7. Once approved, merge the PR
```

### Commit convention

| Prefix | When to use |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Formatting only, no logic |
| `refactor:` | Code refactoring |
| `test:` | Adding or modifying tests |
| `ci:` | CI/CD changes |

---

## Project Repositories

- **Mobile:** [Ionic-project-academic-system-Mobile](https://github.com/UNAPLANNER/Ionic-project-academic-system-Mobile)
- **Backend:** [Ionic-project-academic-system-Backend](https://github.com/UNAPLANNER/Ionic-project-academic-system-Backend)
