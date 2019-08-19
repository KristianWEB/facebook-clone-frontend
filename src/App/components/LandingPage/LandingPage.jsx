import React, { useContext } from 'react';

import FeatureContext from '../../Context/feature/featureContext';

const LandingPage = (props) => {
  const featureContext = useContext(FeatureContext);

  const { items } = featureContext;

  return items.map((item, index) => <h1 key={index}>{item}</h1>);
};

export default LandingPage;
