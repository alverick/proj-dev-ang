export interface GtpFilter {
  pageNumber: number;
  ColumnName: string;
  asc: boolean;
  inputSearch: string;
  BusinessHeading: string;
  status: string;
  statusSolicitud: string;
  dateFrom?: Date;
  dateTo?: Date;
}
