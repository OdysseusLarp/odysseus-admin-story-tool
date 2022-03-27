import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

import './Ship.css';

const getShip = async (id) => {
    const response = await fetch(`http://localhost:8888/fleet/${id}`);
    const ship = await response.json();
    return ship;
  }

export default function Ship() {
  const [ship, setShip] = React.useState(null);
  const params = useParams();

  React.useEffect(() => {
    if (!params.id) return;

    getShip(params.id).then((s) => setShip(s));
  }, [params.id, setShip]);

  const renderShip = () => {
    if (!ship) return null;
    return (
      <div className='fleet'>
        <Container fluid className='ship'>
          <Row>
            <Col sm><span className='mini-header'>Basic Info</span></Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Name: </span>{ship.name}</Col>
            <Col sm={8}><span className='caption'>ID: </span>{ship.id}</Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Class: </span>{ship.class}</Col>
            <Col sm={8}><span className='caption'>Type: </span>{ship.type}</Col>
            
          </Row>
          <Row>
            <Col sm><span className='caption'>Description: </span>{ship.description}</Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Current Status</span></Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Person Count: </span>{ship.person_count}</Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Status: </span>{ship.status}</Col>
            <Col sm={8}><span className='caption'>Position: </span>{ship.position.name}</Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Arsenal</span></Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Fighter Count: </span>{ship.fighter_count}</Col>
            <Col sm={8}><span className='caption'>Transporter Count: </span>{ship.transporter_count}</Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Metadata</span></Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Is Visible: </span>{ship.is_visible ? "Yes" : "No"}</Col>
          </Row>
          <Row>
            {ship.metadata?.scan_range && <Col sm={4}><span className='caption'>Scan Range: </span>{ship.metadata?.scan_range}</Col>}
            {ship.metadata?.probe_count && <Col sm={8}><span className='caption'>Probe Count: </span>{ship.metadata?.probe_count}</Col>}
          </Row>
          <Row>
            {ship.metadata?.jump_range && <Col sm={4}><span className='caption'>Jump Range: </span>{ship.metadata?.jump_range}</Col>}
            {ship.metadata?.jump_crystal_count && <Col sm={8}><span className='caption'>Jump Crystal Count: </span>{ship.metadata?.jump_crystal_count}</Col>}
          </Row>
          <Row>
            {ship.metadata?.object_scan_duration.min_seconds && <Col sm={4}><span className='caption'>Object Scan Duration Min: </span>{ship.metadata?.object_scan_duration.min_seconds}s</Col>}
            {ship.metadata?.grid_scan_duration.min_seconds && <Col sm={8}><span className='caption'>Grid Scan Duration Min: </span>{ship.metadata?.grid_scan_duration.min_seconds}s</Col>}
          </Row>
          <Row>
            {ship.metadata?.object_scan_duration.max_seconds && <Col sm={4}><span className='caption'>Object Scan Duration Max: </span>{ship.metadata?.object_scan_duration.max_seconds}s</Col>}
            {ship.metadata?.grid_scan_duration.max_seconds && <Col sm={8}><span className='caption'>Grid Scan Duration Max: </span>{ship.metadata?.grid_scan_duration.max_seconds}s</Col>}
          </Row>
        </Container>
      </div>
    )
  }

  return (
    <div>
      <h1 className='fleet'>{ship?.name}</h1>
      {renderShip()}
    </div>
  );
}
