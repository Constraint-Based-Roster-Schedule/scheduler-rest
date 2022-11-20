# scheduler-rest
This repository houses the REST server implemented for the Constraint Based Roster Schedule.
The package management module used to build this project is `npm`. 

### Installing the dependencies
The dependencies are as listed in the `package.json` file and can be automatically install with `npm install` after cloning the project to local directory. 

Moreover, for the correct interfacing with the remote resources (database server and the microservice) the fields `API_TOKEN_SECRET` and `ACCESS_TOKEN_SECRET`. 

### Running the server locally

The rester server can be started locally by running the `npm start` command. By default this will run the server in an auto-reload environment called `nodemon` on port 5000. 



