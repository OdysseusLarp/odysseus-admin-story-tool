import Spinner from 'react-bootstrap/Spinner';

const TableLoading = () => (
  <div style={{ width: '100%', display: "flex", alignItems: "center", justifyContent: "center", height: "20vh"}}>
  <Spinner animation="border" role="status">
    <span className="visually-hidden">Loading...</span>
  </Spinner>
  </div>
);

export default TableLoading;
