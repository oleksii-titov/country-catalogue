import React from 'react';
import { Catalogue } from "../Catalogue/Catalogue";
import './css/App.css';
import { BrowserRouter, Route } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route path={"/"}>
          <Catalogue/>
        </Route>
        <Route path={"/:countryCode"}>
          <Catalogue/>
        </Route>
      </BrowserRouter>
    </div>
  );
}

export default App;
