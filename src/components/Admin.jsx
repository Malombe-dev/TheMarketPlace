import React, { useEffect, useState } from "react";
import axios from "axios";

function Admin() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("https://vmalombe.pythonanywhere.com/students", {
        withCredentials: true,
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students", error);
    }
  };

  const markPresent = async (id) => {
    try {
      await axios.put(`https://vmalombe.pythonanywhere.com/students/${id}/present`, {}, {
        withCredentials: true,
      });
      fetchStudents();
    } catch (error) {
      console.error("Failed to mark present", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Admin - Student Attendance</h3>
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Reg. Number</th>
                <th>Course</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>{student.name}</td>
                    <td>{student.regNumber}</td>
                    <td>{student.course}</td>
                    <td>
                      <span className={`badge ${student.status === "Present" ? "bg-success" : "bg-secondary"}`}>
                        {student.status || "Absent"}
                      </span>
                    </td>
                    <td>
                      {student.status !== "Present" && (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => markPresent(student.id)}
                        >
                          Mark Present
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Admin;
