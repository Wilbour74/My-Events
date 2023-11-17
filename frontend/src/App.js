
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Event from './components/Event';
import './App.css';
import EventDetails from "./components/EventDetails";
import Homepage from './components/Homepage';
import Sortie from './components/Sortie';
import SortieDetail from "./components/SortieDetail";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />}></Route>
          <Route path="/events" element={<Event/>}/>
          <Route path="/events/:id" element={<EventDetails/>}/>
          <Route path="/events_list" element={<Sortie/>}/>
          <Route path="/sortie/:id" element={<SortieDetail/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
