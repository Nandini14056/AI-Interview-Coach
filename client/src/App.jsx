import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className='flex min-h-screen bg-gray-50 font-sans'>
      <Sidebar/>
      <main className='flex-1 p-8 overflow-y-auto'>
        <Dashboard/>
      </main>
    </div>
  )
}

export default App
