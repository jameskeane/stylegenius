import { useState, useEffect } from 'react';
import { Provider, Loading, useAppBridge } from '@shopify/app-bridge-react';
import { AppProvider, Card } from '@shopify/polaris';
import { authenticatedFetch } from "@shopify/app-bridge/utilities";
import '@shopify/polaris/build/esm/styles.css';
import { ChatFrame } from './ChatFrame.js';


function useData(url) {
  const app = useAppBridge();
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetch = authenticatedFetch(app);

    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url, app]);
  return data;
}


function ProductListing() {
  const products = useData('/api/products');

  return <div>
    { products.map((product) => <p key={product.id}>{product.title}</p>) }
  </div>
}


function App() {
  const appConfig = JSON.parse(document.getElementById('app-config').textContent);
  return (
      <AppProvider>
        <Provider config={appConfig}>
          <Loading />
          <Card title="StyleGenius" sectioned>
            {/*<ProductListing />*/}
            <ChatFrame />
            {/*<p>View a summary of your online store.</p>*/}
          </Card>
        </Provider>
      </AppProvider>
    );
}

export default App;
