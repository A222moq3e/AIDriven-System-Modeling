import { PromptPage } from './components/PromptPage'
import { Navbar } from './components/Navbar'
import './index.css'

function App() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-background">
      <Navbar />
      <PromptPage />
    </div>
  )
}

export default App

