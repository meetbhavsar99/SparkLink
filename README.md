# SparkLink

SparkLink is a platform designed to connect University of Windsor departments with Computer Science students for IT project support. It enables students to gain hands-on experience while solving departmental IT challenges through skill-based matching and paid opportunities.

## Project Structure

```
SparkLink-main/
│── recommendation/            # Recommendation system module
│── sparklink/                 # Frontend (React.js)
│── sparklink-backend/         # Backend (Node.js, Express, MySQL)
│── Sparklink-TestCases/       # Test cases for project
│── node_modules/              # Dependencies
│── package.json               # Project dependencies
│── package-lock.json          # Dependency lock file
│── README.md                  # Project documentation
```

## Prerequisites

- **Node.js** (v18 or later recommended)
- **MySQL** (Database setup required)
- **npm** or **yarn** for package management

## Backend Setup (Node.js, Express, MySQL)

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
   npx nodemon app.js
   ```


## Frontend Setup (React.js)

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

- **Backend**: `cd sparklink-backend && npx nodemon app.js`
- **Frontend**: `cd sparklink && npm start`

Make sure both the backend and frontend are running simultaneously for full functionality.

## Features

- User authentication (Admin, Student, Supervisor, Business Owner)
- Profile management
- Project application and tracking
- Contact form with email notifications

## Contributors

Team of Winter 2025 -
- [Meet Bhavsar](https://www.linkedin.com/in/meetkumar-bhavsar-0059ba1b5/)
- [Heet Patel](https://www.linkedin.com/in/heet2002/)
- [Chaitanya Parikh](https://www.linkedin.com/in/chaitanyap310/)
- [Vinit Vekaria](https://www.linkedin.com/in/vinit-vekariaengineer/)

Team of Fall 2024 -
- [Kausar Fatema](https://www.linkedin.com/in/kausar-fatema-9060871b1/)
- [Pooja Vishwakarma](https://www.linkedin.com/in/pooja-vishwakarma95/)
- [Fajuko Michael](https://www.linkedin.com/in/fajuko-odunayo-5256a1265/)
- [Joshua Daniel](https://www.linkedin.com/in/joshua-daniel1999/)
- [Gireesh Chandra](https://www.linkedin.com/in/gireesh-busam/)
- [Amanbhai Arifbhai](#)

## License

This project is licensed under the MIT License.

