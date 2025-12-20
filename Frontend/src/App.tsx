import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { config } from './wagmi';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/Landing';

import { CreatePool } from './pages/CreatePool';
import { Dashboard } from './pages/Dashboard';

import { PoolDetails } from './pages/PoolDetails';

// Removed placeholder Dashboard
// Removed placeholder CreatePool
// Removed placeholder PoolDetails

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<LandingPage />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="create" element={<CreatePool />} />
                <Route path="pool/:address" element={<PoolDetails />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
