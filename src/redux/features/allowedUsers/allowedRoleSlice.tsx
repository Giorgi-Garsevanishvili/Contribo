import { Region, Role } from "@prisma/client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../store";

export const fetchRoles = createAsyncThunk("roles/fetchAll", async () => {
  const response = await axios.get("/api/console/roles");
  return response.data;
});

export const fetchRegions = createAsyncThunk("regions/fetchAll", async () => {
  const response = await axios.get("/api/console/regions");
  return response.data;
});

interface DataState {
  roles: Role[];
  regions: Region[];
  loadingRoles: "idle" | "pending" | "succeeded" | "failed";
  loadingRegions: "idle" | "pending" | "succeeded" | "failed";
  errorRoles?: string | undefined;
  errorRegions?: string | undefined;
}

const initialState = {
  roles: [],
  regions: [],
  loadingRoles: "idle",
  loadingRegions: "idle",
} as DataState;

const allowedUserComp = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loadingRoles = "succeeded";
        state.roles = action.payload;
      })
      .addCase(fetchRoles.pending, (state, _action) => {
        state.loadingRoles = "pending";
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loadingRoles = "failed";
        state.errorRoles = action.error.message;
      })
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.loadingRegions = "succeeded";
        state.regions = action.payload;
      })
      .addCase(fetchRegions.pending, (state, _action) => {
        state.loadingRegions = "pending";
      })
      .addCase(fetchRegions.rejected, (state, action) => {
        state.loadingRegions = "failed";
        state.errorRegions = action.error.message;
      });
  },
});

export const rolesError = (state: RootState) => state.AllowedComp.errorRoles;
export const rolesLoading = (state: RootState) =>
  state.AllowedComp.loadingRoles;
export const getAllRoles = (state: RootState) => state.AllowedComp.roles;

export const regionsError = (state: RootState) =>
  state.AllowedComp.errorRegions;
export const regionLoading = (state: RootState) =>
  state.AllowedComp.loadingRegions;
export const getAllRegion = (state: RootState) => state.AllowedComp.regions;

export const allowedUserCompReducer = allowedUserComp.reducer;
