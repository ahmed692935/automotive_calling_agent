// // src/redux/slices/call.ts

// import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
// import type { CallFormInputs } from "../../interfaces/callForm";

// interface CallState {
//   loading: boolean;
//   error: string | null;
//   call: CallFormInputs | null;
// }

// const initialState: CallState = {
//   loading: false,
//   error: null,
//   call: null,

// };

// const callSlice = createSlice({
//   name: "call",
//   initialState,
//   reducers: {
//     createCallStart(state) {
//       state.loading = true;
//       state.error = null;
//     },
//     createCallSuccess(state, action: PayloadAction<CallFormInputs>) {
//       state.loading = false;
//       state.call = action.payload;
//     },
//     createCallFailure(state, action: PayloadAction<string>) {
//       state.loading = false;
//       state.error = action.payload;
//     },

//     resetCall(state) {
//       state.call = null;
//       state.error = null;
//       state.loading = false;
//     },
//   },
// });

// export const {
//   createCallStart,
//   createCallSuccess,
//   createCallFailure,
//   resetCall,
// } = callSlice.actions;

// export default callSlice.reducer;

// src/redux/slices/call.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CallFormInputs,
  TranscriptLine,
  TranscriptPayload,
} from "../../interfaces/callForm";

interface CallState {
  loading: boolean;
  error: string | null;
  call: CallFormInputs | null;
  callId: string | null;
  transcript: TranscriptLine[];
  openPopup: boolean;
  status: string | null;
}

const initialState: CallState = {
  loading: false,
  error: null,
  call: null,
  callId: null,
  transcript: [],
  openPopup: false,
  status: null,
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    createCallStart(state) {
      state.loading = true;
      state.error = null;
    },
    createCallSuccess(state, action: PayloadAction<{ call_id: string }>) {
      state.loading = false;
      //   state.call = action.payload.call;
      state.callId = action.payload.call_id;
      state.openPopup = true;
      //   state.status = action.payload.status ?? "initiated"; // ✅
      //   console.log(state.status, "kkkkllll");
    },
    createCallFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    resetCall(state) {
      //   state.call = null;
      state.error = null;
      state.loading = false;
      state.callId = null;
      state.transcript = [];
      state.openPopup = false;
      state.status = null;
    },
    // setTranscript(state, action: PayloadAction<TranscriptLine[]>) {
    //   state.transcript = action.payload;
    // },
    // setTranscript: (state, action: PayloadAction<TranscriptPayload>) => {
    //   if (action.payload?.status !== undefined) {
    //     state.status = action.payload.status; // ✅ status update
    //   }
    //   // ✅ transcript handle kare
    //   if (Array.isArray(action.payload?.transcript)) {
    //     state.transcript = action.payload.transcript;
    //   } else if (typeof action.payload?.transcript === "string") {
    //     state.transcript = [action.payload.transcript]; // string ko bhi array banado
    //   } else {
    //     state.transcript = [];
    //   }
    // },
    setTranscript: (state, action: PayloadAction<TranscriptPayload>) => {
      if (action.payload?.status !== undefined) {
        state.status = action.payload.status;
      }

      if (Array.isArray(action.payload?.transcript)) {
        // Already TranscriptLine[]
        state.transcript = action.payload.transcript;
      } else if (typeof action.payload?.transcript === "string") {
        // String ko TranscriptLine me convert karo
        state.transcript = [{ role: "user", text: action.payload.transcript }];
      } else {
        state.transcript = [];
      }
    },

    togglePopup: (state, action: PayloadAction<boolean>) => {
      // 👈 ye add karo
      state.openPopup = action.payload;
    },
  },
});

export const {
  createCallStart,
  createCallSuccess,
  createCallFailure,
  resetCall,
  setTranscript,
  togglePopup,
} = callSlice.actions;

export default callSlice.reducer;
