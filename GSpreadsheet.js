import { GSheet } from "./GSheet"

export class GSpreadsheet {
    constructor(id,indices = [])
    {
        this.id = id
    }

    get sheetNames(){
        return this.sheets.map(sh => sh.title)
    }

    getSheetByName(name){
        var sheet = this.sheets.filter(sh => sh.title.toLowerCase() == name.toLowerCase())[0]
        if (!sheet) throw new Error("sheet " + name + " does not exist in spreadsheet " + this.id)
        return sheet
    }

    getSheetByIndex(index){
        return this.sheets[index]
    }

    select(sheetname,columns,where)
    {
        if (sheetname)
        {
            var sheet = this.getSheetByName(sheetname)
            return sheet.select(columns,where)
        }
        else
        {
            var result = {}
            for (var i = 0; i < this.sheets.length; i++)
            {
                var sheet = this.sheets[i]
                result[sheet.title] = sheet.select(columns,where)
            }
            return result
        }
    }

    selectId(sheetname,id,idCol = "id")
    {
        var sheet = this.getSheetByName(sheetname)
        return sheet.selectId(id,idCol)
    }

    updateId(sheetname,id,col,value,idCol = "id")
    {
        var sheet = this.getSheetByName(sheetname)
        return sheet.updateId(id,col,value,idCol)
    }

    insert(sheetname,values,idCol = "id")
    {
        var sheet = this.getSheetByName(sheetname)
        return sheet.insert(values,idCol)
    }

    deleteId(sheetname,id,idCol = "id")
    {
        var sheet = this.getSheetByName(sheetname)
        return sheet.deleteId(id,idCol)
    }

    static initSheets(id,indices,sheets = [],callback,params){
		var index = indices[0]
		if (typeof index === "undefined") return;
		var remainingIndices = indices.splice(1)
        new GSheet(id,index,GSpreadsheet.onSheetLoad,[id,remainingIndices,sheets,callback,params])
    }

    static onSheetLoad(id,remainingIndices,sheets = [],callback,params,sheet,status){
        if (status !== "error")
        {
            sheets.push(sheet)

            if (remainingIndices.length > 0) { // only continues to load more sheets on a success
                GSpreadsheet.initSheets(id,remainingIndices,sheets,callback,params)
            }
        }
        else
        {
            if (typeof callback !== "undefined")
                callback(...params)
        }
    }

    load(indices = [],callback,params = []){
        indices = indices.length == 0 ? ascendingArray(1,200) : indices
        this.sheets = []
        GSpreadsheet.initSheets(this.id,indices,this.sheets,callback,params)
    }

    static refresh(sheets = [],callback,params = []){
		var thisSheet = sheets[0]
		if (!thisSheet) return;
		var remainingSheets = sheets.filter((sh,i) => i !== 0)
		if (remainingSheets.length > 0)
			return thisSheet.reload(GSpreadsheet.refresh,[remainingSheets,callback,params])
        return thisSheet.reload(callback,params)
    }
}

function ascendingArray(start,end)
{
    return Object.keys(new Array(end + 1).fill(null)).filter(a => a >= start).map(a => parseInt(a))
}