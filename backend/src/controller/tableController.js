import Table from '../models/tableModel.js'; // Default export

// Add Table
export const addTableController = async (req, res) => {
  try {
    const newTable = new Table(req.body);
    await newTable.save();
    res.status(200).send("Table added successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to add table");
  }
};

// Get All Tables
export const getTablesController = async (req, res) => {
  try {
    const tables = await Table.find({});
    res.status(200).send(tables);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to get tables");
  }
};

// Book/Edit Table
export const bookTableController = async (req, res) => {
  const { tableId } = req.params;
  const { name, email, contactNumber, date, time } = req.body;
  try {
    const updatedTable = await Table.findByIdAndUpdate(
      tableId,
      {
        isBooked: true,
        customer: { name, email, contactNumber, date, time },
      },
      { new: true }
    );
    if (!updatedTable) {
      return res.status(404).send("Table not found");
    }
    res.status(200).send("Table booked successfully");
  } catch (error) {
    res.status(500).send("Failed to book table");
  }
};

// Delete Table
export const deleteTableController = async (req, res) => {
  const tableId = req.params.id;
  try {
    const table = await Table.findByIdAndDelete(tableId);
    if (!table) {
      return res.status(404).send("Table not found");
    }
    res.status(200).send({ message: "Table deleted successfully", table });
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to delete table");
  }
};