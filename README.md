# APDS7311_POE_PART3_ST10274003-ST10356945

Gomolemo Motsebe ST10356945 and Kuzivakwashe C Kanyemba ST10274003 README. 
## 1. Overview 
This project is part of the APDS7311 Portfolio of Evidence (POE) Part 3. It demonstrates a 
secure Customer International Payments Portal and an accompanying API developed 
using Node.js and Express. The front-end is built using React.  
## 2. Project Objectives 
a) Develop a secure backend API for the Customer Portal.   
b)  Implement password hashing and salting for authentication.    
c) Apply input validation using RegEx whitelisting.    
d) Ensure all API traffic runs over SSL (HTTPS).    
e) Protect against common web attacks such as SQL Injection, XSS, and CSRF. 
f) Demonstrate the security implementation through API testing (Postman). 
## 3. Technologies Used 
• Node.js: JavaScript runtime for backend development.  
• Express.js: Web framework for building API routes.  
• Bcrypt: Library used for password hashing and salting.  
• dotenv: Used for managing environment variables securely.  
• SSL Certificates: Used for secure HTTPS connections.  
• Postman: Tool for API testing.   
• Jason web token (JWT) – an encrypted method of communication between a client and a server.
## 4. Folder Structure  
/payments-backend  
&emsp;/src  
&emsp;&emsp;/routes  
&emsp;&emsp;&emsp;auth.js  
&emsp;&emsp;&emsp;payments.js  
&emsp;&emsp;/middleware  
&emsp;&emsp;&emsp;auth.js  
&emsp;db.js  
&emsp;index.js  
&emsp;seed-employees.js  
.env  
Node.modules  
schema.sql  
certs/  
/payment-frontend  
	&emsp;/node_modules  
	&emsp;/public  
		&emsp;&emsp;index.html  
	&emsp;/src  
		&emsp;&emsp;/api  
			&emsp;&emsp;&emsp;API.js  
		&emsp;&emsp;/components  
			&emsp;&emsp;&emsp;Navbar.jsx  
		&emsp;&emsp;/pages  
			&emsp;&emsp;&emsp;/Customer  
				&emsp;&emsp;&emsp;&emsp;Login.jsx  
				&emsp;&emsp;&emsp;&emsp;Payments.jsx  
				&emsp;&emsp;&emsp;&emsp;Register.jsx  
			&emsp;&emsp;&emsp;/Employee  
				&emsp;&emsp;&emsp;&emsp;Dashboard.jsx  
				&emsp;&emsp;&emsp;&emsp;Login.jsx  
		&emsp;&emsp;App.css  
		&emsp;&emsp;App.jsx  
		&emsp;&emsp;index.js  
	&emsp;.env  
	&emsp;package-lock.json  
	&emsp;package.json  

## 5. Installation & Setup 
i. Install Node.js (LTS version) from https://nodejs.org/   
ii. Download the project.  
iii. Open the project in Visual Studio Code  
iv. Run the following commands in the terminal (bash):    
1. npm install 
2. cd payments-backend 
3. npm start 
v.  Access the API in your browser at: `https://localhost:3000` (You may need to 
bypass SSL warning for self-signed certificates).  
## 6 . API Testing with Postman 
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
## 7. Implemented Security Features  
• Password Hashing and Salting using bcrypt Input  
• Whitelisting using RegEx patterns  
• Secure HTTPS communication via SSL  
• Protection from SQL Injection and XSS  
• Authentication middleware for route protection  
• Environment variable encryption using dotenv  
## 8. Conclusion  
This README serves as the documentation for the backend implementation of the 
Customer International Payments Portal. It confirms that security requirements have 
been met, and the API has been tested for vulnerabilities. The next stage will focus on 
developing the React-based front-end interface to interact with this backend 
