import './App.css';
import CardComponent from './Component/Card';

// Material UI
import Container from '@mui/material/Container';

// App component
function App() {
  return (
    <div className="App" > 
      <Container maxWidth="sm">
        <CardComponent />
      </Container>      
    </div>
  );
}

export default App;
