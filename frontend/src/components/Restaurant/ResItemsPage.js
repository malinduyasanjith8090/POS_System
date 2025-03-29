import React, { useEffect, useState } from "react";
import DefaultLayout from "../../components/SideBar/ResSideBar";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { Modal, Button, Table, Form, Input, Select, message } from "antd";

const ResItemsPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [popupModal, setPopModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();

  // Fetch all items
  const getAllItems = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("/api/Res/res-items/get-res-item");
      if (data.success) {
        setItemsData(data.data);
      } else {
        message.error(data.message);
        setItemsData([]);
      }
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch items");
      setItemsData([]);
      dispatch({ type: "HIDE_LOADING" });
    }
  };

  useEffect(() => {
    getAllItems();
  }, []);

  // Handle delete item
  const handleDelete = async (record) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.delete(`/api/Res/res-items/delete-item/${record._id}`);
      if (data.success) {
        message.success("Item Deleted Successfully!");
        getAllItems();
      } else {
        message.error(data.message);
      }
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
      message.error(error.response?.data?.message || "Something Went Wrong!");
    }
  };

  // Filter items based on search term
  const filteredItems = itemsData.filter((item) =>
    item?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  // Handle form submit for adding/editing items
  const handleSubmit = async (values) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      
      if (editItem) {
        // Edit existing item
        const { data } = await axios.put("/api/Res/res-items/edit-res-item", {
          ...values,
          itemId: editItem._id,
        });
        
        if (data.success) {
          message.success("Item Updated Successfully!");
          getAllItems();
          setPopModal(false);
          setEditItem(null);
          form.resetFields();
        } else {
          message.error(data.message);
        }
      } else {
        // Add new item
        const { data } = await axios.post("/api/Res/res-items/add-res-item", values);
        
        if (data.success) {
          message.success("Item Added Successfully!");
          getAllItems();
          setPopModal(false);
          form.resetFields();
        } else {
          message.error(data.message);
        }
      }
      
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error(error.response?.data?.message || "Something Went Wrong!");
      console.error("Form submission error:", error);
    }
  };

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img 
          src={image} 
          alt={record.name} 
          width="50" 
          height="50" 
          style={{ borderRadius: "8px" }} 
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => `Rs.${price.toFixed(2)}`,
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Meal Time",
      dataIndex: "mealTime",
    },
    {
      title: "Ingredients",
      dataIndex: "ingredients",
      ellipsis: true,
    },
    {
      title: "Action",
      dataIndex: "_id",
      render: (id, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <EditOutlined
            style={{ cursor: "pointer", color: "#1890ff" }}
            onClick={() => {
              setEditItem(record);
              form.setFieldsValue(record);
              setPopModal(true);
            }}
          />
          <DeleteOutlined
            style={{ cursor: "pointer", color: "#ff4d4f" }}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Item List</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <Input.Search
            placeholder="Search items"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "250px",
              borderRadius: "5px",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Button
            type="primary"
            onClick={() => {
              setEditItem(null);
              form.resetFields();
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
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredItems}
        bordered
        rowKey="_id"
        style={{
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      />

      <Modal
        title={`${editItem ? "Edit Item" : "Add New Item"}`}
        visible={popupModal}
        onCancel={() => {
          setEditItem(null);
          form.resetFields();
          setPopModal(false);
        }}
        footer={false}
        destroyOnClose
        style={{ borderRadius: "8px" }}
      >
        <Form
          form={form}
          initialValues={editItem || {}}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item 
            label="Name" 
            name="name" 
            rules={[{ required: true, message: 'Please enter item name' }]}
          >
            <Input placeholder="Enter item name" />
          </Form.Item>
          
          <Form.Item 
            label="Price" 
            name="price" 
            rules={[{ 
              required: true, 
              message: 'Please enter price' 
            }]}
          >
            <Input type="number" placeholder="Enter price" />
          </Form.Item>
          
          <Form.Item 
            label="Image URL" 
            name="image" 
            rules={[{ 
              required: true, 
              message: 'Please enter image URL' 
            }]}
          >
            <Input placeholder="Enter image URL" />
          </Form.Item>
          
          <Form.Item 
            label="Category" 
            name="category" 
            rules={[{ 
              required: true, 
              message: 'Please select category' 
            }]}
          >
            <Select
              placeholder="Select category"
              options={[
                { value: "Salad", label: "Salad" },
                { value: "Soup", label: "Soup" },
                { value: "Sandwiches and Burgers", label: "Sandwiches and Burgers" },
                { value: "Western", label: "Western" },
                { value: "Asian", label: "Asian" },
                { value: "Desserts", label: "Desserts" },
              ]}
            />
          </Form.Item>
          
          <Form.Item 
            label="Meal Time" 
            name="mealTime" 
            rules={[{ 
              required: true, 
              message: 'Please select meal time' 
            }]}
          >
            <Select
              placeholder="Select meal time"
              options={[
                { value: "Food Menu", label: "Food Menu" },
                { value: "Beverages Menu", label: "Beverages Menu" },
              ]}
            />
          </Form.Item>
          
          <Form.Item 
            label="Ingredients" 
            name="ingredients" 
            rules={[{ 
              required: true, 
              message: 'Please enter ingredients' 
            }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Enter ingredient description" 
            />
          </Form.Item>
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#800000",
                borderColor: "#800000",
                borderRadius: "5px",
                width: "100%",
              }}
            >
              {editItem ? "Update" : "Add Item"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default ResItemsPage;