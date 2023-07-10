import { useCallback, useEffect, useMemo, useState } from "react";
import { parse, unparse, type ParseResult } from "papaparse";
import { type RubricRow } from "./types";
import { GradeTable } from "./components";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import csv from 'data/csv/Q1/0083.csv?raw'



export const App = () => {
  // useEffect(() => {
  //   getParsedData('0083', handleDataReady)
  // }, [handleDataReady])

  const router = createBrowserRouter([
    {
      path: '/',
      element: <h3>Gradebook</h3>,
    },
    {
      path: ':questionNo',
      children: [
        {
          path: ':studentId',
          element: <GradeTable />,
        },
      ]
    },
  ])
  return (
    <RouterProvider router={router} />
  );
};
