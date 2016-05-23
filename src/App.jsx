import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
    return (
        <div>
            <h1>React Boilerplate</h1>
            {/*Application body*/}
        </div>
    );
  }
}

App.propTypes = {};
App.defaultProps = {};

ReactDOM.render(<App />, document.querySelector('#app'));
