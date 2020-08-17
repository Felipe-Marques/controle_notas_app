import React, { useState, useEffect } from 'react';
import * as api from './api/apiService';
import Spinner from './components/Spinner';
import GradesControl from './components/GradesControl';
import ModalGrade from './components/ModalGrade';

export default function App() {
  // Hooks
  const [allGrades, setAllGrades] = useState([]);
  const [selectGrade, setSelectGrade] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getGrades = async () => {
      const grades = await api.getAllGrades();
      setTimeout(() => {
        setAllGrades(grades);
      }, 2000);
    };

    getGrades();
  }, []);

  const handleDelete = async (gradeToDelete) => {
    const { id } = gradeToDelete;
    const isDeleted = await api.deleteGrade(id);

    if (isDeleted) {
      let deleteGradeIndex = allGrades.findIndex((grade) => grade.id === id);

      //Criando nova array recebendo dados da All grades e alterando parametros co o index encontrado.
      const newGrades = Object.assign([], allGrades);
      newGrades[deleteGradeIndex].isDeleted = true;
      newGrades[deleteGradeIndex].value = 0;

      setAllGrades(newGrades);
    }
  };

  const handlePersist = async (grade) => {
    setSelectGrade(grade);
    setIsModalOpen(true);
  };

  const handlePersistData = async (formData) => {
    console.log(formData);

    const { id, newValue } = formData;

    const newGrades = Object.assign([], allGrades);
    const gradeToPersist = newGrades.find((grade) => grade.id === id);
    gradeToPersist.value = newValue;

    //Inserção ou update de grade.
    if (gradeToPersist.isDeleted) {
      gradeToPersist.isDeleted = false;
      await api.insertGrade(gradeToPersist);
    } else {
      await api.updateGrade(gradeToPersist);
    }

    setIsModalOpen(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1 className="center">Controle de Notas</h1>

      {allGrades.length <= 0 && <Spinner />}

      {allGrades.length > 0 && (
        <GradesControl
          grades={allGrades}
          onDelete={handleDelete}
          onPersist={handlePersist}
        />
      )}

      {isModalOpen && (
        <ModalGrade
          onSave={handlePersistData}
          onClose={handleClose}
          selectedGrade={selectGrade}
        />
      )}
    </div>
  );
}
