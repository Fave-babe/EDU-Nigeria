import React, { useEffect, useState } from "react";
import {
Plus,
RefreshCw,
BookOpen,
X,
GraduationCap,
Layers,
CheckCircle,
AlertCircle,
Search,
FlaskConical,
} from "lucide-react";

import http from "../api/http";
import { teacherApi } from "../api/teacher.api";
import { classSubjectApi } from "../api/classSubject.api";

export default function Subjects() {
const [subjects, setSubjects] = useState([]);
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const [saving, setSaving] = useState(false);
const [showForm, setShowForm] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [successMessage, setSuccessMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");

const [form, setForm] = useState({
name: "",
code: "",
category: "Core",
description: "",
isCompulsory: false,
});

const schoolId = "6a8485d60293d305ecd84878";

const colors = {
navy: "#071a41",
green: "#079b68",
background: "var(--background, #f5f7fb)",
card: "var(--card-bg, #ffffff)",
text: "var(--text-color, #172033)",
muted: "var(--muted-color, #718096)",
border: "var(--border-color, #e2e8f0)",
input: "var(--input-bg, #ffffff)",
};

const styles = {
page: {
minHeight: "100vh",
padding: "28px",
background: colors.background,
color: colors.text,
fontFamily: "Inter, system-ui, -apple-system, sans-serif",
boxSizing: "border-box",
},
header: {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: "20px",
flexWrap: "wrap",
marginBottom: "28px",
},
titleArea: {
display: "flex",
alignItems: "center",
gap: "14px",
},
titleIcon: {
width: "54px",
height: "54px",
borderRadius: "16px",
background: "rgba(7, 155, 104, 0.12)",
color: colors.green,
display: "flex",
alignItems: "center",
justifyContent: "center",
flexShrink: 0,
},
title: {
margin: 0,
fontSize: "28px",
fontWeight: 800,
letterSpacing: "-0.7px",
color: colors.text,
},
subtitle: {
margin: "7px 0 0",
color: colors.muted,
fontSize: "14px",
},
headerActions: {
display: "flex",
alignItems: "center",
gap: "10px",
flexWrap: "wrap",
},
button: {
display: "inline-flex",
alignItems: "center",
justifyContent: "center",
gap: "8px",
padding: "11px 16px",
borderRadius: "10px",
border: `1px solid ${colors.border}`,
fontSize: "13px",
fontWeight: 700,
cursor: "pointer",
transition: "all 0.2s ease",
},
primaryButton: {
background: colors.green,
color: "#ffffff",
border: `1px solid ${colors.green}`,
boxShadow: "0 5px 12px rgba(7, 155, 104, 0.16)",
},
secondaryButton: {
background: colors.card,
color: colors.text,
},
summaryGrid: {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
gap: "18px",
marginBottom: "28px",
},
summaryCard: {
background: colors.card,
border: `1px solid ${colors.border}`,
borderRadius: "16px",
padding: "21px",
display: "flex",
alignItems: "center",
gap: "16px",
boxShadow: "0 4px 15px rgba(15, 23, 42, 0.025)",
},
summaryIcon: {
width: "48px",
height: "48px",
borderRadius: "13px",
display: "flex",
alignItems: "center",
justifyContent: "center",
flexShrink: 0,
},
summaryLabel: {
margin: 0,
fontSize: "12px",
color: colors.muted,
fontWeight: 600,
},
summaryValue: {
margin: "6px 0 0",
fontSize: "25px",
fontWeight: 800,
color: colors.text,
},
panel: {
background: colors.card,
border: `1px solid ${colors.border}`,
borderRadius: "18px",
overflow: "hidden",
boxShadow: "0 5px 20px rgba(15, 23, 42, 0.035)",
},
panelHeader: {
padding: "21px 24px",
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: "15px",
flexWrap: "wrap",
borderBottom: `1px solid ${colors.border}`,
},
panelTitle: {
margin: 0,
fontSize: "17px",
fontWeight: 800,
color: colors.text,
},
panelSubtitle: {
margin: "5px 0 0",
fontSize: "12px",
color: colors.muted,
},
searchWrapper: {
position: "relative",
minWidth: "220px",
maxWidth: "100%",
flex: "0 1 280px",
},
searchIcon: {
position: "absolute",
left: "12px",
top: "50%",
transform: "translateY(-50%)",
color: colors.muted,
pointerEvents: "none",
},
searchInput: {
width: "100%",
boxSizing: "border-box",
padding: "11px 12px 11px 38px",
borderRadius: "10px",
border: `1px solid ${colors.border}`,
background: colors.input,
color: colors.text,
outline: "none",
fontSize: "13px",
},
subjectGrid: {
padding: "22px",
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))",
gap: "18px",
},
subjectCard: {
background: colors.card,
border: `1px solid ${colors.border}`,
borderRadius: "15px",
padding: "19px",
minWidth: 0,
transition: "transform 0.2s ease, box-shadow 0.2s ease",
},
subjectCardTop: {
display: "flex",
justifyContent: "space-between",
alignItems: "flex-start",
gap: "12px",
marginBottom: "17px",
},
subjectIcon: {
width: "44px",
height: "44px",
borderRadius: "12px",
display: "flex",
alignItems: "center",
justifyContent: "center",
background: "rgba(7, 155, 104, 0.11)",
color: colors.green,
},
codeBadge: {
background: "rgba(7, 26, 65, 0.07)",
color: colors.navy,
borderRadius: "7px",
padding: "6px 9px",
fontSize: "11px",
fontWeight: 800,
letterSpacing: "0.4px",
},
subjectName: {
margin: "0 0 7px",
fontSize: "17px",
fontWeight: 800,
color: colors.text,
overflowWrap: "anywhere",
},
description: {
fontSize: "12px",
color: colors.muted,
lineHeight: 1.7,
margin: "0 0 17px",
minHeight: "20px",
overflowWrap: "anywhere",
},
cardFooter: {
borderTop: `1px solid ${colors.border}`,
paddingTop: "14px",
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: "8px",
flexWrap: "wrap",
},
categoryBadge: {
display: "inline-flex",
alignItems: "center",
gap: "5px",
background: "rgba(59, 130, 246, 0.09)",
color: "#3b82f6",
borderRadius: "7px",
padding: "6px 9px",
fontSize: "11px",
fontWeight: 700,
},
compulsoryBadge: {
display: "inline-flex",
alignItems: "center",
gap: "5px",
background: "rgba(7, 155, 104, 0.11)",
color: colors.green,
borderRadius: "7px",
padding: "6px 9px",
fontSize: "11px",
fontWeight: 700,
},
optionalBadge: {
background: "rgba(148, 163, 184, 0.13)",
color: colors.muted,
},
state: {
padding: "55px 20px",
textAlign: "center",
color: colors.muted,
},
stateIcon: {
width: "58px",
height: "58px",
borderRadius: "18px",
background: "rgba(7, 155, 104, 0.09)",
color: colors.green,
display: "flex",
alignItems: "center",
justifyContent: "center",
margin: "0 auto 16px",
},
stateTitle: {
margin: "0 0 8px",
fontSize: "16px",
fontWeight: 800,
color: colors.text,
},
stateText: {
margin: 0,
fontSize: "13px",
lineHeight: 1.6,
},
formOverlay: {
position: "fixed",
inset: 0,
zIndex: 1000,
background: "rgba(7, 26, 65, 0.55)",
backdropFilter: "blur(5px)",
display: "flex",
justifyContent: "center",
alignItems: "center",
padding: "18px",
overflowY: "auto",
},
formModal: {
width: "100%",
maxWidth: "650px",
maxHeight: "92vh",
overflowY: "auto",
background: colors.card,
color: colors.text,
borderRadius: "20px",
border: `1px solid ${colors.border}`,
boxShadow: "0 25px 80px rgba(0, 0, 0, 0.2)",
},
formHeader: {
padding: "23px 25px",
borderBottom: `1px solid ${colors.border}`,
display: "flex",
alignItems: "center",
justifyContent: "space-between",
gap: "12px",
},
formHeaderIcon: {
width: "43px",
height: "43px",
borderRadius: "12px",
display: "flex",
alignItems: "center",
justifyContent: "center",
background: "rgba(7, 155, 104, 0.12)",
color: colors.green,
},
closeButton: {
width: "37px",
height: "37px",
borderRadius: "10px",
border: `1px solid ${colors.border}`,
background: colors.card,
color: colors.text,
cursor: "pointer",
display: "flex",
alignItems: "center",
justifyContent: "center",
},
formBody: {
padding: "24px 25px",
},
formGrid: {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
gap: "19px",
},
formGroup: {
display: "flex",
flexDirection: "column",
gap: "8px",
minWidth: 0,
},
label: {
fontSize: "12px",
fontWeight: 700,
color: colors.text,
},
input: {
width: "100%",
boxSizing: "border-box",
padding: "12px 13px",
borderRadius: "10px",
border: `1px solid ${colors.border}`,
background: colors.input,
color: colors.text,
fontSize: "13px",
outline: "none",
},
textarea: {
width: "100%",
minHeight: "100px",
boxSizing: "border-box",
padding: "12px 13px",
borderRadius: "10px",
border: `1px solid ${colors.border}`,
background: colors.input,
color: colors.text,
fontSize: "13px",
outline: "none",
resize: "vertical",
fontFamily: "inherit",
},
checkboxRow: {
display: "flex",
alignItems: "center",
gap: "12px",
marginTop: "20px",
padding: "14px",
borderRadius: "11px",
border: `1px solid ${colors.border}`,
background: colors.background,
cursor: "pointer",
},
formFooter: {
padding: "18px 25px 23px",
borderTop: `1px solid ${colors.border}`,
display: "flex",
justifyContent: "flex-end",
gap: "10px",
flexWrap: "wrap",
},
alert: {
padding: "13px 16px",
borderRadius: "11px",
marginBottom: "20px",
display: "flex",
alignItems: "center",
gap: "10px",
fontSize: "13px",
fontWeight: 600,
},
};

const loadSubjects = async (showRefresh = false) => {
try {
if (showRefresh) {
setRefreshing(true);
} else {
setLoading(true);
}


  setErrorMessage("");

  const response = await http.get(`/subject/school/${schoolId}`);

  setSubjects(
    response?.data?.subjects ||
      response?.subjects ||
      []
  );
} catch (error) {
  console.error("Failed to load subjects:", error);
  setErrorMessage(
    error?.response?.data?.message ||
      "Unable to load subjects. Please try again."
  );
} finally {
  setLoading(false);
  setRefreshing(false);
}


};

useEffect(() => {
loadSubjects();


const loadTeachers = async () => {
  try {
    const response = await teacherApi.getTeachersBySchool(schoolId);

    console.log(
      "SCHOOL TEACHERS:",
      JSON.stringify(
        response?.data?.teachers ||
          response?.teachers ||
          response?.data ||
          [],
        null,
        2
      )
    );
  } catch (error) {
    console.error("Failed to load school teachers:", error);
  }
};

loadTeachers();


}, []);

const assignEnglishToDiamond = async () => {
try {
const response = await classSubjectApi.createClassSubject({
school: "6a8485d60293d305ecd84878",
academicSession: "6aa71820239080fa23f5f8eb",
class: "6abd82c94e325b2ff4c83ac8",
subject: "6abd987f25da0e9da606322b",
teacher: "6abd820c4e325b2ff4c83abe",
isCompulsory: true,
});


  console.log("CLASS SUBJECT CREATED:", response);
  alert("English assigned to Diamond class successfully");
} catch (error) {
  console.error("FAILED TO ASSIGN SUBJECT:", error);
  alert(
    error?.response?.data?.message ||
      "Failed to assign English to Diamond"
  );
}


};

const handleChange = (e) => {
const { name, value, type, checked } = e.target;


setForm((previous) => ({
  ...previous,
  [name]: type === "checkbox" ? checked : value,
}));
};

const handleSubmit = async (e) => {
e.preventDefault();


try {
  setSaving(true);
  setErrorMessage("");
  setSuccessMessage("");

console.log("API BASE URL:", http.defaults?.baseURL);
console.log("CREATING SUBJECT AT:", `${http.defaults?.baseURL}/subject`);

const response = await http.post("/subject", {
  school: schoolId,
  name: form.name.trim(),
  code: form.code.trim().toUpperCase(),
  category: form.category,
  description: form.description.trim(),
  isCompulsory: form.isCompulsory,
});

console.log("SUBJECT CREATED:", response.data);

  setForm({
    name: "",
    code: "",
    category: "Core",
    description: "",
    isCompulsory: false,
  });

  setShowForm(false);
  setSuccessMessage("Subject created successfully.");

  await loadSubjects();
} catch (error) {
 console.error("FAILED TO CREATE SUBJECT:", error);
console.error("ERROR MESSAGE:", error?.message);
console.error("ERROR RESPONSE:", error?.response);
console.error("REQUEST URL:", error?.config?.baseURL, error?.config?.url);
console.error("HTTP STATUS:", error?.response?.status);
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Failed to create subject.";

  setErrorMessage(message);
} finally {
  setSaving(false);
}


};

const filteredSubjects = subjects.filter((subject) => {
const search = searchTerm.toLowerCase();


return (
  subject.name?.toLowerCase().includes(search) ||
  subject.code?.toLowerCase().includes(search) ||
  subject.category?.toLowerCase().includes(search)
);


});

const coreSubjects = subjects.filter(
(subject) => subject.category === "Core"
).length;

const compulsorySubjects = subjects.filter(
(subject) => subject.isCompulsory
).length;

return ( <div style={styles.page}> <div style={styles.header}> <div style={styles.titleArea}> <div style={styles.titleIcon}> <BookOpen size={27} /> </div>


      <div>
        <h1 style={styles.title}>Subjects</h1>
        <p style={styles.subtitle}>
          Create and manage the subjects offered by your school.
        </p>
      </div>
    </div>

    <div style={styles.headerActions}>
      <button
        type="button"
        onClick={() => loadSubjects(true)}
        disabled={loading || refreshing}
        style={{
          ...styles.button,
          ...styles.secondaryButton,
          opacity: loading || refreshing ? 0.65 : 1,
        }}
      >
        <RefreshCw
          size={16}
          style={{
            animation: refreshing ? "subjectsSpin 1s linear infinite" : "none",
          }}
        />
        {refreshing ? "Refreshing..." : "Refresh"}
      </button>

      <button
        type="button"
        onClick={() => {
          setErrorMessage("");
          setSuccessMessage("");
          setShowForm(true);
        }}
        style={{
          ...styles.button,
          ...styles.primaryButton,
        }}
      >
        <Plus size={17} />
        Add Subject
      </button>
    </div>
  </div>

  {successMessage && (
    <div
      style={{
        ...styles.alert,
        background: "rgba(7, 155, 104, 0.1)",
        color: colors.green,
        border: "1px solid rgba(7, 155, 104, 0.2)",
      }}
    >
      <CheckCircle size={18} />
      <span>{successMessage}</span>
      <button
        type="button"
        onClick={() => setSuccessMessage("")}
        style={{
          marginLeft: "auto",
          border: "none",
          background: "transparent",
          color: "inherit",
          cursor: "pointer",
          display: "flex",
        }}
      >
        <X size={16} />
      </button>
    </div>
  )}

  {errorMessage && (
    <div
      style={{
        ...styles.alert,
        background: "rgba(239, 68, 68, 0.08)",
        color: "#dc2626",
        border: "1px solid rgba(239, 68, 68, 0.2)",
      }}
    >
      <AlertCircle size={18} />
      <span>{errorMessage}</span>
      <button
        type="button"
        onClick={() => setErrorMessage("")}
        style={{
          marginLeft: "auto",
          border: "none",
          background: "transparent",
          color: "inherit",
          cursor: "pointer",
          display: "flex",
        }}
      >
        <X size={16} />
      </button>
    </div>
  )}

  <div style={styles.summaryGrid}>
    <div style={styles.summaryCard}>
      <div
        style={{
          ...styles.summaryIcon,
          background: "rgba(7, 155, 104, 0.11)",
          color: colors.green,
        }}
      >
        <BookOpen size={23} />
      </div>
      <div>
        <p style={styles.summaryLabel}>Total Subjects</p>
        <p style={styles.summaryValue}>
          {loading ? "—" : subjects.length}
        </p>
      </div>
    </div>

    <div style={styles.summaryCard}>
      <div
        style={{
          ...styles.summaryIcon,
          background: "rgba(59, 130, 246, 0.11)",
          color: "#3b82f6",
        }}
      >
        <Layers size={23} />
      </div>
      <div>
        <p style={styles.summaryLabel}>Core Subjects</p>
        <p style={styles.summaryValue}>
          {loading ? "—" : coreSubjects}
        </p>
      </div>
    </div>

    <div style={styles.summaryCard}>
      <div
        style={{
          ...styles.summaryIcon,
          background: "rgba(139, 92, 246, 0.11)",
          color: "#8b5cf6",
        }}
      >
        <GraduationCap size={23} />
      </div>
      <div>
        <p style={styles.summaryLabel}>Compulsory Subjects</p>
        <p style={styles.summaryValue}>
          {loading ? "—" : compulsorySubjects}
        </p>
      </div>
    </div>
  </div>

  <section style={styles.panel}>
    <div style={styles.panelHeader}>
      <div>
        <h2 style={styles.panelTitle}>Subject Directory</h2>
        <p style={styles.panelSubtitle}>
          View all subjects registered for your school.
        </p>
      </div>

      <div style={styles.searchWrapper}>
        <Search size={17} style={styles.searchIcon} />
        <input
          type="search"
          aria-label="Search subjects"
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>
    </div>

    {loading ? (
      <div style={styles.state}>
        <RefreshCw
          size={30}
          style={{
            color: colors.green,
            animation: "subjectsSpin 1s linear infinite",
            marginBottom: "15px",
          }}
        />
        <h3 style={styles.stateTitle}>Loading subjects</h3>
        <p style={styles.stateText}>
          Please wait while we retrieve your subjects.
        </p>
      </div>
    ) : filteredSubjects.length === 0 ? (
      <div style={styles.state}>
        <div style={styles.stateIcon}>
          {searchTerm ? (
            <Search size={27} />
          ) : (
            <FlaskConical size={27} />
          )}
        </div>

        <h3 style={styles.stateTitle}>
          {searchTerm ? "No matching subjects" : "No subjects yet"}
        </h3>

        <p style={styles.stateText}>
          {searchTerm
            ? "Try a different search term."
            : "Start by adding the subjects taught in your school."}
        </p>

        {!searchTerm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            style={{
              ...styles.button,
              ...styles.primaryButton,
              marginTop: "20px",
            }}
          >
            <Plus size={16} />
            Create First Subject
          </button>
        )}
      </div>
    ) : (
      <div style={styles.subjectGrid}>
        {filteredSubjects.map((subject) => (
          <div
            key={subject._id}
            style={styles.subjectCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 12px 28px rgba(15, 23, 42, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={styles.subjectCardTop}>
              <div style={styles.subjectIcon}>
                <BookOpen size={22} />
              </div>

              <span style={styles.codeBadge}>
                {subject.code || "NO CODE"}
              </span>
            </div>

            <h3 style={styles.subjectName}>{subject.name}</h3>

            <p style={styles.description}>
              {subject.description || "No description provided."}
            </p>

            <div style={styles.cardFooter}>
              <span style={styles.categoryBadge}>
                <Layers size={12} />
                {subject.category || "Other"}
              </span>

              <span
                style={{
                  ...styles.compulsoryBadge,
                  ...(subject.isCompulsory
                    ? {}
                    : styles.optionalBadge),
                }}
              >
                {subject.isCompulsory ? (
                  <CheckCircle size={12} />
                ) : null}
                {subject.isCompulsory ? "Compulsory" : "Optional"}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>

  {showForm && (
    <div
      style={styles.formOverlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) {
          setShowForm(false);
        }
      }}
    >
      <div
        style={styles.formModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-subject-title"
      >
        <div style={styles.formHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "13px" }}>
            <div style={styles.formHeaderIcon}>
              <BookOpen size={22} />
            </div>

            <div>
              <h2
                id="add-subject-title"
                style={{
                  margin: 0,
                  fontSize: "19px",
                  fontWeight: 800,
                }}
              >
                Add New Subject
              </h2>
              <p
                style={{
                  margin: "5px 0 0",
                  color: colors.muted,
                  fontSize: "12px",
                }}
              >
                Enter the details for this subject.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(false)}
            disabled={saving}
            aria-label="Close form"
            style={styles.closeButton}
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formBody}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label htmlFor="subject-name" style={styles.label}>
                  Subject Name *
                </label>
                <input
                  id="subject-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Mathematics"
                  required
                  maxLength={100}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="subject-code" style={styles.label}>
                  Subject Code *
                </label>
                <input
                  id="subject-code"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="e.g. MTH"
                  required
                  maxLength={20}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="subject-category" style={styles.label}>
                  Subject Category *
                </label>
                <select
                  id="subject-category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="Core">Core</option>
                  <option value="Science">Science</option>
                  <option value="Arts">Arts</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Vocational">Vocational</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Subject Requirement
                </label>
                <div
                  style={{
                    ...styles.input,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    minHeight: "43px",
                  }}
                >
                  <input
                    id="subject-compulsory"
                    type="checkbox"
                    name="isCompulsory"
                    checked={form.isCompulsory}
                    onChange={handleChange}
                    style={{
                      width: "17px",
                      height: "17px",
                      accentColor: colors.green,
                      cursor: "pointer",
                    }}
                  />
                  <label
                    htmlFor="subject-compulsory"
                    style={{
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    Compulsory subject
                  </label>
                </div>
              </div>

              <div
                style={{
                  ...styles.formGroup,
                  gridColumn: "1 / -1",
                }}
              >
                <label htmlFor="subject-description" style={styles.label}>
                  Description
                </label>
                <textarea
                  id="subject-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe this subject (optional)"
                  maxLength={1000}
                  style={styles.textarea}
                />
              </div>
            </div>
          </div>

          <div style={styles.formFooter}>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              disabled={saving}
              style={{
                ...styles.button,
                ...styles.secondaryButton,
                opacity: saving ? 0.6 : 1,
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{
                ...styles.button,
                ...styles.primaryButton,
                opacity: saving ? 0.7 : 1,
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? (
                <RefreshCw
                  size={16}
                  style={{
                    animation: "subjectsSpin 1s linear infinite",
                  }}
                />
              ) : (
                <Plus size={17} />
              )}
              {saving ? "Creating..." : "Create Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  <style>
    {`
      @keyframes subjectsSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @media (max-width: 600px) {
        .subjects-page {
          padding: 16px !important;
        }
      }
    `}
  </style>
</div>


);
}
