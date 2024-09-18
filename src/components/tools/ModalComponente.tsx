import  { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ModalComponente = () => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  return (
    <div>
      <h1>React Modal Example</h1>
      <button onClick={openModal}>Open Modal</button>
      
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        <h2>Modal Title</h2>
        <p>This is a simple modal example.</p>
        <button onClick={closeModal}>Close Modal</button>
      </Modal>
    </div>
  )
}

export default ModalComponente