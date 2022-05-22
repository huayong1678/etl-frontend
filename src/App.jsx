import {
  Routes, Route, BrowserRouter
} from 'react-router-dom'
import LoginPage from './page/auth/Login'
import RegisterPage from './page/auth/Register'
import SourcePage from './page/source/Source'
import CreateSourcePage from './page/source/CreateSource'
import DestinationPage from './page/destination/Destination'
import CreateDestinationPage from './page/destination/CreateDestination'
import PipelinePage from './page/pipeline/Pipeline'
import TransformPage from './page/transform/Transform'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />  
      <Route path="/register" element={<RegisterPage />} />  
      <Route path="/source" element={<SourcePage />} /> 
      <Route path="/create-source" element={<CreateSourcePage />} /> 
      <Route path="/destination" element={<DestinationPage />} /> 
      <Route path="/create-destination" element={<CreateDestinationPage />} /> 
      <Route path="/pipeline" element={<PipelinePage />} /> 
      <Route path="/transform" element={<TransformPage />} /> 
    </Routes>
  );
}

export default App;
