This is a full-stack location-based application with a React frontend and Node.js backend.
------------------------------
1. Clone the Project
------------------------------

Clone the repository to your local machine.

------------------------------
2. Import the Database
------------------------------

- Open phpMyAdmin or your MySQL workbench.
- Import the database file named:
  LocationProjectDB.sql

This will create all the necessary tables.

------------------------------
3. Install Dependencies
------------------------------

Open two terminals:

▶ Terminal 1 (Frontend):
--------------------------
```cd my-app```
```npm install```

▶ Terminal 2 (Backend):
--------------------------
cd backend
npm install

------------------------------
4. Setup Environment Variables
------------------------------

In the backend folder, create a file named .env with the following content:

PORT=your_port_number  
JWT_SECRET=your_jwt_secret  
DB_PASSWORD=your_mysql_password

(Replace the placeholders with your actual values.)

------------------------------
5. Run the Application
------------------------------

▶ Start the backend server:
--------------------------
npm run server

▶ Start the frontend app:
--------------------------
npm run dev

------------------------------
✅ You're Ready to Go!
------------------------------

Both frontend and backend should now be running and connected.
