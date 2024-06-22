import { useSearchParams, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

const useTableState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { hash } = useLocation();

  let decodedHash = {};
  if (hash) {
    try {
      decodedHash = JSON.parse(window.atob(hash.slice(1)));
    } catch (e) {
      console.error("Failed to decode hash", e);
    }
  }

  const initialState = {
    page: parseInt(searchParams.get('page'), 10) || 1,
    sizePerPage: parseInt(searchParams.get('pageSize'), 10) || 15,
  };

  const [tableState, setTableState] = useState(initialState);

  useEffect(() => {
    const pageParam = parseInt(searchParams.get('page'), 10) || 1;
    const sizeParam = parseInt(searchParams.get('pageSize'), 10) || 15;

    if (tableState.page !== pageParam || tableState.sizePerPage !== sizeParam) {
      setTableState({ page: pageParam, sizePerPage: sizeParam });
    }
  }, [searchParams, tableState.page, tableState.sizePerPage]);

  const setHash = (newHash) => {
    if (window.location.hash !== `#${newHash}`) {
      window.location.hash = newHash;
    }
  };

  const setPageAndSize = useCallback(
    (newPage, newSizePerPage) => {
      setSearchParams({ page: String(newPage), pageSize: String(newSizePerPage) });
      setTableState({ page: newPage, sizePerPage: newSizePerPage });
    },
    [setSearchParams]
  );

  const afterFilter = (filteredResults, appliedFilters) => {
    const formattedFilters = {};
    Object.entries(appliedFilters).forEach(([key, value]) => {
      formattedFilters[key] = value.filterVal;
    });

    const filtersHash = window.btoa(JSON.stringify(formattedFilters));
    if (window.location.hash !== `#${filtersHash}`) {
      setHash(filtersHash);
    }
  };

  const getDefaultFilterValue = (key) => {
    return decodedHash[key];
  };

  return {
    page: tableState.page,
    sizePerPage: tableState.sizePerPage,
    setPageAndSize,
    afterFilter,
    getDefaultFilterValue,
    decodedHash,
  };
};

export default useTableState;
