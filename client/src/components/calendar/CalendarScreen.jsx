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
import CalendarEvent from  "./CalendarEvent";
import Swal from "sweetalert2";

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

  const HolidayEvent = ({ event }) => {
    const { title } = event;

    return (
        <div>
          <strong>{title}</strong>
        </div>
    );
  };

  useEffect(() => {
    dispatch(eventStartLoading());
    fetchHolidayEvents();
  }, [dispatch]);

  const fetchHolidayEvents = async () => {
    try {
      const response = await fetch("/api/calendar/holidays");
      if (!response.ok) {
        const text = await response.text();
        console.error("Error response:", text);
        throw new Error("Failed to fetch holiday data");
      }

      const data = await response.json();
      console.log("Data:", data);

      const holidayEvents = prepareHolidayEvents(data);
      setHolidays(holidayEvents);
    } catch (error) {
      console.error("Error fetching holiday data:", error);
    }
  };



  const prepareHolidayEvents = (data) => {
    const holidayEvents = [];
    console.log("holidayEvents"+holidayEvents);
    for (const year in data.data) {
      for (const month in data.data[year]) {
        for (const day in data.data[year][month]) {
          const isWorking = data.data[year][month][day].isWorking;
          if (isWorking === 2) {
            const holidayDate = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD').toDate();
            const holidayEvent = {
              title: 'Holiday',
              start: holidayDate,
              end: holidayDate,
              isHoliday: true
            };
            holidayEvents.push(holidayEvent);
          }
        }
      }
    }
    console.log(holidayEvents);
    return holidayEvents;
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
        body: JSON.stringify({ name, description, color }),
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

  return (
      <div className="calendar-screen">
        <Navbar />
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
