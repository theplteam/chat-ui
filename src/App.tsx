import * as React from 'react';
import TestApp from './test/common/BaseExample';
import eruda from 'eruda';

const App: React.FC = () => {
  React.useEffect(() => {
    eruda.init();
  }, [])
  return (
    <TestApp />
  )
}

export default App
