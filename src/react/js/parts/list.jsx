import React, { useContext } from "react";
import { numContext } from "./contextList";

/*
export default function List() {
  return (
    <div>
      list
      <numContext.Consumer>
        { ( { num } ) => (
          <div>
            <span>{num}</span>
          </div>
        ) }
      </numContext.Consumer>
    </div>
  );
}
*/

export default function List() {
  let { num, add_num } = useContext( numContext );
  return (
    <div>
      list
      <div>
        <span>{ num }</span>
        <a href="javascript:" onClick={ add_num }> + </a>
      </div>
    </div>
  );
}
