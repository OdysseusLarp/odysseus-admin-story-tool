import { Container, Row, Col } from "react-bootstrap";
import './Messages.css';
import './Message.css';

export default function Messages() {
    return (
      <div>
        <h1 className='message' id="app-title">Messages [CREATE NEW MESSAGE BUTTON]</h1>
        <div className='message'>
          <Container fluid className='message'>
            <Row className='row-mini-header'>
              <Col sm><span className='mini-header'>Basic Info</span></Col>
            </Row>
            <Row>
              <Col sm={6}><span className='caption'>Happens after jump: </span>- / 3 / 13 (Editable unless event is locked)</Col>
            </Row>
            <Row>
              <Col sm={6}><span className='caption'>Message type: </span>Event / EVA / Hints for Scientists / Jump / Warning / Fleet Comms / Fleet Secretary / News</Col>
            </Row>
            <Row>
              <Col sm>&nbsp;</Col>
            </Row>
            <Row>
              <Col sm><span className='mini-header'>Message</span></Col>
            </Row>
            <Row>
              <Col sm><span> Copy pasted stuff which we don't need to write many times. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span></Col>
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
          </Container>
        </div>
      </div>
    )
  }