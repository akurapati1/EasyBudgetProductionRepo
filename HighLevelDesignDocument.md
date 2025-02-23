# High-Level Design Document

## 1. Introduction
This document provides a detailed design of the Budget Forecasting Application, describing the main elements, data flow, and key functionalities. The application aims to help users manage their finances by tracking income, expenses, and savings.

## 2. Architecture Overview
The application is divided into three main layers: presentation, application, and data. This separation allows for scalability, maintainability, and clear separation of concerns.
### 2.1 Layer Description
Presentation Layer (Frontend): Handles the user interface and user interactions.
Application Layer (Backend): Manages the business logic and processing.
Data Layer (Database): Handles data storage and retrieval.
### 2.2 Architecture Diagram
```mermaid
graph TD
    subgraph Frontend [Presentation Layer]
        A1[React Components]
    end

    subgraph Backend [Application Layer]
        B1[Express Server]
        B2[Controllers]
        B3[Routes]
        B4[Services]
    end

    subgraph Database [Data Layer]
        C1[MongoDB]
        C2[Schemas]
    end

    A1 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> B4
    B4 --> C1
    C1 --> C2
````

## 3. Main Components
### 3.1 Frontend (React)
- **Components**:
  - `App.js`: Main application component.
  - `Login.js`: Handles user login.
  - `Register.js`: Handles user registration.
  - `Dashboard.js`: Displays user budget overview.
  - `Income.js`: Manages income entries.
  - `Expense.js`: Manages expense entries.
- **State Management**:
  - **Context API**: Provides global state management for user data, token, incomes, and expenses.

### 3.2 Backend (Express)
- **Server Setup**: 
  - `server.js`: Main entry point for the Express server, sets up middleware and routes.
- **Controllers**:
  - `UserController.js`: Manages user registration, login, and user data retrieval.
  - `IncomeController.js`: Manages adding and retrieving income data.
  - `ExpenseController.js`: Manages adding and retrieving expense data.
- **Routes**:
  - `authRoutes.js`: Defines endpoints for user registration and login.
  - `budgetRoutes.js`: Defines endpoints for managing incomes and expenses.
- **Models**:
  - `User.js`: Defines the user schema.
  - `Income.js`: Defines the income schema.
  - `Expense.js`: Defines the expense schema.

### 3.3 Database (MongoDB)
- **Schemas**:
  - `UserSchema`: Defines fields for username, password, income, and expenses.
  - `IncomeSchema`: Defines fields for date and amount.
  - `ExpenseSchema`: Defines fields for date and amount.

## 4. Data Flow
1. **User Registration**:
   - User submits registration form.
   - Frontend sends a POST request to `/auth/register`.
   - Backend hashes the password and saves the user to MongoDB.
   - User data is stored, and a success response is returned.

2. **User Login**:
   - User submits login form.
   - Frontend sends a POST request to `/auth/login`.
   - Backend verifies user credentials and returns a JWT token.
   - Frontend stores the token and uses it for authenticated requests.

3. **Adding Income**:
   - User submits income form.
   - Frontend sends a POST request to `/api/income` with the token.
   - Backend verifies the token, adds income to the user's data, and saves it in MongoDB.
   - Income data is stored, and a success response is returned.

4. **Adding Expense**:
   - User submits expense form.
   - Frontend sends a POST request to `/api/expense` with the token.
   - Backend verifies the token, adds expense to the user's data, and saves it in MongoDB.
   - Expense data is stored, and a success response is returned.

## 5. Diagrams
### 5.1 Process View Diagram

```mermaid

graph TD
    A[BudgetForecastingApplication] -->|Process| B[UserController]
    A -->|Process| C[IncomeController]
    A -->|Process| D[ExpenseController]
    A -->|Process| E[SavingsController]

    B -->|Thread| F[Register Thread]
    B -->|Thread| G[Login Thread]
    B -->|Thread| H[GetUserDetails Thread]
    
    C -->|Thread| I[AddIncome Thread]
    C -->|Thread| J[GetIncomeHistory Thread]

    D -->|Thread| K[AddExpense Thread]
    D -->|Thread| L[GetExpenseHistory Thread]

    E -->|Thread| M[AddSavings Thread]
    E -->|Thread| N[GetSavingsHistory Thread]
````


### 5.2 Logical View Diagram
```mermaid

classDiagram
    class BudgetForecastingApplication {
        -UserController userController
        -IncomeController incomeController
        -ExpenseController expenseController
        -SavingsController savingsController
        +register()
        +login()
        +addIncome()
        +addExpense()
        +addSavings()
        +notifyUser()
    }

    class UserController {
        -List~User~ users
        +register()
        +login()
        +getUserDetails()
    }

    class IncomeController {
        -List~Income~ incomes
        +addIncome()
        +getIncomeHistory()
    }

    class ExpenseController {
        -List~Expense~ expenses
        +addExpense()
        +getExpenseHistory()
    }

    class SavingsController {
        -List~Savings~ savings
        +addSavings()
        +getSavingsHistory()
    }

    class User {
        -String username
        -String password
        -List~Income~ incomes
        -List~Expense~ expenses
        -List~Savings~ savings
        +getUsername()
        +getPassword()
        +getIncomes()
        +getExpenses()
        +getSavings()
    }

    class Income {
        -String incomeId
        -String date
        -double amount
        +getIncomeId()
        +getDate()
        +getAmount()
    }

    class Expense {
        -String expenseId
        -String date
        -double amount
        +getExpenseId()
        +getDate()
        +getAmount()
    }

    class Savings {
        -String savingsId
        -String date
        -double disposableAmount
        -String goal
        +getSavingsId()
        +getDate()
        +getDisposableAmount()
        +getGoal()
    }

    BudgetForecastingApplication --> UserController
    BudgetForecastingApplication --> IncomeController
    BudgetForecastingApplication --> ExpenseController
    BudgetForecastingApplication --> SavingsController
    UserController --> User
    IncomeController --> Income
    ExpenseController --> Expense
    SavingsController --> Savings
````

### 5.3 Development View Diagram

```mermaid

graph TB
    subgraph BudgetForecastingApplication
        subgraph Controllers
            UC[userController.js]
            IC[incomeController.js]
            EC[expenseController.js]
            SC[savingsController.js]
        end

        subgraph Models
            UM[user.js]
            IM[income.js]
            EM[expense.js]
            SM[savings.js]
        end

        subgraph Services
            AS[authService.js]
            NS[notificationService.js]
        end

        subgraph Repositories
            UR[userRepository.js]
            IR[incomeRepository.js]
            ER[expenseRepository.js]
            SR[savingsRepository.js]
        end

        subgraph Utils
            DU[dateUtil.js]
            CU[currencyUtil.js]
        end

        APP[app.js]
        INDEX[index.js]
    end

    APP --> Controllers
    APP --> Models
    APP --> Services
    APP --> Repositories
    APP --> Utils
    INDEX --> APP

````
## 6. External Libraries and Dependencies
- **React**: Frontend library for building user interfaces
- **Express**: Backend web application framework for Node.js
- **MongoDB**: NoSQL database for storing user and financial data
- **Mongoose**: ODM library for MongoDB and Node.js
- **JWT (JSON Web Tokens)**: For secure authentication
- **bcrypt**: For password hashing
- **Chart.js**: For data visualization of budget and savings forecasts
- **Redux**: For state management in the frontend (if used)

## 7. Error Handling and Logging
### 7.1 Error Handling
- **Frontend**: 
  - Implement try-catch blocks for asynchronous operations
  - Use error boundaries in React to catch and display errors gracefully
- **Backend**:
  - Create custom error classes for different types of errors (e.g., ValidationError, AuthenticationError)
  - Implement global error handling middleware in Express

### 7.2 Logging
- Utilize a logging library like Winston or Morgan
- Log different levels: info, warn, error
- Include timestamps, request IDs, and relevant context in log messages
- Implement log rotation to manage log file sizes

## 8. Security Measures
- **Authentication**: JWT-based authentication for secure user sessions
- **Password Security**: Use bcrypt for password hashing before storage
- **HTTPS**: Enforce HTTPS for all client-server communications
- **Input Validation**: Implement thorough server-side input validation
- **Rate Limiting**: Apply rate limiting to prevent abuse of API endpoints
- **CORS**: Configure proper CORS settings to restrict unauthorized domain access
- **Data Encryption**: Encrypt sensitive data at rest in the database

## 9. Compatible systems and platforms
- **Node.js**: Backend runtime environment
- **MongoDB**: NoSQL database for storing user and financial data
- **Windows**: Compatible with Windows 10+
- **macOS**: Compatible with macOS Catalina+

