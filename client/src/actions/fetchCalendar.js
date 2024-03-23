import moment from "moment";
import types from '../types';
import { setError } from "./ui";
import Swal from "sweetalert2";
import { updateCalendarName } from './calendar';
import UserCalendarsForm from "./UserCalendarsForm";

export const fetchUserCalendars = (userId) => {
    return async (dispatch) => {
        try {
            //console.error("userIdfetchUserCalendars       " + userId);
            const response = await fetch(`/api/calendars/user-calendars?userId=${userId}`);
            //Swal.fire(response);
            console.error("response" + response);
            if (!response.ok) {
                throw new Error('Failed to fetch user calendars');
            }

            const data = await response.json();
            //console.error("data" + data);

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

export const changeCalendarName = (calendarId, name) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`/api/calendars/${calendarId}/name`, {
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


//export default { changeCalendarName, fetchUserCalendars };
