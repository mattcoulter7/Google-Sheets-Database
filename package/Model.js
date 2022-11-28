const Connection = require("./Connection")

class Model {
    constructor(name,schema){
        this.name = name;
        this.schema = schema;
        this.connection = null;
        Connection.models.push(this)
    }
    select(where){
        return this.connection.execute({
            func:"Query.select",
            params:[this.name,"*",where]
        })
    }
    selectId(id){
        return this.connection.execute({
            func:"Query.selectId",
            params:[this.name,id,this.schema.idCol]
        })
    }
    insert(values){
        return this.connection.execute({
            func:"Query.insert",
            params:[this.name,values,this.schema.idCol]
        })
    }
    insertMulti(values){
        return this.connection.execute({
            func:"Query.insertMulti",
            params:[this.name,values,this.schema.idCol]
        })
    }
    updateId(id, column, value){
        return this.connection.execute({
            func:"Query.updateId",
            params:[this.name,id,column,value,this.schema.idCol]
        })
    }
    updateMulti(updateData){
        return this.connection.execute({
            func:"Query.updateMulti",
            params:[this.name,updateData,this.schema.idCol]
        })
    }
    deleteId(id){
        return this.connection.execute({
            func:"Query.deleteId",
            params:[this.name,id,this.schema.idCol]
        })
    }
    archiveId(id){
        return this.connection.execute({
            func:"Query.archiveId",
            params:[this.name,id,this.schema.idCol]
        })
    }
    restoreId(id){
        return this.connection.execute({
            func:"Query.restoreId",
            params:[this.name,id,this.schema.idCol]
        })
    }
    selectArchived(){
        return this.connection.execute({
            func:"Query.selectArchived",
            params:[this.name]
        })
    }
    resetTable(data){
        return this.connection.execute({
            func:"Query.resetTable",
            params:[this.name,data,this.schema.idCol]
        })
    }
}

module.exports = Model