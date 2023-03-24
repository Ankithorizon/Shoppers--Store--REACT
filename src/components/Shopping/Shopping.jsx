import React from "react";
import Search from "./Search/Search";
import SearchByCat from "./SearchByCat/SearchByCat";
import "./style.css";

const Shopping = () => {
  return (
    <div className="mainContainer">
      <div className="row">
        <div className="col-sm-8">
          <Search></Search>
          <p></p>
          <SearchByCat></SearchByCat>
        </div>
        <div className="col-sm-4">product-detail &amp; cart</div>
      </div>
    </div>
  );
};

export default Shopping;
