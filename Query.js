import { GAPI } from "./GAPI"

export class Query{
  API = null
  static connect(gapi){
    Query.API = gapi
  }

  static validate(){
    if (!Query.API) throw new Error("No data has been loaded")
  }
  
  static select(table, columns, where)
  {
    Query.validate()
    return Query.API.spreadsheet.select(table,columns, where)
  }
  
  static selectId(table, id, idCol = "id")
  {
    Query.validate()
    return Query.API.spreadsheet.selectId(table, id, idCol)
  }
  
  static updateId(table, id, col, value, idCol = "id")
  {
    Query.validate()
    return Query.API.spreadsheet.updateId(table,id, col, value, idCol)
  }
  
  static insert(table, values, idCol = "id")
  {
    Query.validate()
    return Query.API.spreadsheet.insert(table,values, idCol)
  }
  
  static deleteId(table, id, idCol = "id")
  {
    Query.validate()
    return Query.API.spreadsheet.deleteId(table,id, idCol)
  }

  static refresh(tables,callback,params){
	  Query.validate()
	  return Query.API.refresh(tables,callback,params)
  }
  
  static reload(callback,params = []){
	  Query.validate()
	  return Query.API.reload(callback,params)
  }

  static run(gscript,params,callback,callbackParams){
	  Query.validate()
	  return Query.API.run(gscript,params,callback,callbackParams)
  }

  static options(table,where,nameKey = 'name'){
    Query.validate()
    return Query.select(table,"id;name;",where).reduce((prev,curr) => ({
      ...prev,
      [curr.id]:curr[nameKey]
    }),{})
  }
}