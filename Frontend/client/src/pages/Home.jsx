import Menubar from "../components/Menubar.jsx";
import Header from "../components/Header.jsx";
import Body from "../components/Body.jsx";
import AIChatWidget from "../components/AIChatWidget.jsx"; 

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full">
            <Menubar />
            <Header />
            <Body />
            <AIChatWidget /> 
        </div>
    );
};

export default Home;
