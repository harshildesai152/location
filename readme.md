This is a full-stack location-based application with a React frontend and Node.js backend.
------------------------------
1. Clone the Project
   Clone the repository to your local machine using the following command:
   ```bash
   https://github.com/harshildesai152/location.git

------------------------------
2. Import the Database
------------------------------

- Open phpMyAdmin or your MySQL workbench.
- Import the database file named:
  LocationProjectDB.sql

This will create all the necessary tables.


Or execute below commands in given sequence to make necessary tables : 
<br>
1. CREATE DATABASE users :

 CREATE TABLE locations (
<br>
  id int NOT NULL AUTO_INCREMENT,
<br>
  user_id int DEFAULT NULL,
<br>
  name varchar(100) DEFAULT NULL,
<br>
  latitude float DEFAULT NULL,
<br>
  longitude float DEFAULT NULL,
<br>
  PRIMARY KEY (id)
<br>
)

3. CREATE TABLE signup_data (
 <br>
  id int NOT NULL AUTO_INCREMENT,
<br>
  name varchar(100) NOT NULL,
<br>
  email varchar(45) NOT NULL,
<br>
  password varchar(255) NOT NULL,
<br>
  PRIMARY KEY (id),
<br>
  UNIQUE KEY email_UNIQUE (email)
<br>
) 

------------------------------
3. Install Dependencies
------------------------------

Open two terminals:

▶ Terminal 1 (Frontend):
--------------------------

```bash
cd my-app
```
 ```bash
npm install
```
▶ Terminal 2 (Backend):
--------------------------
 ```bash
cd backend
```
 ```bash
npm install
```
------------------------------
4. Setup Environment Variables
------------------------------

In the backend folder, create a file named .env with the following content:
 ```bash
PORT=your_port_number
JWT_SECRET=your_jwt_secret  
DB_PASSWORD=your_mysql_password
```
(Replace the placeholders with your actual values.)

------------------------------
5. Run the Application
------------------------------

▶ Start the backend server:
--------------------------
 ```bash
npm run server
```
▶ Start the frontend app:
--------------------------
 ```bash
npm run dev
```
------------------------------
The backend will be running on port number given by you in .env (Default is 3000) and Frontend on port number 5173

On your browser open  "http://localhost:5173"

✅ You're Ready to Go!
------------------------------

Both frontend and backend should now be running and connected.
