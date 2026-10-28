import { AppRouter } from '@/routes/app-router';
import { ToastProvider } from '@/components/toast';

function App() {
  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  );
}

export default App;
