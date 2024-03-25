import React, { useState, useEffect } from "react";


export const UserCalendarsForm = ({ calendars, onChangeColor, onDelete, onChangeName }) => {
    const [selectedCalendarId, setSelectedCalendarId] = useState("");
    const [calendarName, setCalendarName] = useState("");
    const [calendarColor, setCalendarColor] = useState("");
    const [calendarUsers, setCalendarUsers] = useState([]);
    const [newUserAccess, setNewUserAccess] = useState("");
    const [accessLevel, setAccessLevel] = useState("");
    const [accessLevels, setAccessLevels] = useState([
        { level: 1, label: "Read" },
        { level: 2, label: "Write" },
        { level: 3, label: "Edit" },
        { level: 4, label: "Admin" }
    ]);

    useEffect(() => {
        const selectedCalendar = calendars.find(calendar => calendar.id === selectedCalendarId);
        if (selectedCalendar) {
            setCalendarName(selectedCalendar.name);
            setCalendarColor(selectedCalendar.color);
            fetchCalendarUsers(selectedCalendarId);
        }
    }, [calendars, selectedCalendarId]);

    const fetchCalendarUsers = async (calendarId) => {
        try {
            const response = await fetch(`/api/calendar/details/${calendarId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch calendar users');
            }
            const data = await response.json();
            setCalendarUsers(data.userAccess);
        } catch (error) {
            console.error("Error fetching calendar users:", error);
        }
    };

    const handleCalendarChange = (event) => {
        setSelectedCalendarId(event.target.value);
    };

    const handleNameChange = async (event) => {
        const newName = event.target.value;
        setCalendarName(newName);
        try {
            const response = await fetch(`/api/calendar/${selectedCalendarId}/name`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newName }),
            });
            if (!response.ok) {
                throw new Error('Failed to update calendar name');
            }
        } catch (error) {
            console.error('Error updating calendar name:', error.message);
        }
    };

    const handleColorChange = async (event) => {
        const newColor = event.target.value;
        setCalendarColor(newColor);
        try {
            const response = await fetch(`/api/calendar/${selectedCalendarId}/color`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ color: newColor }),
            });
            if (!response.ok) {
                throw new Error('Failed to update calendar color');
            }
        } catch (error) {
            console.error('Error updating calendar color:', error.message);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/calendar/${selectedCalendarId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete calendar');
            }
            setSelectedCalendarId("");
        } catch (error) {
            console.error('Error deleting calendar:', error.message);
        }
    };

    const handleAddUserAccess = async () => {
        try {
            // Implement adding user access logic here
            const response = await fetch(`/api/calendar/${selectedCalendarId}/addUserAccess`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: newUserAccess, accessLevel: accessLevel }),
            });
            if (!response.ok) {
                throw new Error('Failed to add user access');
            }
            // Clear the input fields after adding access
            setNewUserAccess("");
        } catch (error) {
            console.error('Error adding user access:', error.message);
        }
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
                    <h3>Users with Access:</h3>
                    <ul>
                        {calendarUsers.map(user => (
                            <li key={user.id_user}>{user.userName}</li>
                        ))}
                    </ul>
                    <h3>Add User Access:</h3>
                    <select value={newUserAccess} onChange={(e) => setNewUserAccess(e.target.value)}>
                        <option value="">Select a user</option>
                        {/* Render users list here */}
                    </select>
                    <select>
                        {accessLevels.map((access) => (
                            <option key={access.level} value={access.level}>{access.label}</option>
                        ))}
                    </select>
                    <button onClick={handleAddUserAccess}>Add Access</button>
                </div>
            )}
        </div>
    );
};


export const UserCalendarsForm2 = ({ calendars, onChangeColor, onDelete, onChangeName }) => {
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
        setSelectedCalendarId("");
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

