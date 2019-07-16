export interface DebstFilter {
    pageNumber : number;
    columnName : string;
    asc : boolean;
    inputSearch  : String;
    service: String  ;
    status: String;
    dateForFilter: String;
    dateFrom?: Date;
    dateTo?: Date;
}
