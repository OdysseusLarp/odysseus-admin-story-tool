import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter, Comparator } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Link } from "react-router-dom";
import { apiGetRequest } from "../api";
import { toSelectOptions } from "../utils/helpers";
import TableLoading from "./TableLoading";
import useSWR from "swr";

import './Messages.css';
import useTableState from "../hooks/TableState";

export default function Messages(props) {
  const { page, sizePerPage, setPageAndSize, afterFilter, getDefaultFilterValue } = useTableState();

  const { data: messages, error, isLoading } = useSWR(
    "/story/messages",
    apiGetRequest
  );

  if (isLoading) return <TableLoading />;
  if (error) return <div>Failed to load data</div>;

  const sentSelectOptions = toSelectOptions(messages, 'sent');
  const typeSelectOptions = toSelectOptions(messages, 'type');

  const defaultSorted = [{
    dataField: 'id',
    order: 'asc'
  }];

  const columns = [{
    dataField: 'id',
    text: 'Id',
    sort: true,
    headerStyle: () => { return { width: '50px', textAlign: 'center' } },
    align: 'center'
  }, {
    dataField: 'name',
    text: 'Name',
    sort: true,
    filter: textFilter({ defaultValue: getDefaultFilterValue('name') }),
    headerStyle: () => { return { width: '30%', textAlign: 'left' } },
    formatter: (cell, row) => { return <Link to={`/messages/${row.id}`}>{cell}</Link> }
  }, {
    dataField: 'after_jump',
    text: 'After Jump',
    sort: true,
    filter: textFilter({ comparator: Comparator.EQ, defaultValue: getDefaultFilterValue('after_jump') }),
    headerStyle: () => { return { width: '7%', textAlign: 'left' } },
    sortFunc: (a, b, order, dataField, rowA, rowB) => {
      const aValue = a === "" ? 100 : a;
      const bValue = b === "" ? 100 : b;
      if (order === 'asc') {
        return bValue - aValue;
      }
      return aValue - bValue;
    }
  }, {
    dataField: 'sender.name',
    text: 'Sender',
    sort: true,
    filter: textFilter({ defaultValue: getDefaultFilterValue('sender.name') }),
    formatter: (cell, row) => {
      return <span className='characters'>
        <Link to={`/characters/${row.sender_person_id}`} onClick={() => props.changeTab('Characters')}>{cell}</Link>
      </span>
    }
  }, {
    dataField: 'receivers',
    text: 'Receiver(s)',
    sort: true,
    filter: textFilter({
      defaultValue: getDefaultFilterValue('receivers'),
      onFilter: (filterValue, cell) => {
        if (!filterValue) return cell;
        const filtered = cell.filter((row) => {
          if (row.receivers.length === 0) {
            return false;
          }
          const hasValue = row.receivers.map(receiver => receiver.name.toLowerCase()).toString().includes(filterValue.toLowerCase());
          return hasValue;
        });
        return filtered;
      }
    }),
    formatter: (cell, row) => {
      return cell.map(person => <div key={person.id}>
        <span className='characters'>
          <Link onClick={() => props.changeTab('Characters')} to={`/characters/${person.id}`}>{person.name}</Link>
        </span>
        <br />
      </div>)
    }
  }, {
    dataField: 'type',
    text: 'Type',
    sort: true,
    filter: selectFilter({ options: typeSelectOptions, defaultValue: getDefaultFilterValue('type') }),
  }, {
    dataField: 'sent',
    text: 'Sent',
    sort: true,
    filter: selectFilter({ options: sentSelectOptions, defaultValue: getDefaultFilterValue('sent') }),
  }];

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      Showing {from} to {to} of {size} Results
    </span>
  );

  const options = {
    page: page,
    sizePerPage: sizePerPage,
    paginationSize: 4,
    pageStartIndex: 1,
    alwaysShowAllBtns: true, // Always show next and previous button
    firstPageText: 'First',
    prePageText: 'Back',
    nextPageText: 'Next',
    lastPageText: 'Last',
    nextPageTitle: 'First page',
    prePageTitle: 'Pre page',
    firstPageTitle: 'Next page',
    lastPageTitle: 'Last page',
    showTotal: true,
    paginationTotalRenderer: customTotal,
    onPageChange: (page, sizePerPage) => {
      setPageAndSize(page, sizePerPage);
    },
    onSizePerPageChange: (sizePerPage, page) => {
      setPageAndSize(page, sizePerPage);
    },
    disablePageTitle: true,
    sizePerPageList: [{
      text: '10', value: 10
    }, {
      text: '15', value: 15
    }, {
      text: '20', value: 20
    }, {
      text: '25', value: 25
    }, {
      text: '50', value: 50
    }, {
      text: 'All', value: messages.length
    }] // A numeric array is also available. the purpose of above example is custom the text
  };

  return (
    <div className='messages'>
      <BootstrapTable
        bootstrap4
        striped
        hover
        keyField="id"
        bordered={false}
        data={messages}
        columns={columns}
        filter={filterFactory({ afterFilter })}
        pagination={paginationFactory(options)}
        defaultSorted={defaultSorted}
      />
    </div>
  )
}