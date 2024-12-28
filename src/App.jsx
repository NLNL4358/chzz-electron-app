/* CSS */
import './css/App.css';
import './css/reset.css';

/* page */
import DevelopNote from './page/DevelopNote';

/* Component */
import Header from './component/Header';
import LeftMenu from './page/LeftMenu';
import RightMenu from './page/RightMenu';

function App() {
    return (
        <div className="App">
            <Header></Header>
            <div className="mainViewInner">
                <LeftMenu />
                <RightMenu />
            </div>

            <DevelopNote />
        </div>
    );
}

export default App;
