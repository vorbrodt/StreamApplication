import streams from "../apis/streams";
import {
  SIGN_IN,
  SIGN_OUT,
  CREATE_STREAM,
  FETCH_STREAMS,
  FETCH_STREAM,
  DELETE_STREAM,
  EDIT_STREAM,
} from "./types";
import history from "../history";

export const signIn = (userId) => {
  return {
    type: SIGN_IN,
    payload: userId,
  };
};

export const signOut = () => {
  return {
    type: SIGN_OUT,
  };
};

// using redux-thunk to handle asynchronous action creator
export const createStream = (formValues) => async (dispatch, getState) => {
  const { userId } = getState().auth;
  const response = await streams.post("/streams", { ...formValues, userId });
  dispatch({ type: CREATE_STREAM, payload: response.data });
  // programmatic navigation to navigate back to root route
  history.push("/");
};

// fetch array of streams
export const fetchStreams = () => async (dispatch) => {
  const response = await streams.get("/streams");
  dispatch({ type: FETCH_STREAMS, payload: response.data });
};

// fetch stream with specific id
export const fetchStream = (id) => async (dispatch) => {
  const response = await streams.get(`/streams/${id}`);
  dispatch({ type: FETCH_STREAM, payload: response.data });
};

// edit a stream with specific id and some formValues which is the edit values
export const editStream = (id, formValues) => async (dispatch) => {
  // here we make a request to update stream, response becomes is the updated stream
  const response = await streams.patch(`/streams/${id}`, formValues);
  // dispatch action of type EDIT_STREAM with payload of the updated stream
  dispatch({ type: EDIT_STREAM, payload: response.data });
  history.push("/");
};

// delete specific stream
export const deleteStream = (id) => async (dispatch) => {
  await streams.delete(`/streams/${id}`);
  dispatch({ type: DELETE_STREAM, payload: id });
  history.push("/");
};
