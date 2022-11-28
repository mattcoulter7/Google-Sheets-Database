class Connection {
    constructor(databaseName, apiKey) {
        this.databaseName = databaseName;
        this.apiKey = apiKey;
        this.models = this.constructor.models;

        this.establishConnections()
        this.initTables()
    }
    establishConnections(){
        this.models.forEach((model) => {
            model.connection = this;
        })
    }
    initTables(){
        this.models.forEach((model) => {
            this.execute({
                func:"Query.createOrGetTable",
                params:[model.name,model.schema.columnsString,model.schema.idCol]
            }).then(res => {
                console.log(res)
            })
        })
    }
    execute({
        func,
        params = []
    }) {
        return fetch(
            `https://script.google.com/macros/s/${this.apiKey}/exec`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                database:this.databaseName,
                func:func,
                params:params
            })
        })
            .then((resp) => {
                return resp.json()
            })
    }
    static connect({
        databaseName,
        apiKey
    }) {
        this.currentConnection = new this(databaseName, apiKey);
    }
    static currentConnection = null;
    static models = [] // temp cache for loaded models prior to connection
}

module.exports = Connection