import * as React from 'react';
import type { AppProps } from '../types/App';
import View from './View';


const App = (params: AppProps): JSX.Element => {
    return (
        <View {...params} />
    );
}

export default App;
