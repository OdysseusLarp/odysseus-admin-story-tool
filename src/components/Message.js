import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { apiUrl } from "../api";
import { Button, ButtonGroup } from "react-bootstrap";
import { BiMailSend, BiPencil } from "react-icons/bi";
import EditMessageModal from "./modals/EditMessageModal";
import './Message.css';

const getMessage = async (id) => {
  const response = await fetch(apiUrl(`/story/messages/${id}`));
  const message = await response.json();
  return message;
}

export default function Messages(props) {
  const [message, setMessage] = React.useState(null);
  const [showMessageEdit, setShowMessageEdit] = React.useState(false);
  const params = useParams();

  React.useEffect(() => {
    if (!params.id) return;
    getMessage(params.id).then((s) => setMessage(s));
  }, [params.id, setMessage]);

  React.useEffect(() => {
    props.changeTab('Messages');
  }, [props]);

  const renderMessage = () => {
    if (!message) return null;

    const afterJumpEmpty = (value) => value ? value : 'Not defined';
    const booleanToString = (value) => value ? 'Yes' : 'No';
    const gm_notes = message.gm_notes ? message.gm_notes.split('\n').flat() : [];

    return (
      <div>
        <div className='message'>
          <Container fluid className='message'>
            <Row className='row-mini-header'>
              <Col sm><span className='mini-header'>Sender</span></Col>
            </Row>
            <Row>
              <Col sm>{message.sender === null ? <ul><li>No sender</li></ul> : <ul>{message.sender?.id && <li><span className='characters'><Link onClick={() => props.changeTab('Characters')} to={`/characters/${message.sender?.id}`}>{message.sender?.name}</Link> (Card ID: {message.sender?.card_id}) </span></li>}</ul>}</Col>
            </Row>
            <Row>
              <Col sm><span className='mini-header'>Receiver(s)</span></Col>
            </Row>
            <Row>
              <Col sm>{message.receivers.length < 1 ? <ul><li>No receivers</li></ul> : <span><ul>{message.receivers?.map(receiver => <li key={receiver?.id}><span className='characters'><Link onClick={() => props.changeTab('Characters')} to={`/characters/${receiver?.id}`}>{receiver?.name}</Link> (Card ID: {receiver?.card_id})</span></li>)}</ul></span>}</Col>
            </Row>
            <Row>
              <Col sm><span className='mini-header'>Basic Info</span></Col>
            </Row>
            <Row>
              <Col sm={6}><span className='caption'>Message type: </span> {message.type} </Col>
            </Row>
            <Row>
              <Col sm={6}><span className='caption'>Happens after jump: </span> {afterJumpEmpty(message.after_jump)}</Col>
            </Row>
            <Row>
              <Col sm={6}><span className='caption'>Message send time locked: </span> {booleanToString(message.locked)} </Col>
            </Row>
            <Row>
              <Col sm={6}><span className='caption'>Sent: </span> {message.sent} </Col>
            </Row>
            <Row>
              <Col sm>&nbsp;</Col>
            </Row>
            <Row>
              <Col sm><span className='mini-header'>Plots</span></Col>
            </Row>
            {message.plots?.length < 1 ? <ul><li>No linked plots</li></ul> : <ul>{message.plots?.map(plot => <li key={plot.id}><Row><Col sm><span className='plots'><Link onClick={() => props.changeTab('Plots')} to={`/plots/${plot.id}`}>{plot.name}</Link></span></Col></Row></li>)}</ul>}
            <Row>
              <Col sm><span className='mini-header'>Events</span></Col>
            </Row>
            {message.events?.length < 1 ? <ul><li>No linked events</li></ul> : <ul>{message.events?.map(event => <li key={event.id}><Row><Col sm><span className='events'><Link onClick={() => props.changeTab('Events')} to={`/events/${event.id}`}>{event.name}</Link></span></Col></Row></li>)}</ul>}
            <Row>
              <Col sm><span className='mini-header'>Message</span></Col>
            </Row>
            <Row>
              <Col sm><span> {message.message === "" ? "No message" : message.message } </span></Col>
            </Row>
            <Row>
              <Col sm>&nbsp;</Col>
            </Row>
            <Row>
              <Col sm><span className='mini-header'>GM Notes</span></Col>
            </Row>
            {gm_notes.length < 1 ? <ul><li>No notes</li></ul> : <ul>{gm_notes.map(e => <li key={e}>{e}</li>)}</ul>}
            <Row>
              <Col sm>&nbsp;</Col>
            </Row>
          </Container>
        </div>

        <EditMessageModal
          showMessageEdit={showMessageEdit}
          handleClose={() => setShowMessageEdit(false)}
          handleSave={() => {
            setShowMessageEdit(false);
            getMessage(params.id).then((s) => setMessage(s))
          }}
          message={message}
        />

      </div>
    )
  }

  return (
    <div>
      <h1 className='message' id="app-title"> {message?.name}
        <ButtonGroup>
          <Button className="float-char-btn" title="Edit Message" variant="outline-secondary" onClick={() => setShowMessageEdit(true)} disabled={message?.sent === 'Yes'}><BiPencil size="24px"/><span>Edit</span></Button>
          <Button className="float-char-btn" title="Send Message" variant="outline-secondary" onClick={null} disabled={message?.sent === 'Yes'}><BiMailSend size="24px"/><span>Send</span></Button>
        </ButtonGroup>
      </h1>
      {renderMessage()}

    </div>
  );
}