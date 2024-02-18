import React from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Select from 'react-select'
import { Button } from "react-bootstrap";
import { apiUrl } from "../../api";

const getCharacters = async () => {
  const response = await fetch(apiUrl("/person?show_hidden=true&is_character=true"));
  const characters = await response.json();
  return characters.persons;
}

const getNpcs = async () => {
  const response = await fetch(apiUrl("/person?show_hidden=true&is_character=false"));
  const npcs = await response.json();
  return npcs.persons;
}

const CreateNewMessageModal = (props) => {
  const { showMessageNew, handleClose } = props;
  const [characters, setCharacters] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState({type: 'Text NPC', locked: false, sent: 'Not yet'});

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [charactersData, npcsData] = await Promise.all([
          getCharacters(),
          getNpcs(),
        ]);

        const allCharacters = [...charactersData, ...npcsData];
        setCharacters(allCharacters);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  console.log("newMessage", newMessage);

  const characterOptions = characters.map(character => {
    return {
      value: character.id,
      label: character.full_name
    }});
  characterOptions.unshift({value: null, label: "No Sender"});

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
  ]

  console.log("senderOptions", characterOptions);

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
          <Form.Label>Sender:</Form.Label>
          <Select
            value={characterOptions[characterOptions.findIndex(option => option.value === newMessage?.sender_person_id)]}
            isClearable={false}
            isSearchable={true}
            isDisabled={newMessage.type === 'Text NPC' ? false : true}
            options={characterOptions}
            onChange={(event) => {setNewMessage({...newMessage, sender_person_id: event.value })}}
          />
          <Form.Label>Receiver(s):</Form.Label>
          <Select
            isMulti
            isDisabled={['EVA', 'Text NPC', 'Fleet Comms', 'Fleet Secretary', 'Fleet Admiral'].includes(newMessage.type) ? false : true}
            isSearchable={true}
            options={characterOptions}
            onChange={(event) => {
              setNewMessage({...newMessage, receivers: event.map(receivers => receivers.id = receivers.value)});
            }}
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
          <Form.Label>Happens after jump:</Form.Label>
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
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="message"
          >
            <Form.Label>Message:</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              value={newMessage?.message}
              onChange={(event) => {
                setNewMessage({...newMessage, sent: event.target.value.trim()});
              }} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => {
            handleClose(false);
            console.log("Should be saved to DB");
            setNewMessage({type: 'Text NPC', locked: false, sent: 'Not yet'});
            // Send New Message to database
            // Move to that Message page
            // Empty 
          }}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
};

export default CreateNewMessageModal;