import ResItem from '../models/ResitemModel.js';

// Add new restaurant item
export const addItemController = async (req, res) => {
  try {
    const newItem = new ResItem(req.body);
    await newItem.save();
    res.status(200).send({
      success: true,
      message: "Item added successfully",
      data: newItem
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to add item",
      error: error.message
    });
  }
};

// Get all restaurant items
export const getItemController = async (req, res) => {
  try {
    const items = await ResItem.find({});
    res.status(200).send({
      success: true,
      message: "Items fetched successfully",
      data: items
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to get items",
      error: error.message
    });
  }
};

// Edit restaurant item
export const editItemController = async (req, res) => {
  const { itemId, ...updateData } = req.body;
  try {
    const updatedItem = await ResItem.findByIdAndUpdate(
      itemId,
      updateData,
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).send({
        success: false,
        message: "Item not found"
      });
    }
    res.status(200).send({
      success: true,
      message: "Item updated successfully",
      data: updatedItem
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to update item",
      error: error.message
    });
  }
};

// Delete restaurant item
export const deleteItemController = async (req, res) => {
  const itemId = req.params.id;
  try {
    const item = await ResItem.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(404).send({
        success: false,
        message: "Item not found"
      });
    }
    res.status(200).send({
      success: true,
      message: "Item deleted successfully",
      data: item
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to delete item",
      error: error.message
    });
  }
};