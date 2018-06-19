import React from 'react';
// export default function List () {
//   return <div>list</div>;
// }

// export default function Xxxx( { numContext } ) {
//   return (
//     <div>
//       list
//       <numContext.Consumer>
//         {({num}) => (
//           <div>
//             <span>{num}</span>
//           </div>
//         )}
//       </numContext.Consumer>
//     </div>
//   );
// }

export default class Xxxx extends React.Component {
  constructor( props ) {
    super( props );
  }
  render() {
    let { numContext } = this.props;
    return (
      <div>
        list
        <numContext.Consumer>
          {({num}) => (
            <div>
              <span>{num}</span>
            </div>
          )}
        </numContext.Consumer>
      </div>
    );
  }
}
