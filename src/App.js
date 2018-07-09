import React, { Component } from 'react';
import Layout from './components/Layout/Layout';
import InvestorForm from './containers/InvestorForm/InvestorForm';

class App extends Component {
  render() {
    return (
      <Layout>
        <InvestorForm/>
      </Layout>
    );
  }
}

export default App;
