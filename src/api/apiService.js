import axios from 'axios';

const API_URL = 'http://192.168.1.180:3001/grade/';
const API_HEROKU = 'https://controle-backend.herokuapp.com/grade/';

const GRADE_VALIDATION = [
  {
    id: 1,
    gradeType: 'Exercícios',
    minValue: 0,
    maxValue: 10,
  },
  {
    id: 2,
    gradeType: 'Trabalho Prático',
    minValue: 0,
    maxValue: 40,
  },
  {
    id: 3,
    gradeType: 'Desafio',
    minValue: 0,
    maxValue: 50,
  },
];

const getAllGrades = async () => {
  if (API_URL) {
    const resource = await axios.get(API_URL);
  } else {
    const resource = await axios.get(API_HEROKU);
  }

  const grades = resource.data.grades.map((grade) => {
    const { student, subject, type } = grade;
    return {
      ...grade,
      studentLowerCase: student.toLowerCase(),
      subjectLowerCase: subject.toLowerCase(),
      typeLowerCase: type.toLowerCase(),
      isDeleted: false,
    };
  });

  let allStudents = new Set();
  grades.forEach((grade) => allStudents.add(grade.student));
  allStudents = Array.from(allStudents);

  let allSubjects = new Set();
  grades.forEach((grade) => allSubjects.add(grade.subject));
  allSubjects = Array.from(allSubjects);

  let allGradeTypes = new Set();
  grades.forEach((grade) => allGradeTypes.add(grade.type));
  allGradeTypes = Array.from(allGradeTypes);

  let maxId = -1;
  grades.forEach(({ id }) => {
    if (id > maxId) {
      maxId = id;
    }
  });

  let nextId = maxId + 1;

  const allCombinations = [];
  allStudents.forEach((student) => {
    allSubjects.forEach((subject) => {
      allGradeTypes.forEach((type) => {
        allCombinations.push({
          student,
          subject,
          type,
        });
      });
    });
  });

  allCombinations.forEach(({ student, subject, type }) => {
    const hasItem = grades.find((grade) => {
      /* prettier-ignore */
      return grade.student === student && grade.subject === subject && grade.type === type;
    });

    if (!hasItem) {
      grades.push({
        id: nextId++,
        student,
        studentLowerCase: student.toLowerCase(),
        subject,
        subjectLowerCase: subject.toLowerCase(),
        type,
        typeLowerCase: type.toLowerCase(),
        value: 0,
        isDeleted: true,
      });
    }
  });

  grades.sort((a, b) => a.typeLowerCase.localeCompare(b.typeLowerCase));
  grades.sort((a, b) => a.subjectLowerCase.localeCompare(b.subjectLowerCase));
  grades.sort((a, b) => a.studentLowerCase.localeCompare(b.studentLowerCase));

  return grades;
};

const insertGrade = async (grade) => {
  const response = await axios.post(API_URL, grade);
  return response.data.id;
};

const updateGrade = async (grade) => {
  const response = await axios.put(API_URL, grade);
  return response.data;
};

const deleteGrade = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

const getValidationFromGradeType = async (gradeType) => {
  const gradeValidation = GRADE_VALIDATION.find(
    (item) => item.gradeType === gradeType
  );

  const { minValue, maxValue } = gradeValidation;

  return {
    minValue,
    maxValue,
  };
};

export {
  getAllGrades,
  insertGrade,
  updateGrade,
  deleteGrade,
  getValidationFromGradeType,
};
