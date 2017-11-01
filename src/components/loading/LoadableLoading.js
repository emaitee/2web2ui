import React from 'react';
import { Loading } from 'src/components/loading/Loading';

const LoadableLoading = ({ pastDelay }) => {
  // if loading has taken more than 200 milliseconds
  if (pastDelay) {
    return <Loading />;
  } else {
    return null;
  }
};

export default LoadableLoading;
