import React from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../utils/toaster";
import { updateArtifactGmNotes } from "../../api/artifact";

const DEFAULT_ARTIFACT_STATE = {
  gm_notes: '',
};

const EditArtifactModal = (props) => {
  const { showModal, handleClose, onEditDone, characterToEdit: artifactToEdit } = props;
  const [artifact, setArtifact] = React.useState(DEFAULT_ARTIFACT_STATE);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!artifactToEdit) {
      return;
    }
    setArtifact(artifactToEdit);
  }, [artifactToEdit]);

  const afterSubmit = (artifactId) => {
    handleClose(false);
    setArtifact(DEFAULT_ARTIFACT_STATE);
    setIsSubmitting(false);
    if (artifactToEdit) {
      onEditDone();
    }
    else {
      navigate(`/artifacts/${artifactId}`);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    const response = await updateArtifactGmNotes(artifact.id, artifact.gm_notes);
 
    if (response.ok) {
      const data = await response.json();
      successToast('Artifact GM notes updated!');
      afterSubmit(data.id);
    } else {
      console.error(`Got HTTP ${response.status} response:`, await response.text());
      setIsSubmitting(false);
      errorToast('Failed to update artifact');
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
        <Modal.Title>Edit {artifact?.catalog_id} - {artifact?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
          <Form.Label>GM Notes:</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              autoComplete="off"
              value={artifact?.gm_notes ?? ""}
              onChange={(evt) => {
                setArtifact({ ...artifact, gm_notes: evt.target.value });
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

export default EditArtifactModal;