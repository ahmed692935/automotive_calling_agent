import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  Call,
  CallHistoryState,
  Pagination,
  // StatusCount,
} from "../../interfaces/dashboard";

const initialState: CallHistoryState = {
  loading: false,
  error: null,
  calls: [],
  pagination: null,
};

const callHistorySlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    fetchCallsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCallsSuccess(
      state,
      action: PayloadAction<{
        calls: Call[];
        pagination: Pagination;
        // status_counts: StatusCount;
      }>
    ) {
      state.loading = false;
      state.calls = action.payload.calls; // ✅ fix
      state.pagination = action.payload.pagination; // ✅ fix
    },

    fetchCallsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchCallsStart, fetchCallsSuccess, fetchCallsFailure } =
  callHistorySlice.actions;

export default callHistorySlice.reducer;
