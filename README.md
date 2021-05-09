# Issue Management System Web Portal
The Issue Management System Web Portal helps organizations to manage their issues more efficiently. 

#### 2nd October 2020

## Setup/Installation Requirements

This project uses the PERN stack - Postgres, Express, React and Node.

### Set up your coding environment

The portal's folders at this point are made up of a front end built on React, and a backend built off Node. 

#### Backend set up
To set up this project, you need (on Linux):
* Clone the project: (https://github.com/Akasi-Systems/Issue-Management-System-Web.git) and cd into your backend folder
* Node (ensure that you install a version that is compatible with React, newer versions 10+)
* Npm 

Once you have these installed, you need to initialize with a package.json file. Run ```npm init``` and follow the prompts.  

We used ```server.js``` as our entry point.

##### Dependencies

Install the following dependencies

* Express
* Pg
* Body-parser
* Cors

Use the command ```npm install --save express pg body-parser cors```


##### Running the server

In order to run your server, run ```node server.js```

Installing ```nodemon``` ensures that the server can keep restarting itself, so that you don't have to keep running the ```node server.js``` command every time you make changes to your code. Use the folowing command to install nodemon globally: ```npm install -g nodemon``` To run the server, use the command ```nodemon server``` 

###### Running the endpoints
You can use postman to test your endpoints


#### Database

The project uses the postgres database.

##### Database setup

You need to download PostgreSQl and install it, based on your Linux distribution. (check the official website). 

Postgres has a default role called 'postgres'. To access the role, use the ```sudo -i -u postgres``` command. This opens up the postgres shell. 

From here, you can create a database ```CREATE DATABASE <database name>```

You then need to setup the pgAdmin GUI to make it easier to set up your database. Go to the official pgAdmin website. Download and install. 
It should ask you to enter a password. You can then create a server, schema, tables and add data to the tables. 

Next, connect your database with your server. Of importance here is the connection URI. Note the order of the string
```"postgres://<database user name>:<database password>@<host:<port>/<database name>"```


#### Frontend setup
For the frontend, you can use build or webpack. We used webpack.

To set up this project, you need (on Linux):
* cd into your frontend folder
* npm install
* npm start 

The app should compile successfully and you can now access the code from local host.
