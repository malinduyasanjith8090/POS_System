import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SideBar from "../SideBar/EmployeeSideBar copy";

export default function EmpApprove() {
  // Get employee ID from URL parameters
  const { id } = useParams();
  // State for employee data
  const [employee, setEmployee] = useState(null);
  // State for leave data
  const [leaves, setLeaves] = useState([]);
  // State for loading status
  const [loading, setLoading] = useState(true);

  // Fetch employee and leave data when component mounts
  useEffect(() => {
    // Retrieve employee data from sessionStorage
    const storedEmployee = JSON.parse(sessionStorage.getItem('employee'));
    console.log(storedEmployee);

    if (storedEmployee) {
      setEmployee(storedEmployee);
      
      // Fetch leave requests for the employee
      axios.get(`http://localhost:5000/leave?email=${storedEmployee.email}`)
        .then((res) => {
          setLeaves(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id]);

  // Style definitions
  const containerStyle = {
    padding: "50px",
    marginLeft: "250px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  };

  const thStyle = {
    backgroundColor: "#800000",
    color: "#ffffff",
    padding: "10px",
    textAlign: "left",
  };

  const tdStyle = {
    padding: "10px",
    border: "1px solid #cccccc",
  };

  return (
    <>
      <SideBar />
      <div style={containerStyle}>
        <h1>Employee Profile</h1>
        {/* Display employee profile */}
        {employee ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Field</th>
                <th style={thStyle}>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>Name</td>
                <td style={tdStyle}>{employee.name}</td>
              </tr>
              <tr>
                <td style={tdStyle}>Email</td>
                <td style={tdStyle}>{employee.email}</td>
              </tr>
              <tr>
                <td style={tdStyle}>Mobile No</td>
                <td style={tdStyle}>{employee.mobile}</td>
              </tr>
              <tr>
                <td style={tdStyle}>NIC</td>
                <td style={tdStyle}>{employee.nic}</td>
              </tr>
              <tr>
                <td style={tdStyle}>Designation</td>
                <td style={tdStyle}>{employee.designation}</td>
              </tr>
              <tr>
                <td style={tdStyle}>Employee ID</td>
                <td style={tdStyle}>{employee.empid}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Loading employee details...</p>
        )}

        <h2>Leave Requests</h2>
        {/* Display leave requests */}
        {loading ? (
          <p>Loading leave requests...</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Start Date</th>
                <th style={thStyle}>End Date</th>
                <th style={thStyle}>Reason</th>
                <th style={thStyle}>Approval Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Show "No leave requests" message if empty */}
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan="4" style={tdStyle}>No leave requests found</td>
                </tr>
              ) : (
                // Display leave requests
                leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td style={tdStyle}>{new Date(leave.startdate).toLocaleDateString()}</td>
                    <td style={tdStyle}>{new Date(leave.enddate).toLocaleDateString()}</td>
                    <td style={tdStyle}>{leave.reason}</td>
                    <td style={tdStyle}>{leave.approval}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}