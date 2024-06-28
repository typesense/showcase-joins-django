/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ReactTable from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends ReactTable.RowData, TValue> {
    className?: string;
  }
}
