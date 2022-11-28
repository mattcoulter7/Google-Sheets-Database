class Schema {
    constructor(columns = [],idCol = "id"){
        this.idCol = idCol
        this.columns = columns;
        this.columnsString = columns.join(";")
    }
}

module.exports = Schema