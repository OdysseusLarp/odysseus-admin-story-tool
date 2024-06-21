import React from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../utils/toaster";
import { updateCharacter } from "../../api/character";

const DEFAULT_CHARACTER_STATE = {
  gm_notes: '',
};

const EditCharacterModal = (props) => {
  const { showModal, handleClose, onEditDone, characterToEdit } = props;
  const [character, setCharacter] = React.useState(DEFAULT_CHARACTER_STATE);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!characterToEdit) {
      return;
    }
    setCharacter(characterToEdit);
  }, [characterToEdit]);

  const afterSubmit = (characterId) => {
    handleClose(false);
    setCharacter(DEFAULT_CHARACTER_STATE);
    setIsSubmitting(false);
    if (characterToEdit) {
      onEditDone();
    }
    else {
      navigate(`/characters/${characterId}`);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    const data = {
      ...character,
    };

    delete data.entries;
    delete data.groups;
    delete data.family;
    delete data.ship;

    const response = await updateCharacter(data);

    if (response.ok) {
      const data = await response.json();
      successToast('Character updated');
      afterSubmit(data.id);
    } else {
      console.error(`Got HTTP ${response.status} response:`, await response.text());
      setIsSubmitting(false);
      errorToast('Failed to update character');
    }
  };

  return (
    <Modal
      onClose={handleClose}
      onHide={handleClose}
      show={showModal}
      size="lg"
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit {character?.full_name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
          <Form.Label>GM Notes:</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              autoComplete="off"
              value={character?.gm_notes ?? ""}
              onChange={(evt) => {
                setCharacter({ ...character, gm_notes: evt.target.value });
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
          Edit GM Note
        </Button>
      </Modal.Footer>
    </Modal>
  )
};

export default EditCharacterModal;