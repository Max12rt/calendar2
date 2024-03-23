  import moment from "moment";

/*
  export const prepareEvents = (events = []) => {
    console.log("44" + events);
    return events.map((e) => {
      let { id: id, ...event } = e;
      return {...event, id,
        start: moment(e.start).toDate(),
        end: moment(e.end).toDate()
      };
    });
  };*/

  export const prepareEvents = (events = []) => {
    try {
      return events.map((e) => {
        let { id, ...event } = e;
        return {
          ...event,
          id,
          start: moment(e.start).toDate(),
          end: moment(e.end).toDate()
        };
      });
    } catch (error) {
      console.error("Error preparing events:", error);
      return [];
    }
  };
