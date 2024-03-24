import React, { useState, useEffect } from "react";

const UserCalendarsForm = ({ calendars, onChangeColor, onDelete, onChangeName }) => {
    const [selectedCalendarId, setSelectedCalendarId] = useState("");
    const [calendarName, setCalendarName] = useState("");
    const [calendarColor, setCalendarColor] = useState("");

    useEffect(() => {
        const selectedCalendar = calendars.find(calendar => calendar.id === selectedCalendarId);
        if (selectedCalendar) {
            setCalendarName(selectedCalendar.name);
            setCalendarColor(selectedCalendar.color);
        }
    }, [calendars, selectedCalendarId]);

    const handleCalendarChange = (event) => {
        setSelectedCalendarId(event.target.value);
    };

    const handleNameChange = (event) => {
        setCalendarName(event.target.value);
        onChangeName(selectedCalendarId, event.target.value);
    };

    const handleColorChange = (event) => {
        setCalendarColor(event.target.value);
        onChangeColor(selectedCalendarId, event.target.value);
    };

    const handleDelete = () => {
        onDelete(selectedCalendarId);
        setSelectedCalendarId(""); // Скидаємо обраний календар після видалення
    };

    return (
        <div>
            <h2>User Calendars</h2>
            <select value={selectedCalendarId} onChange={handleCalendarChange}>
                <option value="">Select a calendar</option>
                {calendars.map((calendar) => (
                    <option key={calendar.id} value={calendar.id}>{calendar.name}</option>
                ))}
            </select>
            {selectedCalendarId && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter new name"
                        value={calendarName}
                        onChange={handleNameChange}
                    />
                    <input
                        type="color"
                        value={calendarColor}
                        onChange={handleColorChange}
                    />
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    );
};

export default UserCalendarsForm;
