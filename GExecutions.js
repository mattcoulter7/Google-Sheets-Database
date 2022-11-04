/*************************************\
 * Executions are utilised to store cells and scripts that will all be run on 'execute()'
 * Use 'addCell()' and 'addScript()' to add cells and scripts to the execution respecitvely
 * Execution runs one script at a time
\*************************************/

import { GExecution } from "./GExecution"

export class GExecutions {
    constructor() {
        this.executions = []
    }

    addExecution(tablename){
        var execution = new GExecution(tablename)
        this.executions.push(execution)
        return execution
    }

    getExecutionForTable(tablename){
        var execution = this.executions.filter(e => e.sheetname == tablename)[0]
        if (!execution)
            execution = this.addExecution(tablename)
        return execution
    }

    addCell(tablename,cell){
        this.getExecutionForTable(tablename).addCell(cell)
    }

    execute(callback,params = []){
        this.executions.forEach(function(e,i,self){
            if (i == self.length - 1){
                e.execute(callback,params)
            } else {
                e.execute()
            }
        })
    }
}