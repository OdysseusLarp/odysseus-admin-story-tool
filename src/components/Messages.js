import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter, Comparator } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Link } from "react-router-dom";
import { apiGetRequest } from "../api";
import useSWR from "swr";

import './Messages.css';

export default function Messages(props) {
  const [page, setPage] = React.useState(1);
  const [sizePerPage, setSizePerPage] = React.useState(15);

  const { data: messages, error, isLoading } = useSWR(
    "/story/messages",
    apiGetRequest
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load data</div>;

  function getRowIndex(cell, row, rowIndex) {
    return (page-1) * sizePerPage + rowIndex + 1;
  }
  
  const sentSelectOptions = {
    "Yes": 'Yes',
    "No need": 'No Need',
    "Repeatable": 'Repeatable',
    "Not yet": 'Not yet'
  };

  const typeSelectOptions = {
    "Text NPC": 'Text NPC',
    "EVA": 'EVA',
    "Fleet Comms": 'Fleet Comms',
    "Fleet Secretary": 'Fleet Secretary',
    "Fleet Admiral": 'Fleet Admiral',
    "Ship Log - Success": 'Ship Log - Success',
    "Ship Log - Info": 'Ship Log - Info',
    "Ship Log - Warning": 'Ship Log - Warning',
    "Ship Log - Error": 'Ship Log - Error',
    "News": 'News',
    "Gray Radio": 'Gray Radio',
  };

  const columns = [{
      dataField: '_row_index_placeholder',
      text: 'Row',
      formatter: getRowIndex,
      headerStyle: () => {
        return { width: '50px', textAlign: 'center' };
      },
      align: 'center'
    }, {
      dataField: 'name',
      text: 'Name',
      sort: true,
      filter: textFilter(),
      headerStyle: () => {
        return { width: '30%', textAlign: 'left' };
      },
      formatter: (cell, row) => {
        return <Link to={`/messages/${row.id}`}>{cell}</Link>
      }
    }, {
      dataField: 'sender.name',
      text: 'Sender',
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => {
        return <span className='characters'><Link to={`/characters/${row.sender_person_id}` } onClick={() => props.changeTab('Characters')}>{cell}</Link></span>
      }
    }, {
      dataField: 'receivers',
      text: 'Receiver(s)',
      sort: true,
      filter: textFilter({
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
        return cell.map(person => <div key={person.id}><span className='characters'><Link onClick={() => props.changeTab('Characters')} to={`/characters/${person.id}`}>{person.name}</Link></span><br/></div>)
      }
    }, {
      dataField: 'type',
      text: 'Type',
      sort: true,
      filter: selectFilter({
        options: typeSelectOptions
      }),
    }, {
      dataField: 'after_jump',
      text: 'After Jump',
      sort: true,
      filter: textFilter({comparator: Comparator.EQ}),
      headerStyle: () => {
        return { width: '10%', textAlign: 'left' };
      },
      sortFunc: (a, b, order, dataField, rowA, rowB) => {
        const aValue = a === "" ? -1 : a;
        const bValue = b === "" ? -1 : b;
        if (order === 'asc') {
          return bValue - aValue;
        }
        return aValue - bValue;
      }
    }, {
      dataField: 'sent',
      text: 'Sent',
      sort: true,
      filter: selectFilter({
        options: sentSelectOptions
      }),
  }];

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      Showing { from } to { to } of { size } Results
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
      setPage(page); 
      setSizePerPage(sizePerPage);
    },
    onSizePerPageChange: (sizePerPage, page) => { 
      setPage(page); 
      setSizePerPage(sizePerPage);
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
        bordered={ false }
        data={ messages }
        columns={ columns }
        filter={ filterFactory() }
        pagination={ paginationFactory(options) }
      />
    </div>
  )
}