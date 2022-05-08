import Footer from './components/Footer'
import Minting from './components/Minting'
import Navbar from './components/Navbar'

function App() {
    return (
        <div className="relative min-h-screen bg-[#F4F4F4] font-rubik">
            <Footer />
            <div className="mx-12 py-8">
                <Navbar />
            </div>
            <div className="mx-12">
                <Minting />
            </div>
            <div></div>
        </div>
    )
}

export default App
