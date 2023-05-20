import {Provider, Loading} from '@shopify/app-bridge-react';
import {AppProvider, Card} from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';

function App() {
  const appConfig = JSON.parse(document.getElementById('app-config').textContent);
  return (
      <AppProvider>
        <Provider config={appConfig}>
          <Loading />
          <Card title="StyleGenius" sectioned>
            <p>View a summary of your online store’s performance.</p>
          </Card>
        </Provider>
      </AppProvider>
    );
}

export default App;
