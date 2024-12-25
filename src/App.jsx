/* CSS */
import './css/App.css';
import './css/reset.css';

/* page */
import DevelopNote from './page/DevelopNote';

/* Component */
import Header from './component/Header';
import LeftMenu from './page/LeftMenu';

function App() {
    return (
        <div className="App">
            <Header></Header>
            <LeftMenu />
            <DevelopNote />
        </div>
    );
}

export default App;
