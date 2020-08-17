import React, { useState, useEffect } from 'react';
import * as api from '../api/apiService.js';
import Modal from 'react-modal';

// Direcionando o Modal para a localização do react
Modal.setAppElement('#root');

const customStyles = {
  flexRow: {
    display: 'flex',
    flexDiretion: 'row',
    alignItens: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  flexStart: {
    justifyContent: 'flex-start',
  },
};

export default function ModalGrade({ selectedGrade, onSave, onClose }) {
  const { id, student, subject, type, value } = selectedGrade;
  const [gradeValue, setGradeValue] = useState(value);
  const [gradeValidation, setGradeValidation] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getValidation = async () => {
      const validation = await api.getValidationFromGradeType(type);
      setGradeValidation(validation);
    };

    getValidation();
  }, [type]);

  useEffect(() => {
    const { minValue, maxValue } = gradeValidation;

    if (gradeValue < minValue || gradeValue > maxValue) {
      setErrorMessage(
        `O valor deve ser entre ${minValue} e ${maxValue} (inclusive)`
      );
      return;
    }
    setErrorMessage('');
  }, [gradeValue, gradeValidation]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keyDown', handleKeyDown);
    };
  });

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose(null);
    }
  };

  const handleModalClose = (event) => {
    onClose(null);
  };

  const handleGradeChange = (event) => {
    setGradeValue(+event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formData = {
      id,
      newValue: gradeValue,
    };

    onSave(formData);
  };

  return (
    <>
      <Modal isOpen={true}>
        <div style={customStyles.flexRow}>
          <span style={{ fontSize: '1.7rem', color: 'teal' }}>
            Atualizar Notas{' '}
          </span>
          <button
            className="waves-effect waves-lights btn red dark-4 right"
            onClick={handleModalClose}
          >
            X
          </button>
        </div>
        <form onSubmit={handleFormSubmit} className="col s12">
          <div className="row">
            <div className="input-field col s12">
              <input
                value={student}
                id="inputStudent"
                type="text"
                className="validate"
                readOnly
              />
              <label className="active" htmlFor="inputStudent">
                Aluno
              </label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input
                value={subject}
                id="inputSubject"
                type="text"
                className="validate"
                readOnly
              />
              <label className="active" htmlFor="inputSubject">
                Disciplina
              </label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input
                value={type}
                id="inputType"
                type="text"
                className="validate"
                readOnly
              />
              <label className="active" htmlFor="inputType">
                Avaliação
              </label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input
                value={gradeValue}
                id="inputGrade"
                type="number"
                min={gradeValidation.minValue}
                max={gradeValidation.maxValue}
                step="1"
                autoFocus
                onChange={handleGradeChange}
              />
              <label className="active" htmlFor="inputGrade">
                Nota
              </label>
              <span style={{ color: 'red' }}>{errorMessage}</span>
            </div>
          </div>

          <div style={(customStyles.flexRow, customStyles.flexStart)}>
            <button
              className="waves-effect waves-light btn teal ligthen-1 right"
              disabled={errorMessage.trim() !== ''}
            >
              Salvar
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
