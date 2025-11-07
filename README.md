# APDS7311_POE_PART3_ST10274003-ST10356945

Gomolemo Motsebe 
ST10356945 
ST10274003 
Kuzivakwashe C Kanyemba 
README. 
1. Overview 
This project is part of the APDS7311 Portfolio of Evidence (POE) Part 3. It demonstrates a 
secure Customer International Payments Portal and an accompanying API developed 
using Node.js and Express. The front-end is built using 
React.  
2. Project Objectives 
a) Develop a secure backend API for the Customer Portal. 
b)  Implement password hashing and salting for authentication.  
c) Apply input validation using RegEx whitelisting.  
d) Ensure all API traffic runs over SSL (HTTPS).  
e) Protect against common web attacks such as SQL Injection, XSS, and CSRF. 
f) 
Demonstrate the security implementation through API testing (Postman). 
3. Technologies Used 
• Node.js: JavaScript runtime for backend development.  
• Express.js: Web framework for building API routes. 
• Bcrypt: Library used for password hashing and salting.  
• dotenv: Used for managing environment variables securely. 
• SSL Certificates: Used for secure HTTPS connections.  
• Postman: Tool for API testing. 
4. Folder Structure 
/APDS_POE2_ST10274003_ST10356945 
/payments-backend 
/src 
/routes 
auth.js 
payments.js 
/middleware 
auth.js 
db.js 
index.js 
seed-employees.js 
.env 
Node.modules 
schema.sql 
certs/ 
5. Installation & Setup 
i. 
ii. 
iii. 
iv. 
v. 
Install Node.js (LTS version) from https://nodejs.org/  
Download the project. 
Open the project in Visual Studio Code. 
Run the following commands in the terminal (bash):  
1. npm install 
2. cd payments-backend 
3. npm start 
Access the API in your browser at: `https://localhost:3000` (You may need to 
bypass SSL warning for self-signed certificates). 
6. API Testing with Postman 
Use Postman to test the API endpoints.  
Example Registration Request: POST 
https://localhost:3000/api/auth/register  
{  
"fullName": "John Doe",  
"idNumber": "8801011234567", 
"accountNumber": "100200300",  
"password": "Password@1234"  
}  
Expected Response: User registered successfully!  
To verify security, attempt SQL Injection with a string like:  
'; DROP TABLE customers; 
The system should reject it immediately. 
7. Implemented Security Features  
• Password Hashing and Salting using bcrypt Input  
• Whitelisting using RegEx patterns  
• Secure HTTPS communication via SSL  
• Protection from SQL Injection and XSS  
• Authentication middleware for route protection  
• Environment variable encryption using dotenv  
8. Conclusion  
This README serves as the documentation for the backend implementation of the 
Customer International Payments Portal. It confirms that security requirements have 
been met, and the API has been tested for vulnerabilities. The next stage will focus on 
developing the React-based front-end interface to interact with this backend 
