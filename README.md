# Alacrity

Alacrity Data Encryption

This application was built using Node v14.10.0.

##  In order to run:

1. Clone the project to your local file system using the command:
    ```bash
    git clone https://github.com/ramikamaldev/alacrity.git
    ```
2. Install the required node packages using the command: npm install
3. In a terminal transpile by running the Grun Task Runner using the command:
   ```bash
   grunt --env=dev
   ```
4. Run the program using the command:
   ```bash
   npm start
   ```
5. In order to utilise the storage functionality of the application by issuing a POST request (using postman or the like) to the endpoint: http://localhost:5050/storing-endpoint
   with the following structure for the JSON as the body of the post request:
   ```json
   {
        "id": "engineering-jobs-software",
        "value": {
            "random": "INSERT RANDOM VALUES",
            "randomer": "asdasd"
        },
            "encryption_key":"INSERT ENCRYPTION KEY"
   }
   ```
6. Utilise the retrieval functionality of the application by issuing a POST request to the endpoint http://localhost:5050/retrieval-endpoint
   with the following structure for the JSON as the body of the post request:
   ```json
   {
       "id": "engineering-jobs-*",
       "decryption_key":"qwertyu"
   }
   ```
