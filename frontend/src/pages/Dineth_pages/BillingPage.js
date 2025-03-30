import { useNavigate } from 'react-router-dom';

const BillingPage = () => {
    const navigate = useNavigate();
    
    return (
        <div className="p-6 flex flex-col items-center bg-gray-100 min-h-screen">
            <div className="flex flex-wrap justify-center gap-10">
                <div className="border p-4 shadow-lg w-80 bg-white rounded-lg">
                    <div className="h-32 bg-gray-300 mb-3 rounded-md"></div>
                    <h2 className="font-bold text-lg">Normal Double Room</h2>
                    <p className="text-sm font-semibold text-gray-600">2 nights (Aug 15 - Aug 17)</p>
                    <p>Room Rate: <span className="font-semibold">300.00</span></p>
                    <p>Taxes & Fees: <span className="font-semibold">45.00</span></p>
                    <p>Resort Fee: <span className="font-semibold">25.00</span></p>
                    <hr className="my-2"/>
                    <p className="font-bold text-lg">Total: 370.00</p>
                </div>
                <div className="border p-4 shadow-lg w-80 bg-white rounded-lg">
                    <div className="h-32 bg-gray-300 mb-3 rounded-md"></div>
                    <h2 className="font-bold text-lg">Deluxe Ocean View Room</h2>
                    <p className="text-sm font-semibold text-gray-600">2 nights (Aug 15 - Aug 17)</p>
                    <p>Room Rate: <span className="font-semibold">350.00</span></p>
                    <p>Taxes & Fees: <span className="font-semibold">50.00</span></p>
                    <p>Resort Fee: <span className="font-semibold">25.00</span></p>
                    <hr className="my-2"/>
                    <p className="font-bold text-lg">Total: 425.00</p>
                </div>
            </div>

            <div className="border p-6 mt-6 w-full md:w-96 bg-white shadow-xl rounded-lg">
                <h2 className="font-bold text-xl text-center mb-3">Total Bill of Customer</h2>
                <p className="font-semibold">Normal Double Room: <span className="float-right">370.00</span></p>
                <p className="font-semibold">Deluxe Ocean View Room: <span className="float-right">425.00</span></p>
                <p>Extra charges: <span className="float-right">150.00</span></p>
                <p className="text-red-500">Discount: <span className="float-right">-100.00</span></p>
                <hr className="my-3"/>
                <p className="font-bold text-lg">Total: <span className="float-right">845.00</span></p>
                <div className="flex justify-between mt-4">
                    <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">Print bill</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" onClick={() => navigate('/payment')}>Confirm Payment</button>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;
