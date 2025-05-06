export interface AdminBulkDatatable {
  limit: number;
  page: number;
  order: "ASC" | "DESC";
  orderBy: string;
  query: string;
}
