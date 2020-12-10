import React from 'react';
import { Catalogue } from "../Catalogue/Catalogue";
import './css/App.css';
import { BrowserRouter, Route } from "react-router-dom";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route exact path={"/"}>
          <Catalogue/>
        </Route>
        <Route exact path={"/:countryCode"}>
          <Catalogue/>
        </Route>
      </BrowserRouter>
    </div>
  );
}
