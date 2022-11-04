import { GExecutions } from "./GExecutions"
import { GSpreadsheet } from "./GSpreadsheet"

export class GAPI{
    constructor(spreadsheetid,deploymentid,indices = [],onload,params){
        this.spreadsheetid = spreadsheetid
        this.deploymentid = deploymentid
        this.spreadsheet = new GSpreadsheet(spreadsheetid)
        if (onload)
            this.refresh(indices,onload,params)
        this.execURL = "https://script.google.com/macros/s/" + deploymentid + "/exec";
        this.executions = new GExecutions()
        this.history = []
    }

    //runs the curent pending execution
    execute(callback,params){
        if (!this.executions) throw new Error("No execution has been created")
        this.executions.execute(callback,params)
        this.history.push(this.executions)
        this.executions = new GExecutions()
    }

    //adds cell to queue to be synced
    prepare(tablename,cell){
        this.executions.addCell(tablename,cell)
    }

    // refetches new tables
    reload(callback,params){
		this.spreadsheet.load([],callback,params)
    }
	
    // refreshes all existing tables
	refresh(table,callback,params){
        table = table ? [this.spreadsheet.getSheetByName(table)] : this.spreadsheet.sheets
		GSpreadsheet.refresh(table,callback,params)
	}

    // runs a given string function and paramaters to the current spreadsheet
    run(func,params,callback,callbackParams = []) { // saves the data back to sheet
		jQuery.ajax({
            type:"POST",
            url: this.execURL,
            data: {
                spreadsheetid:this.spreadsheetid,
                func:func,
                params:JSON.stringify(params)
            },
            dataType: "jsonp", // using jsonp to overcome the Same Origin Policy
            jsonp: "callback",
        }).always(function(jqXHR, textStatus){
			if (typeof callback !== "undefined")
				callback(...callbackParams,textStatus)
		});
    }
}