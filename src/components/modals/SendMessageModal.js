import React from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Select from 'react-select'
import { Button, InputGroup } from "react-bootstrap";
import { apiGetRequest } from "../../api";
import { useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../utils/toaster";
import { upsertMessage, sendMessage } from "../../api/messages";
import useSWR from "swr";
import { customStylesDark, customStylesLight } from "../../utils/helpers";

import './SendMessageModal.css';

const DEFAULT_MESSAGE_STATE = {
  name: '',
  type: 'Text NPC',
  locked: false,
  sent: 'Not yet',
  after_jump: null,
  message: '',
  gm_notes: '',
  sender_person_id: null,
  receivers: [],
  plots: [],
  events: []
};

const SendMessageModal = (props) => {
  const { showModal, handleClose, onSendDone, messageToSend } = props;
  const [message, setMessage] = React.useState(DEFAULT_MESSAGE_STATE);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedSender, setSelectedSender] = React.useState(null);
  const [selectedReceivers, setSelectedReceivers] = React.useState([]);
  const navigate = useNavigate();

  const swrCharacters = useSWR("/person?show_hidden=true&is_character=true", apiGetRequest);
  const swrNpcs = useSWR("/person?show_hidden=true&is_character=false", apiGetRequest);

  React.useEffect(() => {
    if (!messageToSend) {
      return;
    }
    setMessage(messageToSend);
    if (messageToSend.sender) {
      setSelectedSender({
        value: messageToSend.sender.id,
        label: messageToSend.sender.name.concat(' - ', messageToSend.sender.is_character ? 'Character' : 'NPC')
      });
    }
    if (messageToSend.receivers) {
      setSelectedReceivers(
        messageToSend.receivers.map((receiver) => {
          return { 
            value: receiver.id, 
            label: receiver.name.concat(' - ', receiver.is_character ? 'Character' : 'NPC')
          };
        })
      );
    }
  }, [messageToSend]);

  const isLoading = swrCharacters.isLoading || swrNpcs.isLoading;
  const isError = swrCharacters.error || swrNpcs.error;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load data</div>;

  const characters = [...swrCharacters.data.persons, ...swrNpcs.data.persons];

  // Generic function to create options for select dropdowns
  const createOptions = (data, valueProperty, labelProperty) => data.map(item => {
    if (labelProperty === 'full_name') {
      return {
        value: item[valueProperty],
        label: item[labelProperty].concat(' - ', item['is_character'] ? 'Character' : 'NPC')
      }
    }
    return {
      value: item[valueProperty],
      label: item[labelProperty]
    }
  }).sort((a, b) => a.label.localeCompare(b.label));

  const characterOptions = createOptions(characters, 'id', 'full_name');

  const afterSubmit = (messageId) => {
    handleClose(false);
    setMessage(DEFAULT_MESSAGE_STATE);
    setSelectedSender(null);
    setSelectedReceivers([]);
    setIsSubmitting(false);
    if (messageToSend) {
      onSendDone();
    }
    else {
      navigate(`/messages/${messageId}`);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    const data = {
      ...message,
      sender_person_id: selectedSender?.value ?? null,
      receivers: selectedReceivers?.map(receiver => receiver.value) ?? [],
      plots: messageToSend?.plots.map(plot => plot.id) ?? [],
      events: messageToSend?.events.map(event => event.id) ?? [],
      sent: 'Yes',
    };

    const upsertResponse = await upsertMessage(data);

    if (upsertResponse.ok) {
      const sendResponse = await sendMessage({
        message: data.message,
        sender_person_id: data.sender_person_id,
        receivers: data.receivers
      });

      const allSendResponses = sendResponse.every((response) => response.ok);

      if (allSendResponses) {
        const responseData = await upsertResponse.json();
        successToast(`Message ${messageToSend ? 'updated' : 'created'} successfully`);
        successToast(`Message sent successfully`);
        afterSubmit(responseData.id);
      } else {
        console.error(`Got HTTP ${sendResponse.map(response => response.status).toString()} response:`, sendResponse);
        setIsSubmitting(false);
        errorToast(`Failed to send message`);
      }
    } else {
      console.error(`Got HTTP ${upsertResponse.status} response:`, upsertResponse.text());
      setIsSubmitting(false);
      errorToast(`Failed to ${messageToSend ? 'update' : 'create'} message`);
    }
  };

  const messageIsFilled = 'message' in message === true && message.message.trim() !== "";

  return (
    <Modal
      onClose={handleClose}
      onHide={handleClose}
      show={showModal}
      size="lg"
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Send Message: {message?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Sender:</Form.Label>
            <Select
              className={selectedSender ? "opt-select" : "opt-select is-invalid"}
              value={selectedSender}
              onChange={setSelectedSender}
              isSearchable={true}
              options={characterOptions}
              isClearable={true}
              styles={document.querySelector('html').getAttribute("data-bs-theme") === "dark" ? customStylesDark : customStylesLight}
            />
            <p className="text-danger testi">
              {!selectedSender ? "Please select sender" : ""}
            </p>
            <Form.Label>Receiver(s):</Form.Label>
            <Select
              className={selectedReceivers.length > 0 ? "opt-select" : "opt-select is-invalid"}
              value={selectedReceivers}
              onChange={setSelectedReceivers}
              isMulti
              isSearchable={true}
              isClearable={true}
              options={characterOptions}
              styles={document.querySelector('html').getAttribute("data-bs-theme") === "dark" ? customStylesDark : customStylesLight}
            />
            <p className="text-danger">
              {selectedReceivers.length < 1 ? "Please select receiver(s)" : ""}
            </p>
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="message"
          >
            <Form.Label>Message: (*)</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                as="textarea"
                rows={10}
                value={message?.message}
                isValid={messageIsFilled}
                isInvalid={!messageIsFilled}
                style={{ zIndex: 0 }}
                onChange={(event) => {
                  setMessage({ ...message, message: event.target.value });
                }} />
              <Form.Control.Feedback type="invalid">
                Please write message
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} type="button">
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit} type="button">
          Send message
        </Button>
      </Modal.Footer>
    </Modal>
  )
};

export default SendMessageModal;