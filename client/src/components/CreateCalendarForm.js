import React, { useState } from "react";

const CreateCalendarForm = ({ isOpen, onClose, onCreate }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        color: "#ffffff", // Default color
    });
    const [message, setMessage] = useState(""); // State to hold server response message

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onCreate(formData); // Call onCreate with form data
            setMessage("Calendar created successfully!"); // Set success message
            setFormData({ // Reset form data after submission
                name: "",
                description: "",
                color: "#ffffff",
            });
        } catch (error) {
            setMessage("Failed to create calendar. Please try again."); // Set error message
            console.error("Error creating calendar:", error);
        } finally {
            // Close the form after displaying the message
            setTimeout(() => {
                onClose();
            }, 2000); // Close after 2 seconds (adjust as needed)
        }
    };

    return (
        <div className={`modal ${isOpen ? "is-active" : ""}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-content">
                <div className="box">
                    <h2 className="title">Create Calendar</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label className="label">Name</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Calendar Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Description</label>
                            <div className="control">
                                <textarea
                                    className="textarea"
                                    placeholder="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Color</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="color"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="field is-grouped">
                            <div className="control">
                                <button type="submit" className="button is-primary">
                                    Create
                                </button>
                            </div>
                            <div className="control">
                                <button type="button" className="button" onClick={onClose}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                        {message && <p className={`message ${message.includes("Failed") ? "is-danger" : "is-success"}`}>{message}</p>}
                    </form>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
        </div>
    );
};

export default CreateCalendarForm;
