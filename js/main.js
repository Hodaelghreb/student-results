class Student {
    #grades;
    #attendance;

    constructor(id, name, grades, attendance) {
        if (name.trim() === "") {
            throw new Error("من فضلك أدخل اسم الطالب");
        }

        this.id = id;
        this.name = name.trim();
        this.grades = grades;
        this.attendance = attendance;
    }

    // Grades Getter and Setter
    get grades() {
        return this.#grades;
    }

    set grades(value) {
        if (!Array.isArray(value) || value.length !== 3) {
            throw new Error("من فضلك أدخل درجات المواد الثلاث");
        }

        if (value.some(grade => String(grade).trim() === "")) {
            throw new Error("من فضلك أدخل درجات المواد الثلاث");
        }

        const numericGrades = value.map(Number);

        if (
            numericGrades.some(
                grade => !Number.isFinite(grade) || grade < 0 || grade > 100
            )
        ) {
            throw new Error("درجات المواد يجب أن تكون أرقامًا من 0 إلى 100");
        }

        this.#grades = numericGrades;
    }

    // Attendance Getter and Setter
    get attendance() {
        return this.#attendance;
    }

    set attendance(value) {
        if (String(value).trim() === "") {
            throw new Error("من فضلك أدخل نسبة الحضور");
        }

        const numericAttendance = Number(value);

        if (
            !Number.isFinite(numericAttendance) ||
            numericAttendance < 0 ||
            numericAttendance > 100
        ) {
            throw new Error("نسبة الحضور يجب أن تكون من 0 إلى 100");
        }

        this.#attendance = numericAttendance;
    }

    calculateAverage() {
        return this.grades.reduce((sum, grade) => sum + grade, 0) / this.grades.length;
    }

    getGrade(average) {
        if (average >= 90) {
            return "A";
        } else if (average >= 80) {
            return "B";
        } else if (average >= 70) {
            return "C";
        } else if (average >= 60) {
            return "D";
        } else if (average >= 50) {
            return "E";
        } else {
            return "F";
        }
    }

    getResult(average) {
        if (average >= 50 && this.attendance >= 75) {
            return "ناجح";
        } else {
            return "يحتاج مراجعة";
        }
    }
}

// Students Array
let studentsList = [];

// Get HTML Elements
const studentNameInput = document.getElementById("studentName");
const grade1Input = document.getElementById("grade1");
const grade2Input = document.getElementById("grade2");
const grade3Input = document.getElementById("grade3");
const attendanceInput = document.getElementById("attendance");

const addStudentBtn = document.getElementById("addStudentBtn");
const mercyCommitteeBtn = document.getElementById("mercyCommitteeBtn");

const errorMessageElement = document.getElementById("errorMessage");
const studentsListElement = document.getElementById("studentsList");
const mercyReportElement = document.getElementById("mercyReport");

// Add Student Button
addStudentBtn.addEventListener("click", function () {
    try {
        const name = studentNameInput.value.trim();

        const rawGrades = [
            grade1Input.value,
            grade2Input.value,
            grade3Input.value
        ];

        const rawAttendance = attendanceInput.value;

        if (name === "") {
            throw new Error("من فضلك أدخل اسم الطالب");
        }

        const student = new Student(
            studentsList.length + 1,
            name,
            rawGrades,
            rawAttendance
        );

        studentsList.push(student);

        const average = student.calculateAverage();

        const studentItem = document.createElement("p");

        studentItem.textContent =
            `${student.name} - المتوسط: ${average.toFixed(2)} - التقدير: ${student.getGrade(average)} - النتيجة: ${student.getResult(average)}`;

        studentsListElement.appendChild(studentItem);

        // Clear Inputs
        studentNameInput.value = "";
        grade1Input.value = "";
        grade2Input.value = "";
        grade3Input.value = "";
        attendanceInput.value = "";

        errorMessageElement.textContent = "";
        errorMessageElement.classList.add("d-none");

    } catch (error) {
        errorMessageElement.textContent = error.message;
        errorMessageElement.classList.remove("d-none");
    }
});

// Mercy Committee Button
mercyCommitteeBtn.addEventListener("click", function () {

    const strugglingStudents = studentsList.filter(student => {
        const average = student.calculateAverage();
        return average >= 40 && average < 50;
    });

    const adjustedStudents = strugglingStudents.map(student => {
        return {
            name: student.name,
            adjustedAverage: student.calculateAverage() + 5
        };
    });

    const totalAdjustedAverages = adjustedStudents.reduce(
        (sum, student) => sum + student.adjustedAverage,
        0
    );

    const averageAfterMercy = adjustedStudents.length > 0
        ? totalAdjustedAverages / adjustedStudents.length
        : 0;

    const studentsDetails = adjustedStudents.map(student => {
        return `${student.name}: ${student.adjustedAverage.toFixed(2)}`;
    }).join("، ");

    mercyReportElement.textContent = `
        عدد الطلاب المستفيدين من لجنة الرأفة: ${adjustedStudents.length}
        أسماء الطلاب ومتوسطاتهم بعد إضافة 5 درجات: ${studentsDetails || "لا يوجد طلاب"}
        متوسط الدرجات بعد لجنة الرأفة: ${averageAfterMercy.toFixed(2)}
    `;
});