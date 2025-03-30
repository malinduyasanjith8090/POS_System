import React, { useEffect, useState } from 'react';
import './IncomeTable.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaEdit, FaTrash, FaPlus, FaDownload } from 'react-icons/fa';
import SideBar from '../../components/SideBar/FinanceSideBar';
import logo from '../../images/company.png';

const IncomeTable = () => {
  const navigate = useNavigate();
  const [statement, setStatement] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    sales: '',
    costofsales: '',
    grossprofit: '',
    otherincomes: '',
    deliverycost: '',
    administrativecost: '',
    otherexpences: '',
    financeexpences: '',
    netprofit: '',
  });

  useEffect(() => {
    fetchStatement();
  }, []);

  const fetchStatement = async () => {
    try {
      const response = await axios.get('http://localhost:5000/finance/income');
      if (response.data.length > 0) {
        setStatement(response.data[0]);
        setFormData(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching income statement:', error);
    }
  };

  const handleAdd = () => {
    navigate('/finance/incomeform');
  };

  const handleUpdate = () => {
    setIsUpdating(true);
  };

  const handleDelete = async () => {
    if (!statement) return;
    try {
      await axios.delete(`http://localhost:5000/finance/income/delete/${statement._id}`);
      alert('Income statement deleted successfully');
      setStatement(null);
    } catch (error) {
      console.error('Error deleting income statement:', error);
      alert('Failed to delete income statement');
    }
  };

  const handleDownload = async () => {
    const input = document.getElementById('statement-table');
    if (!input) return;

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();

    pdf.rect(5, 5, pdf.internal.pageSize.width - 10, pdf.internal.pageSize.height - 10);
    pdf.addImage(logo, 'PNG', 10, 10, 25, 12);

    const rightAlignText = (pdf, text, y) => {
      const pageWidth = pdf.internal.pageSize.width;
      const textWidth = pdf.getStringUnitWidth(text) * pdf.getFontSize() / pdf.internal.scaleFactor;
      const xPosition = pageWidth - textWidth - 10;
      pdf.text(text, xPosition, y);
    };

    pdf.setFontSize(8);
    rightAlignText(pdf, 'Cinnamon Red Hotel', 12);
    rightAlignText(pdf, 'Email: contact@cinnamonred.com', 17);
    rightAlignText(pdf, 'Contact: +1 234 567 890', 23);

    pdf.setFontSize(20);
    pdf.text('Financial Statement', pdf.internal.pageSize.width / 2, 55, { align: 'center' });

    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let position = 70;
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    pdf.setDrawColor(169, 169, 169);
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(10, position - 5, imgWidth, imgHeight + 10, 5, 5);

    const thankYouMessage = 'Thank you for doing business with us!';
    pdf.setFontSize(8);
    const yPosition = pdf.internal.pageSize.height - 20;
    pdf.text(thankYouMessage, pdf.internal.pageSize.width / 2, yPosition, { align: 'center' });

    pdf.save('Income_Statement.pdf');
  };

  const calculateTotal = () => {
    if (!statement) return { totalCosts: 0, totalProfits: 0, netTotal: 0 };
    const totalCosts = Number(statement.costofsales) + Number(statement.deliverycost) + Number(statement.administrativecost) + Number(statement.otherexpences) + Number(statement.financeexpences);
    const totalProfits = Number(statement.sales) + Number(statement.otherincomes) + Number(statement.grossprofit) + Number(statement.netprofit);
    const netTotal = totalProfits - totalCosts;
    return { totalCosts, totalProfits, netTotal };
  };

  const totals = calculateTotal();

  const handleUpdateSuccess = async () => {
    try {
      await axios.put(`http://localhost:5000/finance/income/update/${statement._id}`, formData);
      alert('Income statement updated successfully');
      setIsUpdating(false);
      fetchStatement();
    } catch (error) {
      console.error('Error updating income statement:', error);
      alert('Failed to update income statement');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <SideBar />
      <div className="income-table-container">
        <h2 className="statement-header">Income and Expenditure Statement</h2>
        <div className="statement-buttons">
          {!statement && (
            <button className="button add-btn" onClick={handleAdd}>
              <FaPlus style={{ marginRight: '8px' }} /> Add
            </button>
          )}
          {statement && !isUpdating && (
            <>

              <div className="action-buttons">
                <button className="button delete-btn" onClick={handleDelete}>
                  <FaTrash style={{ marginRight: '8px' }} /> Delete
                </button>
                <button className="button download-btn" onClick={handleDownload}>
                  <FaDownload style={{ marginRight: '8px' }} /> Download PDF
                </button>
              </div>
            </>
          )}
        </div>
        <br />

        {isUpdating ? (
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateSuccess(); }} className="update-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9', width: "600px", marginLeft: "300px" }}>
            <h3>Update Income Statement</h3>
            {Object.keys(formData).map((key) => (
              <div key={key} className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor={key} style={{ marginBottom: '8px', fontWeight: 'bold' }}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleFormChange}
                  required
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
                />
              </div>
            ))}
            <button type="submit" className="button" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Update</button>
            <button type="button" className="button cancel-btn" onClick={() => setIsUpdating(false)} style={{ backgroundColor: '#dc3545', color: '#fff', padding: '10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
              Cancel
            </button>
          </form>
        ) : statement ? (
          <div className="statement-content">
            <table id="statement-table" className="income-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Cost</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="description">Sales</td>
                  <td></td>
                  <td className="amount">{statement.sales}</td>
                </tr>
                <tr>
                  <td className="description">Cost of Sales</td>
                  <td className="amount">{statement.costofsales}</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="description">Gross Profit</td>
                  <td></td>
                  <td className="amount">{statement.grossprofit}</td>
                </tr>
                <tr>
                  <td className="description">Other Incomes</td>
                  <td></td>
                  <td className="amount">{statement.otherincomes}</td>
                </tr>
                <tr>
                  <td className="description">Delivery Cost</td>
                  <td className="amount">{statement.deliverycost}</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="description">Administrative Cost</td>
                  <td className="amount">{statement.administrativecost}</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="description">Other Expenses</td>
                  <td className="amount">{statement.otherexpences}</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="description">Finance Expenses</td>
                  <td className="amount">{statement.financeexpences}</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="description">Net Profit</td>
                  <td></td>
                  <td className="amount">{statement.netprofit}</td>
                </tr>
                <tr>
                  <td className="description">Total Costs</td>
                  <td className="amount">{totals.totalCosts}</td>
                  <td></td>
                </tr>
                {/* <tr>
                  <td className="description">Total Profits</td>
                  <td></td>
                  <td className="amount">{totals.totalProfits}</td>
                </tr>
                <tr>
                  <td className="description">Net Total</td>
                  <td></td>
                  <td className="amount">{totals.netTotal}</td>
                </tr> */}
              </tbody>
            </table>
          </div>
        ) : (
          <div>No income statement found.</div>
        )}
      </div>
    </>
  );
};

export default IncomeTable;
