import React, { useState } from "react";

const UserCalendarsForm = ({ calendars, onChangeColor, onDelete, onChangeName }) => {
    const [selectedCalendar, setSelectedCalendar] = useState(""); // Стан для зберігання вибраного календаря

    const handleCalendarChange = (event) => {
        setSelectedCalendar(event.target.value); // Зберігаємо вибраний календар у стані
    };

    const handleNameChange = (event) => {
        onChangeName(selectedCalendar, event.target.value); // Передаємо вибраний календар і нове ім'я для зміни
    };

    const handleColorChange = (event) => {
        onChangeColor(selectedCalendar, event.target.value); // Передаємо вибраний календар і новий колір для зміни
    };

    const handleDelete = () => {
        onDelete(selectedCalendar); // Видаляємо вибраний календар
    };

    return (
        <div>
            <h2>User Calendars</h2>
            <select value={selectedCalendar} onChange={handleCalendarChange}>
                <option value="">Select a calendar</option>
                {calendars.map((calendar) => (
                    <option key={calendar.id} value={calendar.id}>{calendar.name}</option> // Використовуємо ідентифікатор календаря як значення опції
                ))}
            </select>
            {selectedCalendar && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter new name"
                        value={calendars.find(calendar => calendar.id === selectedCalendar)?.name || ""}
                        onChange={handleNameChange}
                    />
                    <input
                        type="color"
                        value={calendars.find(calendar => calendar.id === selectedCalendar)?.color || ""}
                        onChange={handleColorChange}
                    />
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    );
};

export default UserCalendarsForm;
