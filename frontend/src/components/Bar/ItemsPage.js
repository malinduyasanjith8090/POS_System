import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { FaPrint } from "react-icons/fa";
import { Modal, Button, Table, Form, Input, Select, message } from "antd";
import { jsPDF } from "jspdf";
import logo from '../../images/company.png';
import SideBar from "../SideBar/BarSideBar";

/**
 * ItemPage Component - Manages bar inventory items
 * Features:
 * - View, add, edit, and delete items
 * - Search functionality
 * - PDF report generation
 * - Form validation
 * - Image URL validation
 */
const ItemPage = () => {
  // Redux dispatch for state management
  const dispatch = useDispatch();
  
  // Component state
  const [itemsData, setItemsData] = useState([]); // Stores all items
  const [popupModal, setPopModal] = useState(false); // Controls modal visibility
  const [editItem, SetEdititem] = useState(null); // Stores item being edited
  const [searchTerm, setSearchTerm] = useState(""); // Stores search term

  /**
   * Fetches all items from the API
   * Manages loading state during API call
   */
  const getAllItems = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("/api/items/get-item");
      setItemsData(data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      console.log(error);
      dispatch({ type: "HIDE_LOADING" });
    }
  };

  // Fetch items on component mount
  useEffect(() => {
    getAllItems();
  }, []);

  /**
   * Handles item deletion
   * @param {object} record - Item to delete
   */
  const handleDelete = async (record) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      await axios.delete(`/api/items/delete-item/${record._id}`);
      message.success("Item Deleted Successfully!");
      getAllItems();
      setPopModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
      message.error("Something Went Wrong!");
    }
  };

  // Filter items based on search term (name or prices)
  const filteredItems = itemsData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.Bprice).includes(searchTerm) ||
    String(item.Sprice).includes(searchTerm) ||
    String(item.price).includes(searchTerm)
  );

  /**
   * Generates a PDF report of items
   * Includes company logo, details, and formatted item table
   */
  const generatePDF = async () => {
    const doc = new jsPDF();

    // Add company logo
    doc.addImage(logo, "PNG", 10, 10, 25, 13);

    // Add company details
    doc.setFontSize(8);
    doc.setTextColor(0);
    doc.text("Your Company Name", 10, 30);
    doc.text("Address: 1234 Event St, City, State, ZIP", 10, 35);
    doc.text("Contact: (123) 456-7890", 10, 40);
    doc.text("Email: info@yourcompany.com", 10, 45);

    // Add centered heading
    doc.setFontSize(18);
    doc.setTextColor(0);
    const headingY = 60;
    doc.text("Item Management", doc.internal.pageSize.getWidth() / 2, headingY, { align: "center" });

    // Draw underline for heading
    const headingWidth = doc.getTextWidth("Item Management");
    const underlineY = headingY + 1;
    doc.setDrawColor(0);
    doc.line(
      (doc.internal.pageSize.getWidth() / 2) - (headingWidth / 2),
      underlineY,
      (doc.internal.pageSize.getWidth() / 2) + (headingWidth / 2),
      underlineY
    );

    // Add line break
    doc.setFontSize(12);
    doc.text("Item List", doc.internal.pageSize.getWidth() / 2, headingY + 10, { align: "center" });

    // Define table columns and rows
    const headers = [
      "No","Name", "Bottle Price", "Shot Price", "Price"
    ];

    const data = filteredItems.map((item, index) => [
      index + 1,
      item.name,
      `$${item.Bprice}`,
      `$${item.Sprice}`,
      `$${item.price}`
    ]);

    // Add the table
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 80, 
      styles: {
        fontSize: 8,
      },
    });

    // Add a professional ending
    const endingY = doc.internal.pageSize.getHeight() - 30;
    doc.setFontSize(10);
    doc.text("Thank you for choosing our services.", doc.internal.pageSize.getWidth() / 2, endingY, { align: "center" });
    doc.text("Contact us at: (123) 456-7890", doc.internal.pageSize.getWidth() / 2, endingY + 10, { align: "center" });

    // Draw page border
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // Save the PDF
    doc.save("items_report.pdf");
  };

  // Table columns configuration
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} width="50" height="50" style={{ borderRadius: "8px" }} />
      ),
    },
    {
      title: "Bottle Price",
      dataIndex: "Bprice",
      render: (price) => `$${price}`
    },
    {
      title: "Shot Price",
      dataIndex: "Sprice",
      render: (price) => `$${price}`
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => `$${price}`
    },
    {
      title: "Action",
      dataIndex: "_id",
      render: (id, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {/* Edit button */}
          <EditOutlined
            style={{ cursor: "pointer", color: "#1890ff" }}
            onClick={() => {
              SetEdititem(record);
              setPopModal(true);
            }}
          />
          {/* Delete button */}
          <DeleteOutlined
            style={{ cursor: "pointer", color: "#ff4d4f" }}
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  /**
   * Handles form submission for adding/editing items
   * @param {object} values - Form values
   */
  const handleSubmit = async (values) => {
    if (editItem === null) {
      // Add new item
      try {
        dispatch({ type: "SHOW_LOADING" });
        const res = await axios.post("/api/items/add-item", values);
        if (res.status === 200) {
          message.success("Item Added Successfully!");
          getAllItems();
          setPopModal(false);
        } else {
          message.error("Failed to add item.");
        }
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        message.error("Something Went Wrong!");
        console.error("Form submission error:", error);
        dispatch({ type: "HIDE_LOADING" });
      }
    } else {
      // Edit existing item
      try {
        dispatch({ type: "SHOW_LOADING" });
        await axios.put("/api/items/edit-item", {
          ...values,
          itemId: editItem._id,
        });

        message.success("Item Updated Successfully!");
        getAllItems();
        setPopModal(false);
        SetEdititem(null);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        message.error("Something Went Wrong!");
        console.log(error);
        dispatch({ type: "HIDE_LOADING" });
      }
    }
  };

  /**
   * Handles price input validation
   * @param {Event} e - Input change event
   */
  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const decimalCount = value.split('.').length - 1;
    if (decimalCount > 1) {
      e.target.value = value.substring(0, value.lastIndexOf('.'));
    } else {
      e.target.value = value;
    }
    return value;
  };

  /**
   * Validates URL format
   * @param {object} _ - Antd form rule object
   * @param {string} value - URL to validate
   */
  const validateUrl = (_, value) => {
    try {
      new URL(value);
      return Promise.resolve();
    } catch (_) {
      return Promise.reject(new Error('Please enter a valid URL'));
    }
  };

  return (
    <>
      {/* Sidebar navigation */}
      <SideBar/>
      
      {/* Page header with search and action buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          marginLeft: "260px",
          marginRight: "20px"
        }}
      >
        <h1>Item List</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          {/* Search input */}
          <Input.Search
            placeholder="Search items"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "250px",
              borderRadius: "5px",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
          
          {/* Add Item button (maroon color) */}
          <Button
            type="primary"
            onClick={() => {
              SetEdititem(null);
              setPopModal(true);
            }}
            style={{
              backgroundColor: "#800000",
              borderColor: "#800000",
              borderRadius: "5px",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            Add Item
          </Button>
          
          {/* Report button (green color) */}
          <Button
            type="primary"
            onClick={generatePDF}
            style={{
              backgroundColor: "#006400",
              borderColor: "#006400",
              borderRadius: "5px",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <FaPrint/> Report
          </Button>
        </div>
      </div>

      {/* Items table */}
      <Table
        columns={columns}
        dataSource={filteredItems}
        bordered
        rowKey="_id"
        sticky
        scroll={{ y: 400 }}
        style={{
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          marginLeft: "260px",
          marginRight: "20px",
          marginTop: "-20px"
        }}
      />

      {/* Add/Edit Item Modal */}
      {popupModal && (
        <Modal
          title={`${editItem !== null ? "Edit Item" : "Add new Item"}`}
          visible={popupModal}
          onCancel={() => {
            SetEdititem(null);
            setPopModal(false);
          }}
          footer={false}
          style={{ borderRadius: "8px" }}
        >
          <Form
            layout="vertical"
            initialValues={editItem || {
              Bprice: '',
              Sprice: '',
              price: '',
              image: ''
            }}
            onFinish={handleSubmit}
          >
            {/* Item Name field */}
            <Form.Item
              name="name"
              label="Name"
              rules={[
                { required: true, message: "Please enter the item name" },
                { min: 3, message: "Name must be at least 3 characters long" },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Bottle Price field */}
            <Form.Item
              name="Bprice"
              label="Bottle Price"
              rules={[
                { required: true, message: "Please enter the bottle price" },
                {
                  pattern: /^\d+(\.\d{1,2})?$/,
                  message: "Please enter a valid number with up to 2 decimal places",
                },
              ]}
              getValueFromEvent={handlePriceChange}
            >
              <Input prefix="" />
            </Form.Item>

            {/* Shot Price field */}
            <Form.Item
              name="Sprice"
              label="Shot Price"
              rules={[
                { required: true, message: "Please enter the shot price" },
                {
                  pattern: /^\d+(\.\d{1,2})?$/,
                  message: "Please enter a valid number with up to 2 decimal places",
                },
              ]}
              getValueFromEvent={handlePriceChange}
            >
              <Input prefix="" />
            </Form.Item>

            {/* Regular Price field */}
            <Form.Item
              name="price"
              label="Price"
              rules={[
                { required: true, message: "Please enter the price" },
                {
                  pattern: /^\d+(\.\d{1,2})?$/,
                  message: "Please enter a valid number with up to 2 decimal places",
                },
              ]}
              getValueFromEvent={handlePriceChange}
            >
              <Input prefix="" />
            </Form.Item>

            {/* Image URL field with validation */}
            <Form.Item
              name="image"
              label="Image URL"
              rules={[
                { required: true, message: "Please enter the image URL" },
                { validator: validateUrl },
              ]}
            >
              <Input 
                placeholder="https://example.com/image.jpg" 
                onKeyDown={(e) => {
                  // Allow shortcuts (Ctrl/Cmd + A, C, V, X) and arrow keys
                  if (!(e.ctrlKey || e.metaKey) && 
                      !['v', 'a', 'c', 'x', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete', 'Backspace', 'Tab'].includes(e.key)) {
                    e.preventDefault();
                    message.warning('Please paste a valid URL instead of typing');
                  }
                }}
                onPaste={(e) => {
                  // Validate immediately after paste
                  setTimeout(() => {
                    const url = e.target.value;
                    try {
                      new URL(url);
                    } catch (_) {
                      message.error('Please paste a valid URL');
                      e.target.value = '';
                    }
                  }, 0);
                }}
              />
            </Form.Item>

            {/* Category selection */}
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select>
                <Select.Option value="alcoholicBeverages">
                  Alcoholic Beverages
                </Select.Option>
                <Select.Option value="beer">Beer</Select.Option>
                <Select.Option value="wine">Wine</Select.Option>
                <Select.Option value="nonAlcoholicBeverages">
                  Non-Alcoholic Beverages
                </Select.Option>
                <Select.Option value="cocktails">Cocktails</Select.Option>
                <Select.Option value="juice">Juice</Select.Option>
                <Select.Option value="tobacco">Tobacco</Select.Option>
                <Select.Option value="snacks">Snacks</Select.Option>
              </Select>
            </Form.Item>

            {/* Form action buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <Button type="primary" htmlType="submit">
                {editItem ? "Update" : "Add"}
              </Button>
              <Button onClick={() => setPopModal(false)}>Cancel</Button>
            </div>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default ItemPage;