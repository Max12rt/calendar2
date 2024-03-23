import React from "react";

const CreateCalendarButton = ({ onClick }) => {
    return (
        <button className="btn btn-primary" onClick={onClick}>
            Create New Calendar
        </button>
    );
};

export default CreateCalendarButton;
