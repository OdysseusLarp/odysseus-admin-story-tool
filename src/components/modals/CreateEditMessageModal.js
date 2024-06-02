import React from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Select from 'react-select'
import { Button, InputGroup } from "react-bootstrap";
import { apiGetRequest } from "../../api";
import { useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../utils/toaster";
import { upsertMessage } from "../../api/messages";
import useSWR from "swr";
import { customStylesDark, customStylesLight } from "../../utils/helpers";

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

const CreateEditMessageModal = (props) => {
  const { showModal, handleClose, onEditDone, messageToEdit } = props;
  const [message, setMessage] = React.useState(DEFAULT_MESSAGE_STATE);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedSender, setSelectedSender] = React.useState(null);
  const [selectedReceivers, setSelectedReceivers] = React.useState([]);
  const [selectedPlots, setSelectedPlots] = React.useState([]);
  const [selectedEvents, setSelectedEvents] = React.useState([]);
  const navigate = useNavigate();

  const swrCharacters = useSWR("/person?show_hidden=true&is_character=true", apiGetRequest);
  const swrNpcs = useSWR("/person?show_hidden=true&is_character=false", apiGetRequest);
  const swrPlots = useSWR("/story/plots", apiGetRequest);
  const swrEvents = useSWR("/story/events", apiGetRequest);

  React.useEffect(() => {
    if (!messageToEdit) {
      return;
    }
    setMessage(messageToEdit);
    if (messageToEdit.sender) {
      setSelectedSender({
        value: messageToEdit.sender.id,
        label: messageToEdit.sender.name.concat(' - ', messageToEdit.sender.is_character ? 'Character' : 'NPC')
      });
    }
    if (messageToEdit.receivers) {
      setSelectedReceivers(
        messageToEdit.receivers.map((receiver) => {
          return { 
            value: receiver.id, 
            label: receiver.name.concat(' - ', receiver.is_character ? 'Character' : 'NPC')
          };
        })
      );
    }
    if (messageToEdit.plots) {
      setSelectedPlots(
        messageToEdit.plots.map((plot) => {
          return { value: plot.id, label: plot.name };
        })
      );
    }
    if (messageToEdit.events) {
      setSelectedEvents(
        messageToEdit.events.map((event) => {
          return { value: event.id, label: event.name };
        })
      );
    }
  }, [messageToEdit]);

  const isLoading = swrCharacters.isLoading || swrNpcs.isLoading || swrPlots.isLoading || swrEvents.isLoading;
  const isError = swrCharacters.error || swrNpcs.error || swrPlots.error || swrEvents.error;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load data</div>;

  const characters = [...swrCharacters.data.persons, ...swrNpcs.data.persons];
  const plots = swrPlots.data;
  const events = swrEvents.data;

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
  const plotOptions = createOptions(plots, 'id', 'name');
  const eventOptions = createOptions(events, 'id', 'name');

  const messageTypeOptions = [
    { value: 'Text NPC', label: 'Text NPC' },
    { value: 'EVA', label: 'EVA' },
    { value: 'Fleet Comms', label: 'Fleet Comms' },
    { value: 'Fleet Secretary', label: 'Fleet Secretary' },
    { value: 'Fleet Admiral', label: 'Fleet Admiral' },
    { value: 'Gray Radio', label: 'Gray Radio' },
    { value: 'Letter', label: 'Letter' },
    { value: 'News', label: 'News' },
    { value: 'Ship Log - Success', label: 'Ship Log - Success' },
    { value: 'Ship Log - Info', label: 'Ship Log - Info' },
    { value: 'Ship Log - Warning', label: 'Ship Log - Warning' },
    { value: 'Ship Log - Error', label: 'Ship Log - Error' },
  ];

  const afterSubmit = (messageId) => {
    handleClose(false);
    setMessage(DEFAULT_MESSAGE_STATE);
    setSelectedSender(null);
    setSelectedReceivers([]);
    setSelectedPlots([]);
    setSelectedEvents([]);
    setIsSubmitting(false);
    if (messageToEdit) {
      onEditDone();
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
      plots: selectedPlots?.map(plot => plot.value) ?? [],
      events: selectedEvents?.map(event => event.value) ?? [],
    };
    const response = await upsertMessage(data);

    if (response.ok) {
      const data = await response.json();
      successToast(`Message ${messageToEdit ? 'updated' : 'created'} successfully`);
      afterSubmit(data.id);
    } else {
      console.error(`Got HTTP ${response.status} response:`, await response.text());
      setIsSubmitting(false);
      errorToast(`Failed to ${messageToEdit ? 'update' : 'create'} message`);
    }
  };

  const nameIsFilled = 'name' in message === true && message.name.trim() !== "";
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
        <Modal.Title>{messageToEdit ? "Edit" : "Create New"} Message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name: (*)</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                autoComplete="off"
                value={message?.name}
                isValid={nameIsFilled}
                isInvalid={!nameIsFilled}
                onChange={(event) => {
                  setMessage({ ...message, name: event.target.value });
                }}
                autoFocus
                required
              />
              <Form.Control.Feedback type="invalid">
                Please give name
              </Form.Control.Feedback>
            </InputGroup>
            <Form.Label>Sender:</Form.Label>
            <Select
              value={selectedSender}
              onChange={setSelectedSender}
              isClearable={true}
              isSearchable={true}
              isDisabled={['Letter', 'Text NPC', 'News'].includes(message.type) ? false : true}
              options={characterOptions}
              styles={document.querySelector('html').getAttribute("data-bs-theme") === "dark" ? customStylesDark : customStylesLight}
            />
            <Form.Label>Receiver(s):</Form.Label>
            <Select
              value={selectedReceivers}
              onChange={setSelectedReceivers}
              isMulti
              isClearable={true}
              isDisabled={['EVA', 'Letter', 'Text NPC', 'Fleet Comms', 'Fleet Secretary', 'Fleet Admiral'].includes(message.type) ? false : true}
              isSearchable={true}
              options={characterOptions}
              styles={document.querySelector('html').getAttribute("data-bs-theme") === "dark" ? customStylesDark : customStylesLight}
            />
            <Form.Label>Message type:</Form.Label>
            <Select
              value={messageTypeOptions[messageTypeOptions.findIndex(option => option.value === message.type)]}
              required={true}
              isClearable={false}
              isSearchable={true}
              options={messageTypeOptions}
              styles={document.querySelector('html').getAttribute("data-bs-theme") === "dark" ? customStylesDark : customStylesLight}
              onChange={(event) => {
                switch (event.value) {
                  case 'Text NPC':
                    break;
                  case 'EVA':
                    setSelectedSender({ value: "20263", label: "EVA (Easy Virtual Assistant)" });
                    break;
                  case 'Fleet Comms':
                    setSelectedSender({ value: "20383", label: "Fleet Comms" });
                    break;
                  case 'Fleet Secretary':
                    setSelectedSender({ value: "20265", label: "Tory Zarek (Fleet Secretary)" });
                    break;
                  case 'Fleet Admiral':
                    setSelectedSender({ value: "20177", label: "Elya Andrews" });
                    break;
                  case 'Gray Radio':
                    setSelectedSender({ value: "20301", label: "Vic Garrett" });
                    break;
                  default:
                    setSelectedSender(null);
                    break;
                }
                setMessage({ ...message, type: event.value });
              }}
            />
            <Form.Label>Happens after jump:</Form.Label>
            <Form.Select
              disabled={message?.locked}
              value={message?.after_jump ?? ""}
              onChange={(event) => {
                const value = event.target.value === "" ? null : parseInt(event.target.value);
                setMessage({ ...message, after_jump: value });
              }}>
              <option value="">Not defined</option>
              {Array.from(Array(19).keys()).map(item =>
                <option key={item} value={item}>{item}</option>
              )}
            </Form.Select>
            <Form.Label>Message send time locked:</Form.Label>
            <Form.Select
              value={message?.locked}
              onChange={(event) => {
                const locked = (event.target.value === 'true') ? true : false;
                setMessage({ ...message, locked: locked });
              }}>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Form.Select>
            <Form.Label>Sent:</Form.Label>
            <Form.Select
              value={message?.sent}
              styles={ {zIndex: 0} }
              onChange={(event) => {
                setMessage({ ...message, sent: event.target.value });
              }}>
              <option value="Yes">Yes</option>
              <option value="Not yet">Not yet</option>
              <option value="No Need">No Need</option>
              <option value="Repeatable">Repeatable</option>
            </Form.Select>
            <Form.Label>Plots:</Form.Label>
            <Select
              value={selectedPlots}
              onChange={setSelectedPlots}
              isMulti
              isClearable={true}
              isSearchable={true}
              options={plotOptions}
              styles={document.querySelector('html').getAttribute("data-bs-theme") === "dark" ? customStylesDark : customStylesLight}
            />
            <Form.Label>Events:</Form.Label>
            <Select
              value={selectedEvents}
              onChange={setSelectedEvents}
              isMulti
              isClearable={true}
              isSearchable={true}
              options={eventOptions}
              styles={document.querySelector('html').getAttribute("data-bs-theme") === "dark" ? customStylesDark : customStylesLight}
            />
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
            <Form.Label>GM Notes:</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              autoComplete="off"
              value={message?.gm_notes ?? ""}
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
        <Button variant="primary" onClick={handleSubmit} type="button">
          {messageToEdit ? "Save message" : "Create message"}
        </Button>
      </Modal.Footer>
    </Modal>
  )
};

export default CreateEditMessageModal;