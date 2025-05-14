import { Router } from "express";

/**
 * Router instance for handling item-related routes
 */
const ItemRoutes = Router();

/**
 * In-memory storage for items
 */
let items = [];

/**
 * Counter for generating unique item IDs
 */
let current_id = 1;

/**
 * GET /api/items
 * Retrieve all items
 */
ItemRoutes.get("/", (req, res) => {
    try{
        res.status(200).json(items);
    }
    catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

/**
 * POST /api/items
 * Create a new item
 */
ItemRoutes.post("/", (req, res) => {
    try{
        const { name } = req.body;

        if(!name || typeof name !== 'string' || name.trim().length === 0){
            return res.status(400).json({ message: "Valid name is required" });
        }

        const new_item = { 
            id: current_id++, 
            name: name.trim(),
            created_at: new Date().toISOString()
        };

        items.push(new_item);
        res.status(201).json(new_item);
    }
    catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

/**
 * PUT /api/items/:id
 * Update an existing item
 * @route {PUT} /:id
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Item ID
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - New name for the item
 * @returns {Object} Updated item
 */
ItemRoutes.put("/:id", (req, res) => {
    try{
        const { id } = req.params;
        const { name } = req.body;
        const parsed_id = parseInt(id);

        if(!parsed_id || isNaN(parsed_id)){
            return res.status(400).json({ message: "Valid ID is required" });
        }

        if(!name || typeof name !== 'string' || name.trim().length === 0){
            return res.status(400).json({ message: "Valid name is required" });
        }

        const item_index = items.findIndex(item => item.id === parsed_id);
        
        if(item_index === -1){
            return res.status(404).json({ message: "Item not found" });
        }

        const updated_item = {
            ...items[item_index],
            name: name.trim(),
            updated_at: new Date().toISOString()
        };

        items[item_index] = updated_item;
        res.status(200).json(updated_item);
    }
    catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

/**
 * DELETE /api/items/:id
 * Delete an item
 * @route {DELETE} /:id
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Item ID to delete
 * @returns {Object} Deleted item ID
 */
ItemRoutes.delete("/:id", (req, res) => {
    try{
        const { id } = req.params;
        const parsed_id = parseInt(id);

        if(!parsed_id || isNaN(parsed_id)){
            return res.status(400).json({ message: "Valid ID is required" });
        }

        const item_index = items.findIndex(item => item.id === parsed_id);
        
        if(item_index === -1){
            return res.status(404).json({ message: "Item not found" });
        }

        const deleted_item = items[item_index];
        items = items.filter(item => item.id !== parsed_id);

        res.status(200).json(deleted_item);
    }
    catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

export default ItemRoutes;