import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { startCreateCalendar } from "../../actions/calendar";
import CreateCalendarForm from "../../components/CreateCalendarForm"; // Corrected import path
import Navbar from "../../components/ui/Navbar";
import CalendarEvent from "./CalendarEvent";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import CalendarModal from "./CalendarModal";
import { uiOpenModal } from "../../actions/ui";
import { eventClearActive, eventSetActive, eventStartLoading } from "../../actions/event";
import AddNewBtn from "../../components/ui/AddNewBtn";
import DeleteBtn from "../../components/ui/DeleteBtn";

const localizer = momentLocalizer(moment);

const CalendarScreen = () => {
  const dispatch = useDispatch();
  const { calendar, auth, ui } = useSelector((state) => state);
  const { events, activeEvent } = calendar;
  const { id } = auth;
  const { modalOpen } = ui;
  const [lastView, setLastView] = useState(localStorage.getItem("lastView") || "month");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(eventStartLoading());
  }, [dispatch]);

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

// Example fix for client-side code
  const handleCreateCalendar = async ({ name, description, color }) => {
    try {
      const response = await fetch('/api/calendars/create', { // Corrected endpoint URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, color }),
      });

      if (!response.ok) {
        throw new Error('Failed to create calendar');
      }

      const data = await response.json();
      console.log('Calendar created successfully:', data);
    } catch (error) {
      console.error('Error creating calendar:', error.message);
      // Display error message to the user
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

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: id === event.user._id ? "#367CF7" : "#465660",
      opacity: 0.8,
      display: "block",
      color: "white",
    };
    return { style };
  };

  return (
      <div className="calendar-screen">
        <Navbar />
        <div className="calendar-container">
          <div className="calendar">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={eventStyleGetter}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelect}
                onView={onViewChange}
                onSelectSlot={onSelectSlot}
                selectable={true}
                view={lastView}
                components={{ event: CalendarEvent }}
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
