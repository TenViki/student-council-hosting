"use client";

import { MantineColor } from "@mantine/core";
import React, { useEffect } from "react";

import { AdminBulkDatatable } from "@/lib/def/admin";
import useSearchParamsState from "@/hooks/useSearchParams";
import { useQuery } from "@tanstack/react-query";
import {
  DataTable,
  DataTableColumn,
  DataTableSortStatus,
  differenceBy,
  uniqBy,
} from "mantine-datatable";

interface DatatableWrapperProps<T> {
  columns: DataTableColumn<T>[];
  queryKey?: string;
  additionalQueryKeys?: string[];
  action: (params: AdminBulkDatatable) => Promise<{ data: T[]; count: number }>;
  defaultOrderBy: string;
  // contextMenu?: DataTableContextMenuProps<T>;
  query?: {
    [key: string]: string | boolean | number | undefined;
  };
  color?: MantineColor;
  onDataUpdate?: (data: T[]) => void;
  defaultOrder?: "asc" | "desc";
  selectedRecords?: T[];
  onSelectionChange?: (records: T[]) => void;
  setSelectedRecords?: (records: T[]) => void;
  setUnselectedRecords?: (records: T[]) => void;
  setAllSelected?: (value: boolean) => void;
  setCount?: (count: number) => void;
  deselectFnRef?: React.RefObject<(() => void) | undefined>;
  // exportData?: (params: AdminBulkDatatable) => Promise<Buffer>;
  // exportSignal?: any;
  updateParams?: (params: AdminBulkDatatable) => void;
  idAccessor?: string;
}

const PAGE_SIZES = [10, 20, 50, 100];

const DatatableWrapper = <T,>({
  columns,
  action,
  defaultOrderBy,
  // contextMenu,
  query,
  additionalQueryKeys = [],
  color,
  queryKey,
  onDataUpdate,
  defaultOrder,
  selectedRecords,
  onSelectionChange,
  setSelectedRecords,
  setUnselectedRecords: _setUnselectedRecords,
  setAllSelected,
  setCount,
  deselectFnRef,
  idAccessor,
  // exportData,
  // exportSignal,
  updateParams,
}: DatatableWrapperProps<T>) => {
  const [pageSize, setPageSize] = useSearchParamsState("ps", 10);
  const [page, setPage] = useSearchParamsState("p", 1);
  const [sortStatus, setSortStatus] = useSearchParamsState<
    DataTableSortStatus<T>
  >("sort", {
    columnAccessor: defaultOrderBy,
    direction: defaultOrder || "desc",
  });

  const [unselectedRecords, setUnselectedRecords] = React.useState<T[]>([]);
  const [allRecordsSelected, setAllRecordsSelected] = React.useState(false);

  const dataQuery = useQuery({
    queryKey: [
      queryKey,
      page,
      pageSize,
      sortStatus.columnAccessor,
      sortStatus.direction,
      query,
      ...additionalQueryKeys,
    ],
    queryFn: () =>
      action({
        limit: pageSize,
        page,
        order: sortStatus.direction.toLocaleUpperCase() as "ASC" | "DESC",
        orderBy: sortStatus.columnAccessor.toString(),
        query: JSON.stringify(query),
      }),
  });

  React.useEffect(() => {
    if (!dataQuery.data) return;

    if (onDataUpdate) {
      onDataUpdate(dataQuery.data.data);
    }
  }, [dataQuery.data]);

  React.useEffect(() => {
    if (!deselectFnRef) return;
    deselectFnRef.current = () => {
      setAllRecordsSelected(false);
      setSelectedRecords?.([]);
      setUnselectedRecords([]);
      _setUnselectedRecords?.([]);
      setAllSelected?.(false);
    };
  }, [
    deselectFnRef,
    _setUnselectedRecords,
    setAllSelected,
    setSelectedRecords,
  ]);

  const handleAllRecordsSelectionCheckboxChange = () => {
    if (allRecordsSelected) {
      setAllRecordsSelected(false);
      setSelectedRecords?.([]);
      setUnselectedRecords([]);

      _setUnselectedRecords?.([]);
      setAllSelected?.(false);
    } else {
      setAllRecordsSelected(true);
      setAllSelected?.(true);
    }
  };

  const handleSelectedRecordsChange = (newSelectedRecords: T[]) => {
    let records = dataQuery.data?.data || [];

    if (allRecordsSelected) {
      const recordsToUnselect = records.filter(
        (record) => !newSelectedRecords.includes(record)
      );
      setUnselectedRecords(
        // 👇 `uniqBy` is a utility function provided by Mantine DataTable
        uniqBy(
          [...unselectedRecords, ...recordsToUnselect],
          (r: any) => r.id
        ).filter((r) => !newSelectedRecords.includes(r))
      );

      _setUnselectedRecords?.(
        // 👇 `uniqBy` is a utility function provided by Mantine DataTable
        uniqBy(
          [...unselectedRecords, ...recordsToUnselect],
          (r: any) => r.id
        ).filter((r) => !newSelectedRecords.includes(r))
      );
    } else {
      setSelectedRecords?.(newSelectedRecords);
    }
  };

  useEffect(() => {
    let records = dataQuery.data?.data || [];
    if (allRecordsSelected) {
      const newSelectedRecords = differenceBy(
        records,
        unselectedRecords,
        (r: any) => r.id
      );

      setSelectedRecords?.(
        // 👇 `differenceBy` is a utility function provided by Mantine DataTable
        newSelectedRecords
      );
    }
  }, [allRecordsSelected, dataQuery.data, unselectedRecords]);

  // export logic

  useEffect(() => {
    console.log("Updating params...", {
      limit: pageSize,
      page,
      order: sortStatus.direction.toLocaleUpperCase() as "ASC" | "DESC",
      orderBy: sortStatus.columnAccessor.toString(),
      query: JSON.stringify(query),
    });

    updateParams?.({
      limit: pageSize,
      page,
      order: sortStatus.direction.toLocaleUpperCase() as "ASC" | "DESC",
      orderBy: sortStatus.columnAccessor.toString(),
      query: JSON.stringify(query),
    });
  }, [
    pageSize,
    page,
    sortStatus.direction,
    sortStatus.columnAccessor,
    JSON.stringify(query),
  ]);

  return (
    <DataTable
      withTableBorder
      height={300}
      borderRadius="sm"
      style={{
        flexGrow: 1,
        flexShrink: 1,
      }}
      columns={columns}
      scrollAreaProps={{ type: "never" }}
      records={dataQuery.data?.data}
      noRecordsText="No data"
      allRecordsSelectionCheckboxProps={{
        indeterminate:
          (selectedRecords?.length && !allRecordsSelected) ||
          unselectedRecords.length > 0,
        checked: allRecordsSelected,
        onChange: handleAllRecordsSelectionCheckboxChange,
        title: allRecordsSelected
          ? "Remove selection"
          : `Select all ${dataQuery.data?.count} records`,
      }}
      selectedRecords={selectedRecords ? selectedRecords : undefined}
      onSelectedRecordsChange={
        onSelectionChange ? handleSelectedRecordsChange : undefined
      }
      page={page}
      striped
      highlightOnHover
      fetching={dataQuery.isLoading}
      totalRecords={dataQuery.data?.count}
      recordsPerPage={pageSize}
      onPageChange={(p) => setPage(p)}
      recordsPerPageOptions={PAGE_SIZES}
      onRecordsPerPageChange={setPageSize}
      // sortStatus={sortStatus}
      // onSortStatusChange={setSortStatus}
      // rowContextMenu={contextMenu}
      loaderColor={color}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      idAccessor={idAccessor}
    />
  );
};

export default DatatableWrapper;
