import React from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Button } from "react-bootstrap";
import { upsertMessage } from "../../api/messages";
import { errorToast, successToast } from "../../utils/toaster";
import { cloneDeep } from "lodash-es";

const EditMessageModal = (props) => {
  const { showMessageEdit, handleClose, handleSave } = props;

  const [message, setMessage] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setMessage(cloneDeep(props.message));
  }, [props.message]);

  const onSubmit = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    const response = await upsertMessage(message);
    if (response.ok) {
      successToast("Message updated successfully");
      handleSave();
    } else {
      console.error(`Got HTTP ${response.status} response:`, await response.text());
      errorToast("Failed to update message");
    }

    setIsSubmitting(false);
  };

  if (!message) {
    return null;
  }

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
        <div><p className="caption">{message?.name}</p></div>
        <div><span className="caption">Sender:</span> {message?.sender?.name}</div>
        <div><span className="caption">Receiver(s):</span> {message?.receivers?.map(receiver => receiver.name).join(', ')}</div>
        <br />
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Happens after jump:</Form.Label>
            <Form.Select
              disabled={message?.locked}
              defaultValue={message?.after_jump}
              onChange={(event) => {
                const after_jump = event.target.value === "" ? null : parseInt(event.target.value);
                setMessage({...message, after_jump});
              }}>
              <option value="">Not defined</option>
              {Array.from(Array(19).keys()).map(item =>
                <option key={item} value={item}>{item}</option>
              )}
            </Form.Select>
            <Form.Label>Message send time locked:</Form.Label>
            <Form.Select
              defaultValue={message?.locked}
              onChange={(event) => {
                const locked = (event.target.value === 'true') ? true : false;
                setMessage({...message, locked});
              }}>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Form.Select>
            <Form.Label>Sent:</Form.Label>
            <Form.Select
              disabled={message?.sent === 'Yes' || message?.sent === 'Repeatable'}
              defaultValue={message?.sent}
              onChange={(event) => {
                setMessage({...message, sent: event.target.value});
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
              defaultValue={message?.message}
              onChange={(event) => {
                setMessage({...message, message: event.target.value});
              }} />
            <Form.Label>GM Notes:</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              autoComplete="off"
              value={message?.gm_notes}
              onChange={(event) => {
                setMessage({ ...message, gm_notes: event.target.value });
              }}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} type="button">
          Close
        </Button>
        <Button variant="primary" onClick={onSubmit} type="button">
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
};

export default EditMessageModal;
