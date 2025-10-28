import React from "react";
import { Routes, Route } from "react-router-dom";

import Homepage from "../pages/Homepage";

import CarForm from "../pages/car/CarForm";
import CarList from "../pages/car/CarList";

import CustomerForm from "../pages/customer/CustomerForm";
import CustomerList from "../pages/customer/CustomerList";

import UserList from "../pages/user/UserList";
import UserForm from "../pages/user/UserForm";

import Login from "../pages/Login";

import { routes, UserLevel } from "./routes";

export default function AppRoutes() {
  return (
    <Routes>
      {routes.map((route) => {
        let element = route.element;
        if (route.userLevel > UserLevel.ANY) {
          element = (
            <AuthGuard userLevel={route.userLevel}>{route.element}</AuthGuard>
          );
        } else {
          element = route.element;
        }

        return (
          <Route key={route.route} path={route.route} element={element}></Route>
        );
      })}
    </Routes>
  );
}
