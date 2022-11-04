import { GCell } from "./GCell";

var ID = function () {
    return '_' + Math.random().toString(36).substr(2, 9);
};

export class GSheet {
    constructor(spreadsheetid,index, onload, params) {
        this.spreadsheetid = spreadsheetid
        this.index = index
        this.rawData = this.request(onload, params)
    }

    get url(){
        return 'https://spreadsheets.google.com/feeds/cells/' + this.spreadsheetid + '/' + this.index + '/public/full?alt=json'
    }

    get data() {
        return this.rawData ? this.rawData.responseJSON.feed : {}
    }

    get title() {
        return this.data.title.$t
    }

    get totalColCount() {
        return parseInt(this.data.gs$colCount.$t)
    }

    get totalRowCount() {
        return parseInt(this.data.gs$rowCount.$t)
    }

    get colCount() {
        return this.cells.length > 0 ? Math.max(...this.cells.map(ce => ce.col)) : 0
    }

    get rowCount() {
        return this.cells.length > 0 ? Math.max(...this.cells.map(ce => ce.row)) : 0
    }

    get cells() {
        return this.data.entry ? this.data.entry.map(en => new GCell(en)) : []
    }

    get cellId() {
        return this.url.split('?')[0] + "/"
    }

    get id() {
        return this.url.split("/")[5]
    }

    get columns() {
        var result = []
        for (let i = 1; i <= this.colCount; i++) {
            var cell = this.getCell(1, i)
            result.push(cell.value) || ""
        }
        return result
    }

    ids(idCol = "id") {
        var result = []
        var colIndex = this.columns.indexOf(idCol) + 1
        if (colIndex == 0) throw new Error("primary key column " + idCol + " does not exist")
        for (var i = 2; i <= this.rowCount; i++) {
            var cell = this.getCell(i, colIndex)
            if (!cell.value) continue;
            result.push(cell.value)
        }
        return result

    }

    validate(id, idCol = "id") {
        if (!this.columns.includes(idCol)) throw new Error("primary key column " + idCol + " does not exist")
        if (this.ids(idCol).includes(id))
            throw new Error("id already exists in sheet " + this.title)
    }

    select(columns, where) {
        var columns = Format.columns(this.columns, columns)
        var result = []
        for (var i = 2; i <= this.rowCount; i++) {
            var obj = {}
            for (var j in columns) {
                j = parseInt(j)
                var thisCol = columns[j]
                var cell = this.getCell(i, j)
                obj[thisCol] = cell.value || ""
            }
            result.push(obj)
        }
        if (where)
            result = eval('result.filter(item => ' + where + ')')
        return result
    }

    selectId(id, idCol = "id") {
        var result = {}
        var columns = this.columns
        var colIndex = columns.indexOf(idCol) + 1
        if (colIndex == 0) throw new Error("primary key column " + idCol + " does not exist")
        for (var i = 2; i <= this.rowCount; i++) {
            var cell = this.getCell(i, colIndex)
            if (cell.value != id) continue;
            for (var j = 1; j <= this.colCount; j++) {
                var thisCol = columns[j - 1]
                var cell = this.getCell(i, j)
                result[thisCol] = cell.value || ""
            }
            break;
        }
        return result
    }

    updateId(id, col, value, idCol = "id") {
        var columns = this.columns
        var idColIndex = columns.indexOf(idCol) + 1
        if (idColIndex == 0) throw new Error("primary key column " + idCol + " does not exist")
        var colIndex = columns.indexOf(col) + 1
        if (colIndex == 0) return false
        for (var i = 2; i <= this.rowCount; i++) {
            var cell = this.getCell(i, idColIndex)
            if (cell.value != id) continue;
            var actualCell = this.getCell(cell.row, colIndex)
            if (actualCell.exists){ // change the value
                actualCell.value = value
                Query.API.prepare(this.title,actualCell)
            }
            else // add the cell in
                this.addCell(i, colIndex, value)
            //Query.run("Query.updateId", [this.title, id, col, value])
            return id
        }
        return false
    }

    insert(values, idCol = "id") {
        var columns = this.columns
        if (!columns.includes(idCol)) throw new Error("primary key column " + idCol + " does not exist")
        var rowIndex = this.rowCount + 1
        if (!values[idCol])
            values[idCol] = ID()
        this.validate(values[idCol], idCol)
        for (var key in values) {
            var colIndex = columns.indexOf(key) + 1
            if (colIndex == 0) continue
            var value = values[key]
            this.addCell(rowIndex, colIndex, value)
        }
        //Query.run("Query.insert", [this.title, values])
        return values.id
    }

    deleteId(id, idCol = "id") {
        var rowIndex = null
        var columns = this.columns
        var idColIndex = columns.indexOf(idCol) + 1
        if (idColIndex == 0) throw new Error("primary key column " + idCol + " does not exist")
        for (var i = 2; i <= this.rowCount; i++) {
            var cell = this.getCell(i, idColIndex)
            if (rowIndex)
                if (cell.row > rowIndex) this.shiftRowUp(cell.row)
            if (cell.value != id) continue;
            if (!rowIndex) rowIndex = cell.row
            for (var j = 1; j <= columns.length; j++)
                this.removeCell(i, j)
        }
        if (rowIndex){
            //Query.run("Query.deleteId", [this.title, id])
        }
        return !!rowIndex
    }

    shiftRowUp(rowIndex) {
        var cells = this.cells.filter(ce => ce.row == rowIndex)
        // last line gets removed to avoid duplicates
        if (rowIndex == this.rowCount){
            Query.API.prepare(this.title,cells.map(c => c.blankClone))
        }

        cells.forEach(ce => ce.shift("up", 1))
        Query.API.prepare(this.title,cells)
    }

    getRange(startRow, startCol, endRow, endCol) {
        return this.cells.filter(cell =>
        (cell.row >= startRow &&
            cell.row <= endRow &&
            cell.col >= startCol &&
            cell.col <= endCol)
        )
    }

    getCell(row, col) {
        return this.cells.filter(cell =>
        (cell.row == row &&
            cell.col == col)
        )[0] || {}
    }

    removeCell(row, col) {
        this.data.entry = this.cells.filter(cell => !(cell.row == row && cell.col == col)).map(cell => cell.data)
    }

    addCell(row, col, value) {
        var cell = GCell.create(this.cellId, row, col, value)
        Query.API.prepare(this.title,cell)
        this.data.entry.push(cell.data);
    }

    request(callback, params = []) { // gets all the data again
        var sheet = this
        return $.ajax({
            url: this.url,
            type: 'GET',
        }).always(function (jqXHR, textStatus) {
            if (typeof callback !== "undefined")
                callback(...params,sheet,textStatus)
        })
    }

    reload(callback, params = []) {
        this.rawData = this.request(callback, params)
    }
}