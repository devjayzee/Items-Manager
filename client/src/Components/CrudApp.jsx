import {useState, useEffect } from "react";
import axios from 'axios';
import './CrudApp.css';

/**
 * CrudApp Compenent - A simple CRUD Application managing items
 */
function CrudApp(){
    const [items, setItems] = useState([]);
    const [input, setinput] = useState([]);
    const [is_editing, setIsEdting] = useState(false);
    const [editing_item, setEditingItem] = useState({});
    const [error, setError] = useState('');

    /**
     * This useEffect will trigger the fetching of items.
     */
    useEffect(() => {
        fetchItems();
    }, []);
    
    /**
     * Send an API request to the Backend to fetch the items.
     */
    const fetchItems = async() => {
        try{
            const response = await axios.get('http://localhost:8000/api/items');
            setItems(response.data);
        }
        catch(error){
            setError('Failed to fetch items.');
            console.log('Error fetching items:', error);
        }
    };

    /**
     * This function will handle the adding of new item.
     */
    const handleAddItem = async() => {
        if(!input.trim()){
            setError('Enter an item name');
            return;
        }

        try{
            const response = await axios.post('http://localhost:8000/api/items', {name: input});

            setItems(prev_items => [...prev_items, response.data]);
            setinput('');
            setError('');
        }
        catch(error){
            setError('Failed to add an items.');
            console.log('Error adding an items:', error);
        }
    };

    /**
     * This function will handle the setting up the edit mode for an item.
     * @param {Object} item - contains the id and name of the item to be updated
     */
    const handleEditItem = (item) => {
        setinput(item.name);
        setIsEdting(true);
        setEditingItem(item);
    };

    /**
     * This function will handle sending an API request for updating an item.
     */
    const handleUpdateItem = async() => {
        if(!input.trim() && editing_item.id){
            setError('Enter an item name');
            return;
        }

        try{
            const response = await axios.put(`http://localhost:8000/api/items/${editing_item.id}`, {name: input});
            
            setItems(prev_items => prev_items.map(item => item.id === response.data.id ? { ...item, name: response.data.name} : item));
            setIsEdting(false);
            setEditingItem({});
            setinput('');
            setError('');
        }
        catch(error){
            setError('Failed to update an item.');
            console.log('Error updating an item:', error);
        }
    };


    /**
     * This function will handle sending an API request for deleting an item.
     * @param {Object} item - contains the id of the item to be deleted
     */
    const handleDeleteItem = async(item) => {
        if(!item.id){
            return;
        }

        try{
            const response = await axios.delete(`http://localhost:8000/api/items/${item.id}`);

            setItems(prev_items => prev_items.filter(item => item.id !== response.data.id));
        }
        catch(error){
            setError('Failed to delete n item.');
            console.log('Error deleting an item:', error);
        }
    };

    return (
        <div className="crud-container">
            <h1 className="crud-title">Item Manager</h1>

            <div className="input-container">
                <input
                    className="crud-input"
                    type="text"
                    value={input}
                    placeholder="Enter an item"
                    onChange={(event) => setinput(event.target.value)}
                />
                <button 
                    className={`crud-button ${is_editing ? 'update' : 'add'}`}
                    onClick={is_editing ? handleUpdateItem : handleAddItem}
                >
                    {is_editing ? "Update" : "Add"}
                </button>
            </div>

            {error && 
                <div className="error-message">{error}</div>
            }

            <ul className="items-list">
                {items.map(item => (
                    <li key={item.id} className="items-card">
                        <span className="item-name">{item.name}</span>
                        <div className="button-group">
                            <button className="crud-button edit" onClick={() => handleEditItem(item)}>Edit</button>
                            <button className="crud-button delete" onClick={() => handleDeleteItem(item)}>Delete</button>
                        </div>
                    </li>
                ))
                }
            </ul>
        </div>
    );
}

export default CrudApp