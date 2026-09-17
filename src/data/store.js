const STORAGE_KEYS = {
  users: "edunigeria_users",
  students: "edunigeria_students",
  classes: "edunigeria_classes",
  subjects: "edunigeria_subjects",
  attendance: "edunigeria_attendance",
  grades: "edunigeria_grades",
  fees: "edunigeria_fees",
  invoices: "edunigeria_invoices",
  payments: "edunigeria_payments",
  staff: "edunigeria_staff",
  timetable: "edunigeria_timetable",
  messages: "edunigeria_messages",
  discipline: "edunigeria_discipline",
  school: "edunigeria_school",
  settings: "edunigeria_settings",
  notifications: "edunigeria_notifications",
  admissions: "edunigeria_admissions",
};

function getInitialData() {
  return {
    users: [
      {
        id: 1,
        name: "Admin User",
        email: "admin@faveschool.ng",
        role: "admin",
        password: "admin123",
        branch: "Main Campus",
      },
      {
        id: 2,
        name: "Jane Teacher",
        email: "jane@faveschool.ng",
        role: "teacher",
        password: "teacher123",
        branch: "Main Campus",
      },
      {
        id: 3,
        name: "Mr. Bursar",
        email: "bursar@faveschool.ng",
        role: "bursar",
        password: "bursar123",
        branch: "Main Campus",
      },
      {
        id: 4,
        name: "Parent One",
        email: "",
        role: "parent",
        password: "",
        branch: "Main Campus",
      },
      {
        id: 5,
        name: "Student One",
        email: "",
        role: "student",
        password: "",
        branch: "Main Campus",
      },
    ],
    students: [
      {
        id: 1,
        firstName: "Chidi",
        lastName: "Okafor",
        gender: "Male",
        dob: "2010-05-12",
        address: "15 Adeniyi Jones, Ikeja",
        parentId: 4,
        admissionNo: "FVS/2024/001",
        classId: 1,
        session: "2024/2025",
        medicalNotes: "No known allergies",
        status: "active",
      },
      {
        id: 2,
        firstName: "Amina",
        lastName: "Bello",
        gender: "Female",
        dob: "2011-08-23",
        address: "8 Awolowo Road, Ikoyi",
        parentId: 4,
        admissionNo: "FVS/2024/002",
        classId: 1,
        session: "2024/2025",
        medicalNotes: "Asthma - inhaler available",
        status: "active",
      },
      {
        id: 3,
        firstName: "Emeka",
        lastName: "Nwosu",
        gender: "Male",
        dob: "2009-03-15",
        address: "22 Broad Street, Lagos",
        parentId: 6,
        admissionNo: "FVS/2024/003",
        classId: 2,
        session: "2024/2025",
        medicalNotes: "",
        status: "active",
      },
      {
        id: 4,
        firstName: "Fatima",
        lastName: "Abubakar",
        gender: "Female",
        dob: "2010-11-30",
        address: "5 Maitama Sule, Abuja",
        parentId: 7,
        admissionNo: "FVS/2024/004",
        classId: 2,
        session: "2024/2025",
        medicalNotes: "Peanut allergy",
        status: "active",
      },
    ],
    classes: [
      {
        id: 1,
        name: "JSS 1",
        section: "Junior Secondary",
        arm: "A",
        branch: "Main Campus",
      },
      {
        id: 2,
        name: "JSS 2",
        section: "Junior Secondary",
        arm: "A",
        branch: "Main Campus",
      },
      {
        id: 3,
        name: "SSS 1",
        section: "Senior Secondary",
        arm: "A",
        branch: "Main Campus",
      },
      {
        id: 4,
        name: "JSS 3",
        section: "Junior Secondary",
        arm: "A",
        branch: "Main Campus",
      },
      {
        id: 5,
        name: "SSS 2",
        section: "Senior Secondary",
        arm: "A",
        branch: "Main Campus",
      },
      {
        id: 6,
        name: "SSS 3",
        section: "Senior Secondary",
        arm: "A",
        branch: "Main Campus",
      },
      {
        id: 7,
        name: "JSS 1",
        section: "Junior Secondary",
        arm: "B",
        branch: "Main Campus",
      },
      {
        id: 8,
        name: "JSS 2",
        section: "Junior Secondary",
        arm: "B",
        branch: "Main Campus",
      },
      {
        id: 9,
        name: "SSS 1",
        section: "Senior Secondary",
        arm: "B",
        branch: "Main Campus",
      },
      {
        id: 10,
        name: "JSS 3",
        section: "Junior Secondary",
        arm: "B",
        branch: "Main Campus",
      },
      {
        id: 11,
        name: "SSS 2",
        section: "Senior Secondary",
        arm: "B",
        branch: "Main Campus",
      },
    ],
    subjects: [
      {
        id: 1,
        name: "Mathematics",
        code: "MTH",
        classId: 1,
        branch: "Main Campus",
      },
      {
        id: 2,
        name: "English Language",
        code: "ENG",
        classId: 1,
        branch: "Main Campus",
      },
      {
        id: 3,
        name: "Basic Science",
        code: "SCI",
        classId: 1,
        branch: "Main Campus",
      },
      {
        id: 4,
        name: "Social Studies",
        code: "SOS",
        classId: 1,
        branch: "Main Campus",
      },
      {
        id: 5,
        name: "Mathematics",
        code: "MTH",
        classId: 2,
        branch: "Main Campus",
      },
      {
        id: 6,
        name: "English Language",
        code: "ENG",
        classId: 2,
        branch: "Main Campus",
      },
    ],
    attendance: [
      {
        id: 1,
        date: "2025-07-10",
        classId: 1,
        studentId: 1,
        status: "present",
        teacherId: 2,
      },
      {
        id: 2,
        date: "2025-07-10",
        classId: 1,
        studentId: 2,
        status: "late",
        teacherId: 2,
      },
      {
        id: 3,
        date: "2025-07-10",
        classId: 2,
        studentId: 3,
        status: "present",
        teacherId: 2,
      },
      {
        id: 4,
        date: "2025-07-10",
        classId: 2,
        studentId: 4,
        status: "absent",
        teacherId: 2,
      },
    ],
    grades: [
      {
        id: 1,
        studentId: 1,
        subjectId: 1,
        classId: 1,
        term: "First Term",
        session: "2024/2025",
        score: 78,
        grade: "B+",
        teacherId: 2,
      },
      {
        id: 2,
        studentId: 1,
        subjectId: 2,
        classId: 1,
        term: "First Term",
        session: "2024/2025",
        score: 85,
        grade: "A-",
        teacherId: 2,
      },
      {
        id: 3,
        studentId: 2,
        subjectId: 1,
        classId: 1,
        term: "First Term",
        session: "2024/2025",
        score: 92,
        grade: "A",
        teacherId: 2,
      },
      {
        id: 4,
        studentId: 2,
        subjectId: 2,
        classId: 1,
        term: "First Term",
        session: "2024/2025",
        score: 88,
        grade: "A-",
        teacherId: 2,
      },
      {
        id: 5,
        studentId: 3,
        subjectId: 5,
        classId: 2,
        term: "First Term",
        session: "2024/2025",
        score: 65,
        grade: "B",
        teacherId: 2,
      },
      {
        id: 6,
        studentId: 4,
        subjectId: 5,
        classId: 2,
        term: "First Term",
        session: "2024/2025",
        score: 74,
        grade: "B+",
        teacherId: 2,
      },
    ],
    fees: [
      {
        id: 1,
        classId: 1,
        category: "Tuition",
        amount: 150000,
        term: "First Term",
        session: "2024/2025",
        branch: "Main Campus",
      },
      {
        id: 2,
        classId: 1,
        category: "Examination",
        amount: 25000,
        term: "First Term",
        session: "2024/2025",
        branch: "Main Campus",
      },
      {
        id: 3,
        classId: 2,
        category: "Tuition",
        amount: 180000,
        term: "First Term",
        session: "2024/2025",
        branch: "Main Campus",
      },
      {
        id: 4,
        classId: 2,
        category: "Examination",
        amount: 30000,
        term: "First Term",
        session: "2024/2025",
        branch: "Main Campus",
      },
    ],
    invoices: [
      {
        id: 1,
        studentId: 1,
        feeId: 1,
        amount: 150000,
        dueDate: "2025-07-15",
        status: "pending",
        branch: "Main Campus",
      },
      {
        id: 2,
        studentId: 1,
        feeId: 2,
        amount: 25000,
        dueDate: "2025-07-15",
        status: "pending",
        branch: "Main Campus",
      },
      {
        id: 3,
        studentId: 3,
        feeId: 3,
        amount: 180000,
        dueDate: "2025-07-15",
        status: "pending",
        branch: "Main Campus",
      },
      {
        id: 4,
        studentId: 4,
        feeId: 3,
        amount: 180000,
        dueDate: "2025-07-15",
        status: "paid",
        branch: "Main Campus",
      },
    ],
    payments: [
      {
        id: 1,
        invoiceId: 4,
        studentId: 4,
        amount: 180000,
        method: "bank_transfer",
        date: "2025-07-01",
        reference: "TXN/001",
        receivedBy: "Mr. Bursar",
        branch: "Main Campus",
      },
    ],
    staff: [
      {
        id: 2,
        name: "Jane Teacher",
        email: "jane@faveschool.ng",
        role: "teacher",
        department: "Academic",
        phone: "08012345678",
        dateEmployed: "2022-01-10",
        branch: "Main Campus",
        status: "active",
      },
      {
        id: 3,
        name: "Mr. Bursar",
        email: "bursar@faveschool.ng",
        role: "bursar",
        department: "Finance",
        phone: "08087654321",
        dateEmployed: "2021-06-15",
        branch: "Main Campus",
        status: "active",
      },
    ],
    timetable: [
      {
        id: 1,
        classId: 1,
        day: "Monday",
        period: 1,
        startTime: "08:00",
        endTime: "08:45",
        subject: "Mathematics",
        teacher: "Jane Teacher",
        branch: "Main Campus",
      },
      {
        id: 2,
        classId: 1,
        day: "Monday",
        period: 2,
        startTime: "08:45",
        endTime: "09:30",
        subject: "English Language",
        teacher: "Jane Teacher",
        branch: "Main Campus",
      },
      {
        id: 3,
        classId: 1,
        day: "Tuesday",
        period: 1,
        startTime: "08:00",
        endTime: "08:45",
        subject: "Basic Science",
        teacher: "Jane Teacher",
        branch: "Main Campus",
      },
      {
        id: 4,
        classId: 2,
        day: "Monday",
        period: 3,
        startTime: "10:00",
        endTime: "10:45",
        subject: "Mathematics",
        teacher: "Jane Teacher",
        branch: "Main Campus",
      },
    ],
    messages: [
      {
        id: 1,
        senderId: 4,
        receiverId: 2,
        subject: "Amina Absence",
        body: "Please Amina was absent yesterday due to malaria.",
        date: "2025-07-10",
        branch: "Main Campus",
      },
      {
        id: 2,
        senderId: 2,
        receiverId: 4,
        subject: "Re: Amina Absence",
        body: "Noted. Please provide a doctor's note on her return.",
        date: "2025-07-10",
        branch: "Main Campus",
      },
    ],
    discipline: [
      {
        id: 1,
        studentId: 2,
        type: "Late Arrival",
        description: "Arrived 45 minutes late without excuse note.",
        action: "Verbal warning",
        notifiedParent: true,
        date: "2025-07-10",
        branch: "Main Campus",
      },
    ],
    school: {
      name: "FaveSchool",
      address: "15 Adeniyi Jones, Ikeja, Lagos",
      phone: "08000000000",
      email: "info@faveschool.ng",
      type: "Secondary",
      branch: "Main Campus",
    },
    notifications: [],
    admissions: [],
    settings: {
      currency: "NGN",
      gradingScale: [
        { min: 75, max: 100, grade: "A", remark: "Excellent" },
        { min: 65, max: 74, grade: "B+", remark: "Very Good" },
        { min: 55, max: 64, grade: "B", remark: "Good" },
        { min: 45, max: 54, grade: "C", remark: "Credit" },
        { min: 40, max: 44, grade: "P", remark: "Pass" },
        { min: 0, max: 39, grade: "F", remark: "Fail" },
      ],
      termStructure: ["First Term", "Second Term", "Third Term"],
      smsProvider: "termii",
      paymentProviders: ["paystack", "flutterwave"],
    },
  };
}

export function initStore() {
  if (!localStorage.getItem("edunigeria_initialized")) {
    const data = getInitialData();
    Object.entries(STORAGE_KEYS).forEach(([key, storeKey]) => {
      if (data[key]) {
        localStorage.setItem(storeKey, JSON.stringify(data[key]));
      }
    });
    localStorage.setItem("edunigeria_initialized", "true");
  }
}

export function loadData(key) {
  const raw = localStorage.getItem(STORAGE_KEYS[key]);
  return raw ? JSON.parse(raw) : [];
}

export function saveData(key, data) {
  localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
}

export function addItem(key, item) {
  const data = loadData(key);
  item.id = Date.now();
  data.push(item);
  saveData(key, data);
  return item;
}

export function updateItem(key, id, updates) {
  const data = loadData(key);
  const idx = data.findIndex((i) => i.id === id);
  if (idx >= 0) {
    data[idx] = { ...data[idx], ...updates };
    saveData(key, data);
    return data[idx];
  }
  return null;
}

export function deleteItem(key, id) {
  const data = loadData(key);
  const filtered = data.filter((i) => i.id !== id);
  saveData(key, filtered);
}

export function getItem(key, id) {
  return loadData(key).find((i) => i.id === id);
}

export { STORAGE_KEYS };
