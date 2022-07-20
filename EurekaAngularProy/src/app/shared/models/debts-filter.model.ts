export interface DebstFilter {
  pageNumber: number;
  columnName: string;
  asc: boolean;
  inputSearch: string;
  service: string;
  status: string;
  dateForFilter: string;
  dateFrom?: Date;
  dateTo?: Date;
}
