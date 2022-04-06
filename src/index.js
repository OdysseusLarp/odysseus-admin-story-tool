import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
require('bootstrap');
require('react-bootstrap-table-next/dist/react-bootstrap-table2.min.css');
require('react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css');
require('react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css');

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
