import React, { useState } from "react";


const UserCalendarsForm = ({ calendars, onChangeColor, onDelete, onChangeName }) => {
    const [editedName, setEditedName] = useState("");

    const handleNameChange = (event) => {
        setEditedName(event.target.value);
    };

    const handleSaveName = (calendarId) => {
        onChangeName(calendarId, editedName);
        setEditedName("");
    };

    return (
        <div>
            <h2>User Calendars</h2>
            <ul>
                {calendars.map((calendar) => (
                    <li key={calendar.id}>
                        <span>{calendar.name}</span>
                        <input
                            type="color"
                            value={calendar.color}
                            onChange={(e) => onChangeColor(calendar.id, e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Enter new name"
                            value={editedName}
                            onChange={handleNameChange}
                        />
                        <button onClick={() => handleSaveName(calendar.id)}>Save</button>
                        <button onClick={() => onDelete(calendar.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserCalendarsForm;
