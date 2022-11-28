# Google-Sheets-Database
This NPM Package allows you to use a Google Spreadsheet as a database within your Node Js project.

## How to use
There are 2 setup parts in order to get this package working. The first part is setting up the API endpoint that calls routes to my script endpoint within a Google Script on your Google Drive. The second part is installing the NPM package and connecting to your the database via the deployment ID.


### Google
1. Create a new google script file \
![image](https://user-images.githubusercontent.com/53892067/204195998-9b9f3ef1-f8f8-4703-ae52-e43cb0316ee5.png)

2. Add the MCLib script as a library to your script `1wuipW_9oqNOq1l0bdbLiIrt5JnX8xzI_Bb7jA7rRzArfpfmys_7wNlgU` \
![image](https://user-images.githubusercontent.com/53892067/204196077-08e543dc-8433-4cc7-af9f-8580a06168ce.png)
![image](https://user-images.githubusercontent.com/53892067/204196135-6e16a89a-e602-416b-bec4-7852c8d4e4a3.png)
![image](https://user-images.githubusercontent.com/53892067/204196153-2033f8cd-1a42-4091-b551-1728f7a756be.png)


3. Add doPost method that redirects to the MCLib doPost method \
`const doPost = (e) => MCLib.doPost(e)`\
![image](https://user-images.githubusercontent.com/53892067/204196288-eb0e525c-92c6-4391-8a1c-351f95086d90.png)

4. Deploy your script as an Web app \
![image](https://user-images.githubusercontent.com/53892067/204196309-150613a4-627c-4eed-af37-a9924ba9738f.png)
![image](https://user-images.githubusercontent.com/53892067/204198581-89ca7088-0b34-44be-a8ef-b42b6dba899d.png)
![image](https://user-images.githubusercontent.com/53892067/204198641-05212477-6f38-4cd8-af71-ada7564051c9.png)

5. Authorize access \
![image](https://user-images.githubusercontent.com/53892067/204198696-b8097b9f-c067-4ba8-96f0-70e8f2c598d0.png)
![image](https://user-images.githubusercontent.com/53892067/204198713-b7c88b67-d659-4993-9512-c427e82fb92e.png)
![image](https://user-images.githubusercontent.com/53892067/204198738-b467fbed-c963-49bf-a377-923655eff407.png)
![image](https://user-images.githubusercontent.com/53892067/204198751-1b99f14c-6ad0-45d8-80e7-750f476f6108.png)

6. Copy the Deployment ID to your clipboard
![image](https://user-images.githubusercontent.com/53892067/204198806-abed432f-89f6-4a32-86cb-dd21e15138c0.png)

### Node
1. Set up your Node Project with `node init`

2. Load this library into your project \
`const googlesheetdatabase = require("google-sheet-database")`

3. Create a schema for a new table \
`SampleSchema = new googlesheetdatabase.schema(
    ["id", "column1", "column2", "column3"]
)`

4. Create a model for the schema \
`SampleModel = new googlesheetdatabase.model("SampleModel", SampleSchema)`

5. Connect to the database \
`googlesheetdatabase.connection.connect({
    databaseName: YOUR_DATABASE_NAME,
    apiKey: YOUR_DEPLOYMENT_ID
})`

### [Performing CRUD Operations](./test/main.js)
#### Inserting a single record (CREATE)
#### Update a single record (UPDATE)
#### Select a single record (READ)
#### Deleting a single record (DELETE)
#### Inserting Multiple Records (CREATE)
#### Update multiple records (UPDATE)
#### Select (READ)
#### Select with where condition (READ)
