import { Container, Row, Col } from "react-bootstrap";
import './Plots.css';
import './Plot.css';

export default function Plots() {
    return (
      <div>
        <h1 className='plot' id="app-title">Plot Name</h1>
        <div className='plot'>
          <Container fluid className='plot'>
            <Row>
              <Col sm><span className='mini-header'>Characters Involved</span></Col>
            </Row>
            {<span><ul><li>Name Surname (Main character, Character)</li><li>Name Surname2 (Side character, NPC)</li><li>Name Surname2 (Knows random info, Character)</li></ul></span>}
            <Row>
              <Col sm><span className='mini-header'>Character Groups Involved</span></Col>
            </Row>
            {<span><ul><li>Engineers</li><li>Scientists</li><li>All</li></ul></span>}
            <Row>
              <Col sm><span className='mini-header'>Basic Info</span></Col>
            </Row>
            <Row>
              <Col sm={6}><span className='caption'>GM Actions: </span>No need / Text NPC / Event / Briefing Character</Col>
              <Col sm={4}><span className='caption'>Plot size: </span>Small / Medium / Large</Col>
            </Row>
            <Row>
              <Col sm={6}><span className='caption'>Text NPC should send first message: </span>Yes / No</Col>
              <Col sm={4}><span className='caption'>Plot themes: </span>Love / Beatrayal / Political / Machine</Col>
            </Row>
            <Row>
              <Col sm={6}><span className='caption'>Happens after jump: </span>- / 3 / 13</Col>
              <Col sm={4}><span className='caption'>Info3: </span>Lorem Ipsum</Col>
            </Row>
            <Row>
              <Col sm>&nbsp;</Col>
            </Row>
            <Row>
              <Col sm><span className='mini-header'>Links to Events</span></Col>
            </Row>
            {<span><ul><li>Not part of an event</li><li>Link to event</li></ul></span>}
            <Row>
              <Col sm><span className='mini-header'>Short Description</span></Col>
            </Row>
            <Row>
              <Col sm><span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span></Col>
            </Row>
            <Row>
              <Col sm>&nbsp;</Col>
            </Row>
            <Row>
              <Col sm><span className='mini-header'>GM Notes</span></Col>
            </Row>
            <Row>
              <Col sm><span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span></Col>
            </Row>
            <Row>
              <Col sm>&nbsp;</Col>
            </Row>
            <Row>
              <Col sm><span className='mini-header'>Copied from characters</span></Col>
            </Row>
            <Row>
              <Col sm><span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span></Col>
            </Row>
            <Row>
              <Col sm><span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span></Col>
            </Row>
            <Row>
              <Col sm>&nbsp;</Col>
            </Row>
          </Container>
        </div>
      </div>
    )
  }