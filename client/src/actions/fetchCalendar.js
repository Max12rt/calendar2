import { fetchWithToken } from '../fetch/fetch';
import types from '../types';
import { setError } from "./ui";
import Swal from "sweetalert2";
import { updateCalendarName } from './calendar';

export const fetchUserCalendars = (userId) => {
    return async (dispatch) => {
        try {
            const response = await fetchWithToken(`calendars/user-calendars?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user calendars');
            }

            const data = await response.json();
            dispatch(setUserCalendars(data));
        } catch (error) {
            console.error("Error fetching user calendars:", error);
            dispatch(setError("Failed to fetch user calendars"));
        }
    };
};

export const setUserCalendars = (calendars) => ({
    type: types.setUserCalendars,
    payload: calendars
});

export const changeCalendarNameApi = (calendarId, name) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://localhost:5002/api/calendars/${calendarId}/name`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name }),
            });
            const data = await response.json();
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


export default { changeCalendarNameApi, fetchUserCalendars };
