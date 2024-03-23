const CalendarEvent = ({ event }) => {
    const { title, user } = event;

    return (
        <div>
            <strong>{title}</strong>
            {user && user.name && <span> - {user.name}</span>}
        </div>
    );
};
export default CalendarEvent;

