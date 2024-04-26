import React from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Select from 'react-select'
import { Button } from "react-bootstrap";
import { apiGetRequest } from "../../api";
import { useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../utils/toaster";
import { upsertMessage } from "../../api/messages";
import useSWR from "swr";

const DEFAULT_MESSAGE_STATE = {type: 'Text NPC', locked: false, sent: 'Not yet', receivers: [], sender: null };

const CreateNewMessageModal = (props) => {
  const { showMessageNew, handleClose } = props;
  const [newMessage, setNewMessage] = React.useState(DEFAULT_MESSAGE_STATE);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedSender, setSelectedSender] = React.useState([]);
  const [selectedReceivers, setSelectedReceivers] = React.useState([]);
  const [selectedPlots, setSelectedPlots] = React.useState([]);
  const [selectedEvents, setSelectedEvents] = React.useState([]);
  const navigate = useNavigate();

  const swrCharacters = useSWR("/person?show_hidden=true&is_character=true", apiGetRequest);
  const swrNpcs = useSWR("/person?show_hidden=true&is_character=true", apiGetRequest);
  const swrPlots = useSWR("/story/plots", apiGetRequest);
  const swrEvents = useSWR("/story/events", apiGetRequest);

  const isLoading = swrCharacters.isLoading || swrNpcs.isLoading || swrPlots.isLoading || swrEvents.isLoading;
  const isError = swrCharacters.error || swrNpcs.error || swrPlots.error || swrEvents.error;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load data</div>;

  const characters = [...swrCharacters.data.persons, ...swrNpcs.data.persons];
  const plots = swrPlots.data;
  const events = swrEvents.data;

  // Generic function to create options for select dropdowns
  const createOptions = (data, valueProperty, labelProperty) => data.map(item => ({
    value: item[valueProperty],
    label: item[labelProperty]
  }));

  const characterOptions = createOptions(characters, 'id', 'full_name');
  const plotOptions = createOptions(plots, 'id', 'name');
  const eventOptions = createOptions(events, 'id', 'name');


  const messageTypeOptions = [
    {value: 'Text NPC', label: 'Text NPC'},
    {value: 'EVA', label: 'EVA'},
    {value: 'Fleet Comms', label: 'Fleet Comms'},
    {value: 'Fleet Secretary', label: 'Fleet Secretary'},
    {value: 'Fleet Admiral', label: 'Fleet Admiral'},
    {value: 'Ship Log - Success', label: 'Ship Log - Success'},
    {value: 'Ship Log - Info', label: 'Ship Log - Info'},
    {value: 'Ship Log - Warning', label: 'Ship Log - Warning'},
    {value: 'Ship Log - Error', label: 'Ship Log - Error'},
    {value: 'News', label: 'News'},
    {value: 'Gray Radio', label: 'Gray Radio'}
  ];

  const afterSubmit = (messageId) => {
    handleClose(false);
    setNewMessage(DEFAULT_MESSAGE_STATE);
    setSelectedSender(null);
    setSelectedReceivers([]);
    setSelectedPlots([]);
    setSelectedEvents([]);
    setIsSubmitting(false);
    navigate(`/messages/${messageId}`);
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    const data = {
      ...newMessage,
      sender_person_id: selectedSender?.value ?? null,
      receivers: selectedReceivers?.map(receiver => receiver.value) ?? [],
      plots: selectedPlots?.map(plot => plot.value) ?? [],
      events: selectedEvents?.map(event => event.value) ?? [],
    };
    const response = await upsertMessage(data);

    if (response.ok) {
      const data = await response.json();
      successToast("Message created successfully");
      afterSubmit(data.id);
    } else {
      console.error(`Got HTTP ${response.status} response:`, await response.text());
      setIsSubmitting(false);
      errorToast("Failed to create message");
    }
  };

  return (
    <Modal
      onClose={handleClose}
      onHide={handleClose}
      show={showMessageNew}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Create New Message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Name: (*)</Form.Label>
          <Form.Control
            type="text"
            autoComplete="off"
            value={newMessage?.name}
            onChange={(event) => {
              setNewMessage({ ...newMessage, name: event.target.value });
            }}
            autoFocus
            required
          />
          <Form.Label>Sender:</Form.Label>
          <Select
            value={selectedSender}
            onChange={setSelectedSender}
            isClearable={true}
            isSearchable={true}
            isDisabled={newMessage.type === 'Text NPC' ? false : true}
            options={characterOptions}
          />
          <Form.Label>Receiver(s):</Form.Label>
          <Select
            value={selectedReceivers}
            onChange={setSelectedReceivers}
            isMulti
            isClearable={true}
            isDisabled={['EVA', 'Text NPC', 'Fleet Comms', 'Fleet Secretary', 'Fleet Admiral'].includes(newMessage.type) ? false : true}
            isSearchable={true}
            options={characterOptions}
          />
          <Form.Label>Message type: (*)</Form.Label>
          <Select
            value={messageTypeOptions[messageTypeOptions.findIndex(option => option.value === newMessage.type)]}
            required={true}
            isClearable={false}
            isSearchable={true}
            options={messageTypeOptions}
            onChange={(event) => {
              let sender_person_id = newMessage.sender_person_id;
              switch (event.value) {
                case 'Text NPC':
                  break;
                case 'EVA':
                  sender_person_id = '20263';
                  break;
                case 'Fleet Comms':
                  sender_person_id = '20383';
                  break;
                case 'Fleet Secretary':
                  sender_person_id = '20265';
                  break;
                case 'Fleet Admiral':
                  sender_person_id = '20177';
                  break;
                default:
                  sender_person_id = null;
                  break;
              }
              setNewMessage({...newMessage, sender_person_id, type: event.value});
            }}
          />
          <Form.Label>Happens after jump: (*)</Form.Label>
          <Form.Select
            disabled={newMessage?.locked}
            value={newMessage?.after_jump}
            onChange={(event) => {
              const value = event.target.value === "" ? null : parseInt(event.target.value);
              setNewMessage({...newMessage, after_jump: value});
            }}>
            <option value="">Not defined</option>
            {Array.from(Array(19).keys()).map(item =>
              <option key={item} value={item}>{item}</option>
            )}
          </Form.Select>
          <Form.Label>Message send time locked: (*)</Form.Label>
          <Form.Select
            value={newMessage?.locked}
            onChange={(event) => {
              const locked = (event.target.value === 'true') ? true : false;
              setNewMessage({...newMessage, locked: locked});
            }}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Form.Select>
            <Form.Label>Sent: (*)</Form.Label>
            <Form.Select
              value={newMessage?.sent}
              onChange={(event) => {
                setNewMessage({...newMessage, sent: event.target.value});
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
            />
            <Form.Label>Events:</Form.Label>
            <Select
            value={selectedEvents}
            onChange={setSelectedEvents}
            isMulti
            isClearable={true}
            isSearchable={true}
            options={eventOptions}
            />
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="message"
          >
            <Form.Label>Message: (*)</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              value={newMessage?.message}
              onChange={(event) => {
                setNewMessage({...newMessage, message: event.target.value});
              }} />
            <Form.Label>GM Notes:</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              autoComplete="off"
              value={newMessage?.gm_notes}
              onChange={(event) => {
                setNewMessage({ ...newMessage, gm_notes: event.target.value });
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
          Create message
        </Button>
      </Modal.Footer>
    </Modal>
  )
};

export default CreateNewMessageModal;