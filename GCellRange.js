/*************************************\
 * Cell Range Stores multiple cells
 * get '.values'
\*************************************/

export class GCellRange{
    constructor (cells = []){
        this.sheetname
        this.cells = cells
    }

    get startRow(){
        return this.cells.reduce((prev,curr) => (prev === -1 || curr.row < prev) ? curr.row : prev,-1)
    }
    
    get endRow(){
        return this.cells.reduce((prev,curr) => (prev === -1 || curr.row > prev) ? curr.row : prev,-1)
    }

    get startCol(){
        return this.cells.reduce((prev,curr) => (prev === -1 || curr.col < prev) ? curr.col : prev,-1)
    }

    get endCol(){
        return this.cells.reduce((prev,curr) => (prev === -1 || curr.col > prev) ? curr.col : prev,-1)
    }

    get rows(){
        return this.endRow - this.startRow + 1
    }

    get cols(){
        return this.endCol - this.startCol + 1
    }

    get values(){
        return this.cells.reduce(function(prev,curr){
            var row = prev[curr.row] || []
            row[curr.col] = curr.value
            prev[curr.row] = row
            return prev
        },[]).map(a => a.filter(a => typeof a !== "undefined")).filter(a => typeof a !== "undefined") // remove empty shifted vals
    }

    // use this to extract the script for setting the values of all cells in range
    script(sheetname){
        return {
            func:"setCells",
            params:[sheetname,this.startRow,this.startCol,this.rows,this.cols,this.values]
        }
    }

    addCell(cell){
        this.cells.push(cell)
    }

    mergeRange(range){
        this.cells.push(...range.cells)
    }

    canAddHorizontal(cell){
        // requirement: same height, width is 1 off
        if (this.cells.length == 0) return true
        if (cell.row < this.startRow || cell.row > this.endRow) return
        if ((cell.col != this.startCol - 1) || 
            (cell.col != this.endCol + 1))
            return false
        return true
    }

    canMerge(range){
        // requirement: same width, height is 1 off
        return ((range.startCol == this.startCol && 
                range.endCol == this.endCol)     &&
                (range.startRow == this.startRow - 1 || 
                range.endRow == this.endRow + 1))
    }

    // merges if possible, returns true or false depending on if it merged or not
    merge(range){
        if (this.canMerge(range)){
            this.mergeRange(range)
            return true
        }
        return false
    }
}