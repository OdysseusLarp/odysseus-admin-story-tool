import { Container, Row, Col } from "react-bootstrap";
import './Messages.css';
import './Message.css';

export default function Messages() {
    return (
      <div>
        <h1 className='message' id="app-title">Messages [CREATE MESSAGE BUTTON]</h1>
        <div className='message'>
          <Container fluid className='message'>
            <Row className='row-mini-header'>
              <Col sm><span className='mini-header'>Basic Info</span></Col>
            </Row>
            <Row>
              <Col sm={6}><span className='caption'>Message type: </span> Text NPC / Event / Plot / EVA / Hints for Scientists / Jump / Warning / Fleet Comms / Fleet Secretary / News</Col>
            </Row>
            <Row>
              <Col sm={6}><span className='caption'>Happens after jump: </span>- / 3 / 13 (Editable unless message send time is locked)</Col>
            </Row>
            <Row>
              <Col sm={6}><span className='caption'>Message send time locked: </span>Yes / No </Col>
            </Row>
            <Row>
              <Col sm={6}><span className='caption'>To whom: </span>Character name / Character group</Col>
            </Row>
            <Row>
              <Col sm>&nbsp;</Col>
            </Row>
            <Row>
              <Col sm={6}><span className='caption'>Sent: </span>Yes / No (editable checkbox?)</Col>
            </Row>
            <Row>
              <Col sm>&nbsp;</Col>
            </Row>
            <Row>
              <Col sm><span className='mini-header'>Message (editable)</span></Col>
            </Row>
            <Row>
              <Col sm><span> Copy pasted stuff which we don't need to write many times. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span></Col>
            </Row>
            <Row>
              <Col sm>&nbsp;</Col>
            </Row>
            <Row>
              <Col sm><span className='mini-header'>Plots</span></Col>
            </Row>
            {<span><ul><li>Not part of a plot</li><li>Link to plot 1</li><li>Link to plot 2</li></ul></span>}
            <Row>
              <Col sm><span className='mini-header'>Events</span></Col>
            </Row>
            {<span><ul><li>Not part of an event</li><li>Link to event</li></ul></span>}
            <Row>
              <Col sm><span className='mini-header'>GM Notes</span></Col>
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