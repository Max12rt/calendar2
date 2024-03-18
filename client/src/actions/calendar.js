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
