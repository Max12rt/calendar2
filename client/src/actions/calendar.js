import { fetchWithToken } from '../fetch/fetch';
import types from '../types/index';

export const startCreateCalendar = (name, userId) => {
    return async (dispatch) => {
        try {
            const response = await fetchWithToken("calendars", { name, userId }, "POST");
            const data = await response.json();

            if (data.ok) {
                dispatch(createCalendar(data.calendar));
                return { ok: true };
            } else {
                return { ok: false, error: data.msg || "Error creating calendar" };
            }
        } catch (error) {
            console.error("Error creating calendar:", error.message || "Unknown error");
            return { ok: false, error: "Unknown error" };
        }
    };
};

const createCalendar = (calendar) => ({
    type: types.createCalendar,
    payload: calendar,
});


export const changeCalendarColor = (calendarId, color) => {
    return async (dispatch) => {
        try {
            // Make API call to update calendar color
            const response = await fetch(`/api/calendars/${calendarId}/color`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ color }),
            });
            const data = await response.json();
            // Dispatch action to update store
            if (response.ok) {
                dispatch(updateCalendarColor(calendarId, color));
            } else {
                throw new Error(data.error || "Failed to update calendar color");
            }
        } catch (error) {
            console.error("Error changing calendar color:", error);
        }
    };
};
// Додамо функцію для зміни назви календаря
export const changeCalendarName = (calendarId, name) => {
    return async (dispatch) => {
        try {
            // Виконуємо запит на зміну назви календаря
            const response = await fetch(`/api/calendars/${calendarId}/name`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name }),
            });
            const data = await response.json();
            // Оновлюємо стор за допомогою дії updateCalendarName
            if (response.ok) {
                dispatch(updateCalendarName(calendarId, name));
            } else {
                throw new Error(data.error || "Failed to update calendar name");
            }
        } catch (error) {
            console.error("Error changing calendar name:", error);
        }
    };
};

export const UPDATE_CALENDAR_NAME = "UPDATE_CALENDAR_NAME";

export const updateCalendarName = (calendarId, name) => ({
    type: UPDATE_CALENDAR_NAME,
    payload: { calendarId, name },
});


export const deleteCalendar = (calendarId) => {
    return async (dispatch) => {
        try {
            // Make API call to delete calendar
            const response = await fetch(`/api/calendars/${calendarId}`, {
                method: "DELETE",
            });
            const data = await response.json();
            // Dispatch action to update store
            if (response.ok) {
                dispatch(removeCalendar(calendarId));
            } else {
                throw new Error(data.error || "Failed to delete calendar");
            }
        } catch (error) {
            console.error("Error deleting calendar:", error);
        }
    };
};

// Redux action types
export const UPDATE_CALENDAR_COLOR = "UPDATE_CALENDAR_COLOR";
export const REMOVE_CALENDAR = "REMOVE_CALENDAR";

// Redux action creators
export const updateCalendarColor = (calendarId, color) => ({
    type: UPDATE_CALENDAR_COLOR,
    payload: { calendarId, color },
});

export const removeCalendar = (calendarId) => ({
    type: REMOVE_CALENDAR,
    payload: calendarId,
});

export default { changeCalendarName, deleteCalendar, createCalendar, changeCalendarColor };
