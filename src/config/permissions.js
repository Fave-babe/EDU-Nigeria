// =========================================================
// EDU NIGERIA - ROLE PERMISSIONS
// =========================================================

export const ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  TEACHER: "teacher",
  BURSAR: "bursar",
  COUNSELLOR: "counsellor",
  STUDENT: "student",
  PARENT: "parent",
  SUPER_ADMIN: "super_admin",
};

// =========================================================
// MODULE PERMISSIONS
// =========================================================

export const PERMISSIONS = {
  students: [
    ROLES.ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER,
    ROLES.COUNSELLOR,
  ],

  staff: [
    ROLES.ADMIN,
  ],

  teachers: [
    ROLES.ADMIN,
  ],

  academics: [
    ROLES.ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER,
    ROLES.STUDENT,
  ],

  attendance: [
    ROLES.ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER,
  ],

  results: [
    ROLES.ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER,
    ROLES.STUDENT,
    ROLES.PARENT,
    ROLES.COUNSELLOR,
  ],

  assignments: [
    ROLES.ADMIN,
    ROLES.TEACHER,
    ROLES.STUDENT,
  ],

  timetable: [
    ROLES.ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER,
    ROLES.STUDENT,
  ],

  finance: [
    ROLES.ADMIN,
    ROLES.BURSAR,
    ROLES.PARENT,
  ],

  counselling: [
    ROLES.ADMIN,
    ROLES.COUNSELLOR,
  ],

  communications: [
    ROLES.ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER,
    ROLES.STUDENT,
    ROLES.PARENT,
  ],

  notifications: [
    ROLES.ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER,
    ROLES.BURSAR,
    ROLES.COUNSELLOR,
    ROLES.STUDENT,
    ROLES.PARENT,
  ],

  reports: [
    ROLES.ADMIN,
    ROLES.STAFF,
    ROLES.BURSAR,
  ],

  announcements: [
    ROLES.ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER,
    ROLES.STUDENT,
    ROLES.PARENT,
    ROLES.BURSAR,
    ROLES.COUNSELLOR,
  ],

  settings: [
    ROLES.ADMIN,
  ],

  profile: [
    ROLES.ADMIN,
    ROLES.STAFF,
    ROLES.TEACHER,
    ROLES.BURSAR,
    ROLES.COUNSELLOR,
    ROLES.STUDENT,
    ROLES.PARENT,
    ROLES.SUPER_ADMIN,
  ],
};