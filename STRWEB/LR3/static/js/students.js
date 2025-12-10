// PROTOTYPE-BASED IMPLEMENTATION (for reference)

// Base constructor Student
function Student(lastName, firstName, patronymic, gender, age) {
    this._lastName = lastName;
    this._firstName = firstName;
    this._patronymic = patronymic;
    this._gender = gender;
    this._age = age;
}

// Getters and Setters via prototype
Object.defineProperties(Student.prototype, {
    lastName: {
        get: function() { return this._lastName; },
        set: function(value) { this._lastName = value; }
    },
    firstName: {
        get: function() { return this._firstName; },
        set: function(value) { this._firstName = value; }
    },
    patronymic: {
        get: function() { return this._patronymic; },
        set: function(value) { this._patronymic = value; }
    },
    gender: {
        get: function() { return this._gender; },
        set: function(value) { this._gender = value; }
    },
    age: {
        get: function() { return this._age; },
        set: function(value) { this._age = value; }
    }
});

Student.prototype.getFullName = function() {
    return `${this.lastName} ${this.firstName} ${this.patronymic}`;
};

// Heir constructor UniversityStudent
function UniversityStudent(lastName, firstName, patronymic, gender, age, course) {
    Student.call(this, lastName, firstName, patronymic, gender, age);
    this._course = course;
}

// Inheritance
UniversityStudent.prototype = Object.create(Student.prototype);
UniversityStudent.prototype.constructor = UniversityStudent;

// Getter and Setter for course
Object.defineProperty(UniversityStudent.prototype, 'course', {
    get: function() { return this._course; },
    set: function(value) { this._course = value; }
});


// Base class Student
// class Student {
//     constructor(lastName, firstName, patronymic, gender, age) {
//         this._lastName = lastName;
//         this._firstName = firstName;
//         this._patronymic = patronymic;
//         this._gender = gender;
//         this._age = age;
//     }
//
//     // Getters
//     get lastName() {
//         return this._lastName;
//     }
//     get firstName() {
//         return this._firstName;
//     }
//     get patronymic() {
//         return this._patronymic;
//     }
//     get gender() {
//         return this._gender;
//     }
//     get age() {
//         return this._age;
//     }
//
//     // Setters
//     set lastName(value) {
//         this._lastName = value;
//     }
//     set firstName(value) {
//         this._firstName = value;
//     }
//     set patronymic(value) {
//         this._patronymic = value;
//     }
//     set gender(value) {
//         this._gender = value;
//     }
//     set age(value) {
//         this._age = value;
//     }
//
//     getFullName() {
//         return `${this._lastName} ${this._firstName} ${this._patronymic}`;
//     }
// }
//
// // Heir class UniversityStudent
// class UniversityStudent extends Student {
//     constructor(lastName, firstName, patronymic, gender, age, course) {
//         super(lastName, firstName, patronymic, gender, age);
//         this._course = course;
//     }
//
//     // Getter
//     get course() {
//         return this._course;
//     }
//
//     // Setter
//     set course(value) {
//         this._course = value;
//     }
// }

const students = [];

// Method to add a student from the form
function addStudentFromForm() {
    const lastName = document.getElementById('lastName').value;
    const firstName = document.getElementById('firstName').value;
    const patronymic = document.getElementById('patronymic').value;
    const gender = document.getElementById('gender').value;
    const age = parseInt(document.getElementById('age').value);
    const course = parseInt(document.getElementById('course').value);

    const student = new UniversityStudent(lastName, firstName, patronymic, gender, age, course);
    students.push(student);

    displayStudents();
    document.getElementById('add-student-form').reset();
}

// Method to display all students
function displayStudents() {
    const studentListContainer = document.getElementById('student-list');
    studentListContainer.innerHTML = '';
    students.forEach(student => {
        const studentElement = document.createElement('div');
        studentElement.textContent = `${student.getFullName()}, Пол: ${student.gender}, Возраст: ${student.age}, Курс: ${student.course}`;
        studentListContainer.appendChild(studentElement);
    });
}

// Method to display the result
function displayResult() {
    const resultContainer = document.getElementById('result-container');
    if (students.length === 0) {
        resultContainer.textContent = 'Нет студентов для анализа.';
        return;
    }

    const courseStats = {}; // { course: { total: 0, males: 0 } }

    students.forEach(student => {
        if (!courseStats[student.course]) {
            courseStats[student.course] = { total: 0, males: 0 };
        }
        courseStats[student.course].total++;
        if (student.gender === 'male') {
            courseStats[student.course].males++;
        }
    });

    let maxPercentage = -1;
    let courseWithMaxPercentage = -1;

    for (const course in courseStats) {
        const percentage = (courseStats[course].males / courseStats[course].total) * 100;
        if (percentage > maxPercentage) {
            maxPercentage = percentage;
            courseWithMaxPercentage = course;
        }
    }

    if (courseWithMaxPercentage !== -1) {
        resultContainer.textContent = `Курс с наибольшим процентом мужчин: ${courseWithMaxPercentage} (${maxPercentage.toFixed(2)}%)`;
    } else {
        resultContainer.textContent = 'Нет мужчин для анализа.';
    }
}

document.getElementById('add-student-form').addEventListener('submit', function (e) {
    e.preventDefault();
    addStudentFromForm();
});

document.getElementById('calculate-button').addEventListener('click', displayResult);
