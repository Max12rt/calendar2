import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import CreateCalendarForm from "../../components/CreateCalendarForm";
import Navbar from "../../components/ui/Navbar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import CalendarModal from "./CalendarModal";
import { uiOpenModal } from "../../actions/ui";
import { eventClearActive, eventSetActive, eventStartLoading } from "../../actions/event";
import AddNewBtn from "../../components/ui/AddNewBtn";
import DeleteBtn from "../../components/ui/DeleteBtn";
import { changeCalendarColor, deleteCalendar, changeCalendarName } from "../../actions/calendar";
import { fetchUserCalendars } from "../../actions/fetchCalendar";
import { UserCalendarsForm, UserCalendarsForm2 } from "../../actions/UserCalendarsForm";
import Swal from "sweetalert2";
import { fetchNoToken } from "../../fetch/fetch";

const localizer = momentLocalizer(moment);

const CalendarScreen = () => {
  const dispatch = useDispatch();
  const { calendar, auth, ui } = useSelector((state) => state);
  const { events, activeEvent } = calendar;
  const { id } = auth;
  const { modalOpen } = ui;
  const [lastView, setLastView] = useState(localStorage.getItem("lastView") || "month");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const { calendars } = calendar;
  const [holidayEvents, setHolidayEvents] = useState([]);

  const userId = id;
  const [showUserCalendarsForm, setShowUserCalendarsForm] = useState(false);
  const [showUserCalendarsForm2, setShowUserCalendarsForm2] = useState(false); // Corrected variable name
  const [clickCount, setClickCount] = useState(0);

  const [selectedCalendarDetails, setSelectedCalendarDetails] = useState(null);

  useEffect(() => {
    dispatch(fetchUserCalendars(userId));
    fetchHolidayEvents();
  }, [dispatch, userId]);

  const fetchHolidayEvents = async () => {
    try {
      const res = await fetch('http://localhost:5002/api/holiday/holidays');
      if (!res.ok) {
        throw new Error("Failed to fetch holiday data");
      }
      const data = await res.json();
      const holidayEvents = prepareHolidayEvents(data);
      setHolidays(holidayEvents);
    } catch (error) {
      console.error("Error fetching holiday data:", error);
    }
  };

  const prepareHolidayEvents = (data) => {
    const holidayEvents = [];
    for (const year in data.data) {
      for (const month in data.data[year]) {
        for (const day in data.data[year][month]) {
          const holidayInfo = data.data[year][month][day];
          if (holidayInfo.holiday) { // Check if it's a holiday
            const holidayDate = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD').toDate();
            const holidayEvent = {
              title: holidayInfo.holiday,
              start: holidayDate,
              end: holidayDate,
              isHoliday: true
            };
            holidayEvents.push(holidayEvent);
          }
        }
      }
    }
    return holidayEvents;
  };

  const handleChangeColor = (calendarId, color) => {
    dispatch(changeCalendarColor(calendarId, color));
  };

  const handleDeleteCalendar = (calendarId) => {
    dispatch(deleteCalendar(calendarId));
  };

  const HolidayEvent = ({ event }) => {
    const { title, holiday } = event;

    return (
        <div>
          <strong>{title}</strong>
          {holiday && <p>{holiday}</p>}
        </div>
    );
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateCalendar = async ({ name, description, color }) => {
    try {
      const response = await fetch('/api/calendars/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, color, userId }),
      });
      Swal.fire(response);

      if (!response.ok) {
        throw new Error('Failed to create calendar');
      }

      const data = await response.json();
      console.log('Calendar created successfully:', data);

      const calendarId = data.calendar.id;
      const calendarName = data.calendar.name;

      handleCreateCalendarWithDBName({ name: calendarName, description, color, userId });
    } catch (error) {
      console.error('Error creating calendar:', error.message);
    }
  };

  const handleCreateCalendarWithDBName = async ({ name, description, color, userId }) => {
    try {
      const response = await fetch('/api/calendars/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, color, userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create calendar');
      }

      const data = await response.json();
      console.log('Calendar created successfully:', data);
    } catch (error) {
      console.error('Error creating calendar:', error.message);
    }
  };

  const onDoubleClick = (e) => {
    dispatch(uiOpenModal());
  };
  const onSelect = (e) => {
    dispatch(eventSetActive(e));
  };

  const onViewChange = (e) => {
    setLastView(e);
    localStorage.setItem("lastView", e);
  };

  const onSelectSlot = (e) => {
    activeEvent && dispatch(eventClearActive());
    if (e.action === "select" || e.action === "doubleClick") {
      dispatch(
          eventSetActive({
            title: "",
            notes: "",
            start: e.start,
            end: e.end,
          })
      );
      dispatch(uiOpenModal());
    }
  };

  useEffect(() => {
    dispatch(eventStartLoading());
    fetchHolidayEvents();
  }, [dispatch]);

  const handleChangeName = (calendarId, name) => {
    dispatch(changeCalendarName(calendarId, name));
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    const userId = event.user?.id;
    let backgroundColor = userId && userId === id ? "#367CF7" : "#465660";
    let borderRadius = "8px";
    let border = "none";

    if (event.isHoliday) {
      backgroundColor = "red";
    }

    const style = {
      backgroundColor,
      borderRadius,
      border,
      opacity: 0.8,
      display: "block",
      color: "white",
    };
    return { style };
  };

  const handleToggleUserCalendarsForm = () => {
    setClickCount(prevCount => prevCount + 1);
    setShowUserCalendarsForm(true);
    if (clickCount === 1) {
      setShowUserCalendarsForm2(false);
    }
    if (clickCount === 2) {
      setShowUserCalendarsForm(false);
      setShowUserCalendarsForm2(false);
      setClickCount(0);
    }
  };

  const handleShowCalendarDetails = async (calendarId) => {
    try {
      const response = await fetch(`http://localhost:5002/api/calendars/details/${calendarId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch calendar details");
      }
      const data = await response.json();
      setSelectedCalendarDetails(data);
    } catch (error) {
      console.error("Error fetching calendar details:", error);
    }
  };

  const handleRemoveAccess = async (userId, calendarId) => {
    try {
      const response = await fetch(`http://localhost:5002/api/calendars/unlinq/${userId}/${calendarId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error("Failed to remove user access");
      }
      // Reload user calendars after removing access
      dispatch(fetchUserCalendars(userId));
    } catch (error) {
      console.error("Error removing user access:", error);
    }
  };

  return (
      <div className="calendar-screen">
        <Navbar />
        <button onClick={handleToggleUserCalendarsForm}>
          {clickCount === 0 ? 'Show Form 1' : clickCount === 1 ? 'Show Form 2' : 'Hide Forms'}
        </button>
        {showUserCalendarsForm && (
            <div>
              <UserCalendarsForm
                  calendars={calendars}
                  handleShowCalendarDetails={handleShowCalendarDetails}
              />
            </div>
        )}
        {showUserCalendarsForm2 && (
            <div>
              {selectedCalendarDetails && (
                  <div className="calendar-details">
                    <p><strong>Calendar Name:</strong> {selectedCalendarDetails.calendarName}</p>
                    <h3>User Access:</h3>
                    <ul>
                      {selectedCalendarDetails.userAccess.map(user => (
                          <li key={user.id_user}>
                            <p><strong>User Name:</strong> {user.userName}</p>
                            <p><strong>Access Level:</strong> {user.isMain ? 'Creator' : 'User'}</p>
                            <p><strong>Access Rights:</strong></p>

                            <ul>
                              <li>Create: {user.isCreate ? 'Yes' : 'No'}</li>
                              <li>Edit: {user.isEdit ? 'Yes' : 'No'}</li>
                              <li>Access: {user.isAccess ? 'Yes' : 'No'}</li>
                              <li>Delete: {user.isDelete ? 'Yes' : 'No'}</li>
                            </ul>
                            {!user.isMain && <button onClick={() => handleRemoveAccess(user.id_user, user.id_calendar)}>Remove Access</button>}
                          </li>
                      ))}
                    </ul>
                  </div>
              )}
            </div>
        )}
        <div className="calendar-container">
          <div className="calendar">
            <Calendar
                localizer={localizer}
                events={[...events, ...holidays]}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={eventStyleGetter}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelect}
                onView={onViewChange}
                onSelectSlot={onSelectSlot}
                selectable={true}
                view={lastView}
                components={{ event: HolidayEvent }}
            />
          </div>
          {activeEvent && !modalOpen && <DeleteBtn />}
          <CalendarModal />
          <AddNewBtn />
        </div>
        <div className="button-container">
          <button className="create-button" onClick={openCreateModal}>
            Create Calendar
          </button>
        </div>
        {isCreateModalOpen && (
            <div className="form-container-under-calendar">
              <CreateCalendarForm
                  isOpen={isCreateModalOpen}
                  onClose={closeCreateModal}
                  onCreate={handleCreateCalendar}
              />
            </div>
        )}
      </div>
  );
};

export default CalendarScreen;


