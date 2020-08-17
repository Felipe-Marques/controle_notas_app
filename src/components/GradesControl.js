import React from 'react';
import Action from './Action';

export default function GradesControl({ grades, onDelete, onPersist }) {
  let tableGrades = [];

  let currentStudent = grades[0].student;
  let currentSubject = grades[0].subject;
  let currentGrades = [];
  let id = 1;

  grades.forEach((grade) => {
    if (grade.subject !== currentSubject) {
      tableGrades.push({
        id: id++,
        student: currentStudent,
        subject: currentSubject,
        grades: currentGrades,
      });

      currentSubject = grade.subject;
      currentGrades = [];
    }

    if (grade.student !== currentStudent) {
      currentStudent = grade.student;
    }

    currentGrades.push(grade);
  });

  // Inserindo o ultimo elemento do push, após o loop
  tableGrades.push({
    id: id++,
    student: currentStudent,
    subject: currentSubject,
    grades: currentGrades,
  });

  const handleActionClick = (id, type) => {
    const grade = grades.find((grade) => grade.id === id);

    type === 'delete_forever' ? onDelete(grade) : onPersist(grade);
  };

  return (
    <div className="container center">
      {tableGrades.map(({ id, grades }) => {
        const finalGrade = grades.reduce((acc, curr) => {
          return acc + curr.value;
        }, 0);

        const gradeStyle = finalGrade >= 70 ? styles.aproved : styles.reproved;

        return (
          <table
            style={styles.table}
            className="striped highlight responsive-table"
            key={id}
          >
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Aluno</th>
                <th style={{ width: '20%' }}>Disciplina</th>
                <th style={{ width: '20%' }}>Avaliação</th>
                <th style={{ width: '20%' }}>Nota</th>
                <th style={{ width: '20%' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {grades.map(
                ({ id, student, subject, type, value, isDeleted }) => {
                  return (
                    <tr key={id}>
                      <td>{student}</td>
                      <td>{subject}</td>
                      <td>{type}</td>
                      <td>{isDeleted ? '-' : value}</td>
                      <td>
                        <div style={styles.flexRow}>
                          <Action
                            onActionClick={handleActionClick}
                            id={id}
                            type={isDeleted ? 'add_box' : 'edit'}
                          />
                          {!isDeleted && (
                            <Action
                              onActionClick={handleActionClick}
                              id={id}
                              type="delete_forever"
                            />
                          )}
                        </div>
                      </td>
                      <td>&nbsp;</td>
                    </tr>
                  );
                }
              )}
            </tbody>
            <tfoot>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td style={{ textAlign: 'right' }}>
                  <strong>Nota Total: </strong>
                </td>
                <td>
                  <span style={gradeStyle}>{finalGrade}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        );
      })}
    </div>
  );
}

const styles = {
  flexRow: {
    display: 'flex',
    flexDiretion: 'row',
    alignItens: 'center',
    justifyContent: 'space-around',
  },

  aproved: {
    fontWeight: 'bold',
    color: '#388e3c',
  },

  reproved: {
    fontWeight: 'bold',
    color: '#f44336',
  },

  table: {
    margin: '20px',
    paddig: '10px',
  },
};
