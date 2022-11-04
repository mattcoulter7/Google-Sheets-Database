export class GCell{
    constructor (data){
        this.data = data
    }

    get row(){
        return parseInt(this.data.gs$cell.row)
    }

    get col(){
        return parseInt(this.data.gs$cell.col)
    }

    get value(){
        return this.data.gs$cell.$t
    }

    get exists(){
        return true
    }

    set value(val){
        this.data.gs$cell.$t = val
    }

    set row(row)
    {
        this.data.gs$cell.row = String(row)
    }

    set col(col){
        this.data.gs$cell.col = String(col)
    }

    shift(dir,count){
        var dirs = {
            "up": -1,
            "down": 1,
            "left":-1,
            "right":1
        }
        if (["right","left"].includes(dir)) {// horizontal
            var newCol = this.col + dirs[dir] * count
            this.col = newCol
        }
        else if(["up","down"].includes(dir)) {// vertical
            var newRow = this.row + dirs[dir] * count
            this.row = newRow
        }
    }

    get clone(){
        return GCell.create(this.url,this.row,this.col,this.value)
    }

    get blankClone(){
        return GCell.create(this.url,this.row,this.col,"")
    }

    static create(url,row,col,value){
        var id = url + "R" + row + "C" + col
        return new GCell({
            category:[
                {
                    scheme: "http://schemas.google.com/spreadsheets/2006",
                    term: "http://schemas.google.com/spreadsheets/2006#cell"
                }
            ],
            content:{
                type:"text",
                $t:value
            },
            gs$cell: {
                row: String(row), 
                col: String(col), 
                inputValue: value, $t: value
            },
            id: {
                $t: id
            },
            link: [
                {
                    href: id,
                    rel: "self",
                    type: "application/atom+xml"
                }
            ],
            title: {
                $t: Format.cell(row,col),
                type: "text"
            },
            updated: {
                $t: new Date().toJSON()
            }
        })
    }
}