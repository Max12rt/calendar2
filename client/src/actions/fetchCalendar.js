// fetchCalendar.js

import types from '../types';
import { setError } from "./ui";

export const fetchUserCalendars = (userId) => {
    return async (dispatch) => {
        try {
            console.log(userId);
            const response = await fetch(`/api/calendars/user-calendars?userId=${userId}`);
            console.log(response);
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
