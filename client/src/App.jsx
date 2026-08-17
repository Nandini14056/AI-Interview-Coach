import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className='flex min-h-screen bg-gray-50 font-sans'>
      <Sidebar/>
      <main className='flex-1 p-8'>
        <h2 className='text-2xl font-bold text-gray-800'>Dashboard content</h2>
      </main>
    </div>
  )
}

export default App
