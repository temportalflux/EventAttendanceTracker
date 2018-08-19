import React from 'react';
import {Header} from "semantic-ui-react";

class App extends React.Component {
  render() {
    return (
        <div id={'App'}>
          <Header textAlign={'center'}>
              <Header.Content>
                  Welcome!
              </Header.Content>
          </Header>
        </div>
    );
  }
}

export default App;