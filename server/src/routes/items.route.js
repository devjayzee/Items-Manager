import { Router } from "express";
const ItemRoutes = Router();

let items = [];
let current_id = 1;

ItemRoutes.get("/", (req, res) => {
    res.json(items);
});

ItemRoutes.post("/", (req, res) => {
    const { name } = req.body;

    if(!name){
        return res.status(400).json({ message: "Name is required" });
    }

    const new_item = { id: current_id++, name };
    items.push(new_item);
    res.status(200).json(new_item);
});

ItemRoutes.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const parsed_id = parseInt(id);

    if(!parsed_id && !name){
        return res.status(400).json({ message: "Name and ID is required" });
    }

    items = items.map(item => {
        if(item.id === parsed_id){
            item.name = name;
        }

        return item;
    });

    res.status(200).json({ id: parsed_id, name });
});

ItemRoutes.delete("/:id", (req, res) => {
    const { id } = req.params;
    const parsed_id = parseInt(id);

    if(!parsed_id){
        return res.status(400).json({ message: "ID is required" });
    }

    items = items.filter(item => item.id !== parsed_id);

    res.status(200).json({ id: parsed_id });
});
export default ItemRoutes;