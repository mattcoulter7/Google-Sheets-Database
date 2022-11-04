/*************************************\
 * Executions are utilised to store cells and scripts that will all be run on 'execute()'
 * Use 'addCell()' and 'addScript()' to add cells and scripts to the execution respecitvely
 * Execution runs one script at a time
\*************************************/

import { GCellRange } from "./GCellRange"

export class GExecution {
    constructor(sheetname) {
        this.cellQueue = [] // higher index is newer
        this.scriptQueue = []
        this.sheetname = sheetname
    }

    // Removes duplicate cells values as does not need to set multiple times
    get filtered() { // removes duplicate
        return this.cellQueue.reverse().filter((cell, index, self) =>
            index === self.findIndex((t) => (
                t.row == cell.row && t.col == cell.col
            ))
        )
    }

    // gets rows of adjacent cells
    get ranges(){
        return [].concat.apply([],this.filtered.sort((a,b) => a.row - b.row)
        .reduce(function(prev,curr,index,self){ // break cells down into groups of rows
            prev[prev.length - 1].push(curr)
            if (((self[index + 1] || {}).row - curr.row) > 0)
                prev.push([])
            return prev
        },[[]])
        .map(arr => arr.reduce(function(prev,curr,index,self){ // break cells down into groups of rows of adjacent columns
            prev[prev.length - 1].push(curr)
            if (((self[index + 1] || {}).col - curr.col) > 1)
                prev.push([])
            return prev
        },[[]]))
        .map(row => row.map(rowGroup => new GCellRange(rowGroup))))
    }

    // combines horizontal cell ranges where possible to reduce the number of calls
    get reduced(){
        return this.ranges
        .reduce((prev,curr) => prev.concat(prev.find(range => range.merge(curr)) ? [] : curr),[])
    }

    // returns array of all cell scripts and manual scripts
    get scripts() {
        return this.reduced.map(ra => ra.script(this.sheetname))
            .concat(this.scriptQueue)
    }

    addCell(cell) { //cell can be array of cells
        if (Array.isArray(cell))
            this.cellQueue.push(...cell)
        else
            this.cellQueue.push(cell)
    }

    addScript(func, params) {
        this.scriptQueue.push({
            func: func,
            params: params
        })
    }

    execute(callback,params = []){
        this.scripts.forEach(function(s,i,self){
            if (i == self.length - 1)
                return Query.run(s.func, s.params,callback,params)
            return Query.run(s.func, s.params)
        })
    }

    /* 
    //step by step not required
    execute(callback, params) {
        var scripts = this.scripts
        var thisFunc = scripts[0]
        var remaining = scripts.splice(1)
        GExecution.executeScript(thisFunc, remaining, callback, params)
    }
    static executeScript(script, remaining, callback, params) {
        
        if (remaining.length > 0) {
            var callbackParams = remaining.length > 0 ? [remaining[0], remaining.splice(1), callback, params] : []
            return Query.run(script.func, script.params, GExecution.executeScript, callbackParams)
        }
        else {
            return Query.run(script.func, script.params, callback, params)
        }
    }
    */
}