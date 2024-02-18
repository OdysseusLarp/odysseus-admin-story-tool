import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { apiUrl } from "../api";
import { Button, ButtonGroup } from "react-bootstrap";
import { BiMailSend, BiPencil } from "react-icons/bi";
import { LuMailPlus } from "react-icons/lu";
import EditMessageModal from "./modals/EditMessageModal";
import CreateNewMessageModal from "./modals/CreateNewMessageModal";
import './Message.css';

// TODO: Use lodash instead
const cloneDeep = (obj) => JSON.parse(JSON.stringify(obj));

const getMessage = async (id) => {
  const response = await fetch(apiUrl(`/story/messages/${id}`));
  const message = await response.json();
  return message;
}

export default function Messages(props) {
  const [message, setMessage] = React.useState(null);
  const [showMessageEdit, setShowMessageEdit] = React.useState(false);
  const [showMessageNew, setShowMessageNew] = React.useState(false);
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

    let editMessage = cloneDeep(message);

    console.log("message", message);

    return (
      <div>
        <div className='message'>
          <Container fluid className='message'>
            <Row className='row-mini-header'>
              <Col sm><span className='mini-header'>Sender</span></Col>
            </Row>
            <Row>
              <Col sm><ul>{message.sender?.id && <li><span className='characters'><Link onClick={() => props.changeTab('Characters')} to={`/characters/${message.sender?.id}`}>{message.sender?.name}</Link> (Card ID: {message.sender?.card_id}) </span></li>}</ul></Col>
            </Row>
            <Row className='row-mini-header'>
              <Col sm><span className='mini-header'>Receiver(s)</span></Col>
            </Row>
            <Row>
              <Col sm><span><ul>{message.receivers?.map(receiver => <li key={receiver?.id}><span className='characters'><Link onClick={() => props.changeTab('Characters')} to={`/characters/${receiver?.id}`}>{receiver?.name}</Link> (Card ID: {receiver?.card_id})</span></li>)}</ul></span></Col>
            </Row>
            <Row className='row-mini-header'>
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
            <ul>{message.plots?.map(plot => <li key={plot.id}><Row><Col sm><span className='plots'><Link onClick={() => props.changeTab('Plots')} to={`/plots/${plot.id}`}>{plot.name}</Link></span></Col></Row></li>)}</ul>
            <Row>
              <Col sm><span className='mini-header'>Events</span></Col>
            </Row>
            <ul>{message.events?.map(event => <li key={event.id}><Row><Col sm><span className='events'><Link onClick={() => props.changeTab('Events')} to={`/events/${event.id}`}>{event.name}</Link></span></Col></Row></li>)}</ul>
            <Row>
              <Col sm><span className='mini-header'>Message</span></Col>
            </Row>
            <Row>
              <Col sm><span> {message.message} </span></Col>
            </Row>
            <Row>
              <Col sm>&nbsp;</Col>
            </Row>
            <Row>
              <Col sm><span className='mini-header'>GM Notes</span></Col>
            </Row>
            <Row>
              <Col sm><span> {message.gm_notes} </span></Col>
            </Row>
            <Row>
              <Col sm>&nbsp;</Col>
            </Row>
          </Container>
        </div>

        <EditMessageModal
          showMessageEdit={showMessageEdit}
          handleClose={() => setShowMessageEdit(false)}
          handleEditSave={() => {
            setShowMessageEdit(false);
            setMessage(editMessage);
          }}
          editMessage={editMessage}
        />

        <CreateNewMessageModal
          showMessageNew={showMessageNew}
          handleClose={() => setShowMessageNew(false)}
        />

      </div>
    )
  }

  return (
    <div>
      <h1 className='message' id="app-title"> {message?.name}
        <ButtonGroup>
          <Button className="float-char-btn" title="Edit Message" variant="outline-secondary" onClick={() => setShowMessageEdit(true)} disabled={message?.sent === 'Yes'}><BiPencil size="35px"/></Button>
          <Button className="float-char-btn" title="Send Message" variant="outline-secondary" onClick={null} disabled={message?.sent === 'Yes'}><BiMailSend size="35px"/></Button>
          <Button className="float-char-btn" title="Create New Message" variant="outline-secondary" onClick={() => setShowMessageNew(true)}><LuMailPlus size="35px"/></Button>
        </ButtonGroup>
      </h1>
      {renderMessage()}

    </div>
  );
}