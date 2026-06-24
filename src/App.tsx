import { Routes, Route } from 'react-router'
import Story from './routes/Story'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Story />} />
    </Routes>
  )
}
