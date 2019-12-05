/** @jsx JSX */
import JSX from "../components/jsx.js";

test( "JSX <div /> to be <div></div>", () => {
  expect( <div /> ).toBe( "<div></div>" );
} );

test( "JSX <div>{ null }</div> to be <div></div>", () => {
  expect( <div>{ null }</div> ).toBe( "<div></div>" );
} );

test( `JSX <div id="test" /> to be <div id="test"></div>`, () => {
  expect( <div id="test" /> ).toBe( `<div id="test"></div>` );
} );

test( `JSX <div className={ [ { test: 1, best: 1 }, "test", "b", "a", "c" ] } /> to be <div class="test best b a c"></div>`, () => {
  expect(
    <div className={ [ { test: 1, best: 1 }, "test", "b", "a", "c" ] } />
  ).toBe( `<div class="test best b a c"></div>` );
} );
