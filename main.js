const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })

const googlesheetdatabase = require("./GoogleSheetDatabase")

// Creating a schema
SampleSchema = new googlesheetdatabase.schema(
    ["id", "column1", "column2", "column3"]
)

// Creating a Model
SampleModel = new googlesheetdatabase.model("SampleModel", SampleSchema)

// Connecting to the Database
googlesheetdatabase.connection.connect({
    databaseName: process.env.databaseName,
    apiKey: process.env.apiKey
})

//---------------- CRUD OPERATIONS ----------------//

// Inserting a single record (CREATE)
SampleModel.insert({
    column1: "column1 value",
    column2: "column2 value",
    column3: "column3 value"
}).then(id => {
    console.log(id)

    // Update a single record (UPDATE)
    SampleModel.updateId(id, "column1", "column1 value updated").then(res => {
        console.log(res)
    }).then(res => {
        console.log(res)

        // Select a single record (READ)
        SampleModel.selectId(id).then(res => {
            console.log(res)

            // Deleting a single record (DELETE)
            SampleModel.deleteId(id).then(res => {
                console.log(res)
            })
        })
    })
})

// Inserting Multiple Records (CREATE)
SampleModel.insertMulti([{
    id: "samplerecord1",
    column1: "entry 1 column1 value",
    column2: 8,
    column3: new Date()
}, {
    id: "samplerecord2",
    column1: "entry 2 column1 value",
    column2: 2,
    column3: new Date()
}]).then(res => {
    console.log(res)

    // Update multiple records (UPDATE)
    SampleModel.updateMulti([{
        id: "samplerecord1",
        column1: "entry 1 column1 value updated",
        column2: 8,
        column3: new Date()
    }, {
        id: "samplerecord2",
        column1: "entry 2 column1 value updated",
        column2: 2,
        column3: new Date()
    }]).then(res => {
        console.log(res)
    })
})

// Select (READ)
SampleModel.select().then(res => {
    console.log(res)
})

// Select with where condition (READ)
SampleModel.select("item.id == '613varu1kp'").then(res => {
    console.log(res)
})