import React from "react";
import { Link } from "react-router-dom";
import logo from '../../images/company.png'

function SideBar() {
  const hoverStyle = {       // Style applied when a link is hovered
    backgroundColor: '#b30000',  // Darker red for hover
    color: '#fff',
    transform: 'scale(1.05)',
  };

  const defaultStyle = {    // Default style for all sidebar links
    display: 'block',
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: '#444444',  // Dark gray background for default state
    borderRadius: '5px',
    color: '#fff',  // White text
    textDecoration: 'none',
    transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.3s ease',
  };

  const activeStyle = {  // Style to indicate an active link (not currently in use)
    ...defaultStyle,
    backgroundColor: '#800000',  // Maroon for active
    color: '#fff',
  };

  const disabledStyle = {       //Style for disabled link (currently not used)
    ...defaultStyle,
    backgroundColor: '#666666',  // Medium gray for disabled
    color: '#ccc',  // Light gray text for disabled
    pointerEvents: 'none',
    cursor: 'not-allowed',
  };

  const logoStyle = {      // Style for the sidebar logo text
    color: '#fff',
    textAlign: 'center',  // Center align text
    lineHeight: '1.5',
    margin: '20px auto',  // Center the logo with margin
    fontSize: '1.5em',  // Increased text size
  };

  const redTextStyle = {   // Red colored large "POS" text in logo
    color: 'red',
    fontSize: '2.5em',  // Larger text size for better visibility
  };

  const titleBarStyle = {   // Title bar style at the top of the page
    backgroundColor: '#1a1a1a',  // Match sidebar color
    padding: '10px',  // Increased padding for better appearance
    margin: 0,
    width: 'calc(100% - 250px)',        // Full width minus sidebar width
    position: 'fixed',
    top: 0,                             // Align with the top of the viewport
    left: '250px',                      // Position to the right of the sidebar
    boxSizing: 'border-box',
    textAlign: 'center',               // Center the title text
    color: '#fff',                    // White text for contrast on dark background
    borderBottom: '1px solid #333',   // Optional: darker gray border at the bottom for better contrast
  };

  const contentStyle = {
    marginTop: '60px',              // Gap between the title bar and content
    padding: '20px',                // Additional padding around the content
  };

  return (
    <div>
      {/* Sidebar */}
      <div style={{ width: '250px', height: '100vh', backgroundColor: '#1a1a1a', padding: '15px', position: 'fixed', top: 0, left: 0 }}>
        <div style={logoStyle}>
        <br />
          <span style={redTextStyle}>POS</span> <br />
          System
        </div>
        <ul style={{ listStyleType: 'none', padding: '30px 0 0 0' }}>
          <li>
            <Link
              to="/finance/dashboard"
              style={defaultStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, defaultStyle);
              }}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/finance/statement"
              style={defaultStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, defaultStyle);
              }}
            >
              Finance Document
            </Link>
          </li>
          {/* <li>
            <Link
              to="/finance/pettycash"
              style={defaultStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, defaultStyle);
              }}
            >
              Petty Cash Stateme
            </Link>
          </li> */}

          <li>
            <Link
              to="/adminpannel"  // Link to Dashboard page on Log Out
              style={defaultStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, defaultStyle);
              }}
            >
              Log Out
            </Link>
          </li>
        </ul>
      </div>

      {/* Header Title Bar */}
      <div style={titleBarStyle}>
        <h1 style={{ margin: 0, padding: 0 }}>Welcome to Admin Pannel</h1>
      </div>


    </div>
  );
}

export default SideBar;
