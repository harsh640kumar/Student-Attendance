import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showLow, setShowLow] = useState(false);

  // Fetch students
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => {
        // Add random attendance %
        const updated = data.map(student => ({
          ...student,
          attendance: Math.floor(Math.random() * 101)
        }));
        setStudents(updated);
      });
  }, []);

  // Filter logic
  const filteredStudents = students.filter(student => {
    if (filter === "present") return student.attendance >= 75;
    if (filter === "absent") return student.attendance < 75;
    return true;
  }).filter(student => {
    if (showLow) return student.attendance < 75;
    return true;
  });

  // Sort (bonus)
  const sortedStudents = [...filteredStudents].sort(
    (a, b) => b.attendance - a.attendance
  );

  return (
  <div className="container">
    <h1>🎓 Student Attendance Dashboard</h1>

    {/* Controls */}
    <div className="controls">
      <div className="buttons">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("present")}>Present</button>
        <button onClick={() => setFilter("absent")}>Absent</button>
      </div>

      <label className="toggle">
        <input
          type="checkbox"
          checked={showLow}
          onChange={() => setShowLow(!showLow)}
        />
        Show &lt; 75%
      </label>
    </div>

    {/* Table */}
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Attendance</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {sortedStudents.map(student => {
            const isLow = student.attendance < 75;

            return (
              <tr
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className={
                  selectedStudent?.id === student.id ? "selected" : ""
                }
              >
                <td>{student.name}</td>

                <td>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{
                        width: `${student.attendance}%`,
                        backgroundColor: isLow ? "#ef4444" : "#22c55e"
                      }}
                    ></div>
                  </div>
                  {student.attendance}%
                </td>

                <td>
                  <span className={isLow ? "badge red" : "badge green"}>
                    {isLow ? "Low" : "Good"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);
}

export default App;