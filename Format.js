export function Format(){}
Format.columns = function(columns,cols = "*")
{
    if (cols == "*") cols = columns
    else cols = cols.split(";").filter(col => col != "")
    var result = {}
    cols = cols.filter(col => columns.includes(col))
    cols.forEach(col => result[columns.indexOf(col) + 1] = col)
    return result
}

Format.cell = function(row,col)
{
    var alphabet = ['','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    return alphabet[col] + String(row)
}

