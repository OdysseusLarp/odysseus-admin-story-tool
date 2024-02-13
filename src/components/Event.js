import { Container, Row, Col } from "react-bootstrap";
import './Events.css';
import './Event.css';

//TODO: Add datafetch etc. Copy from for example Character.js or Artifact.js

export default function Event() {
    return (
      <div>
        <h1 className='event' id="app-title">Event Name [CREATE EVENT BUTTON]</h1>
        <div className='event'>
          <Container fluid className='event'>
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
              <Col sm={4}><span className='caption'>GM Actions: </span>No need / Empty Epsilon / Text NPC / Briefing character</Col>
              <Col sm={6}><span className='caption'>Event size: </span>Small / Medium / Large</Col>
            </Row>
            <Row>
              <Col sm={4}><span className='caption'>Happens after jump: </span>- / 3 / 13 (Editable unless event is locked or status done)</Col>
              <Col sm={6}><span className='caption'>Event type: </span>Jump / Land Mission / Empty Epsilon / Political / Machine / Hazard / Bomb / Character</Col>
            </Row>
            <Row>
              <Col sm={4}><span className='caption'>Locked event: </span>Yes / No</Col>
              <Col sm={6}><span className='caption'>Event Importance: </span>Nice to have / Should have / Mandatory</Col>
            </Row>
            <Row>
              <Col sm>&nbsp;</Col>
            </Row>
            <Row>
              <Col sm={4}><span className='caption'>Status: </span>Done / In progress / Not Done (editable dropdown)</Col>
              <Col sm={6}><span className='caption'>DMX event number: </span>162</Col>
            </Row>
            <Row>
              <Col sm>&nbsp;</Col>
            </Row>
            <Row>
              <Col sm={6}><span className='caption'>Requires NPC: </span>Yes / No</Col>
            </Row>
            <Row>
              <Col sm={6}><span className='caption'>NPC Location: </span>Odysseus / Text NPC / Mission</Col>
            </Row>
            <Row>
              <Col sm={6}><span className='caption'>NPC Count: </span>- / 13 / 50</Col>
            </Row>
            <Row>
              <Col sm>&nbsp;</Col>
            </Row>
            <Row>
              <Col sm><span className='mini-header'>Plots</span></Col>
            </Row>
            {<span><ul><li>Not part of a plot</li><li>Link to plot 1</li><li>Link to plot 2</li></ul></span>}
            <Row>
              <Col sm><span className='mini-header'>Messages [CREATE MESSAGE BUTTON]</span></Col>
            </Row>
            {<span><ul><li>No messages</li><li>Link to message 1 [sent / not sent]</li></ul></span>}
            <Row>
              <Col sm><span className='mini-header'>Artifacts</span></Col>
            </Row>
            {<span><ul><li>No artifacts</li><li>Link to artifact 1</li></ul></span>}
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
              <Col sm><span className='mini-header'>What is required from NPCs?</span></Col>
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
              <Col sm><span className='mini-header'>GM Notes During the Runs [ADD NOTE BUTTON] [HIDE PREVIOUS RUNS CHECKBOX]</span></Col>
            </Row>
            <ul><li><Row>
              <Col sm><span>Timestamp: Note 6</span></Col>
            </Row></li>
            <li><Row>
              <Col sm><span>Timestamp: Note 5</span></Col>
            </Row></li>
            <li><Row>
              <Col sm><span>Timestamp: Note 4</span></Col>
            </Row></li>
            <li><Row>
              <Col sm><span>Timestamp: Note 3</span></Col>
            </Row></li>
            <li><Row>
              <Col sm><span>Timestamp: Note 2</span></Col>
            </Row></li>
            <li><Row>
              <Col sm><span>Timestamp: Note 1</span></Col>
            </Row></li>
            </ul>
            <Row>
              <Col sm><span>Save the notes between games!</span></Col>
            </Row>
            <Row>
              <Col sm>&nbsp;</Col>
            </Row>
          </Container>
        </div>
      </div>
    )
  }