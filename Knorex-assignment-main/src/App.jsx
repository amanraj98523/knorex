import Weather from "./components/Weather";  
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{color:'white'}}>Weather Forecast App</h1>
      </header>
      <main>
        <Weather /> 
      </main>
    </div>
  );
}

export default App;
