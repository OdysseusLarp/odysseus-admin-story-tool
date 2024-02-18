import React from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Button } from "react-bootstrap";

const EditMessageModal = (props) => {
  const { showMessageEdit, editMessage, handleClose, handleEditSave } = props;
  return (
    <Modal 
      onClose={handleClose}
      onHide={handleClose}
      show={showMessageEdit}
      size="lg"
    >
      <Modal.Header closeButton>
      <Modal.Title>Edit Message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div><span className='caption'>Sender:</span> {editMessage?.sender?.name}</div>
      <div><span className='caption'>Receiver(s):</span> {editMessage?.receivers?.map(receiver => receiver.name).join(', ')}</div>
      <br/>
      <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Happens after jump:</Form.Label>
          <Form.Select
              disabled={editMessage?.locked}
              defaultValue={editMessage?.after_jump}
              onChange={(event) => {
              const value = event.target.value === "" ? null : parseInt(event.target.value);
              editMessage.after_jump = value;
              }}>
              <option value="">Not defined</option>
              {Array.from(Array(19).keys()).map(item => 
                  <option key= {item} value={item}>{item}</option>
              )}
          </Form.Select>
          <Form.Label>Message send time locked:</Form.Label>
          <Form.Select
              defaultValue={editMessage?.locked}
              onChange={(event) => {
              const locked = (event.target.value === 'true') ? true : false;
              editMessage.locked = locked;
              }}>
              <option value="true">Yes</option>
              <option value="false">No</option>
          </Form.Select>
          <Form.Label>Sent:</Form.Label>
          <Form.Select
              disabled={editMessage?.sent === 'Yes' || editMessage?.sent === 'Repeatable'}
              defaultValue={editMessage?.sent}
              onChange={(event) => {
              editMessage.sent = event.target.value;
              }}>
              <option value="Yes">Yes</option>
              <option value="Not yet">Not yet</option>
              <option value="No Need">No Need</option>
              <option value="Repeatable">Repeatable</option>
          </Form.Select>
          </Form.Group>
          <Form.Group
          className="mb-3"
          controlId="message"
          >
          <Form.Label>Message:</Form.Label>
          <Form.Control
              as="textarea"
              rows={10}
              defaultValue={editMessage?.message}
              onChange={(event) => {
              editMessage.message = event.target.value.trim();
              }}/>
          </Form.Group>
      </Form>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
          Close
      </Button>
      <Button variant="primary" onClick={handleEditSave}>
          Save Changes
      </Button>
      </Modal.Footer>
    </Modal>
  )
};

export default EditMessageModal;