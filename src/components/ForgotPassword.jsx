import React, { useState, useRef } from 'react';
import { useAuth } from '../Context/Auth';
import { useNavigate } from 'react-router-dom';
import { landingBg, kccLogo, cardBg } from '../assets';

const ForgotPassword = () => {
    
    // Declerations ////
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(false);
    const [error, setError] = useState("");
    const [toggleErrorMessage, seTtoggleErrorMessage] = useState(false);

	const { resetPassword } = useAuth();
    let navigate = useNavigate();

    const emailRef = useRef();
    const mobileEmailRef = useRef();

    // Desktop view rest button ////
    async function handleResetButton(e) {
        e.preventDefault();

        try {
            setLoading(true);
			setError("");

            await resetPassword(emailRef.current.value)
            setMessage(true)

        }catch{
            seTtoggleErrorMessage(true)
            setError('The email doesnt exist.')
        }
        setLoading(false);
    };

    //  Mobile view reset button ////
    async function handleMobileResetButton(e) {
        e.preventDefault();

        try {
            setLoading(true);
			setError("");

            await resetPassword(mobileEmailRef.current.value)
            setMessage(true)

        }catch{
            seTtoggleErrorMessage(true)
            setError('The email doesnt exist.')
        }
        setLoading(false);
    };

    return (
        <div className="relative w-screen h-screen flex items-center justify-center flex-col">

            <div className="absolute w-screen h-screen flex items-center justify-center">
                <img src={landingBg} alt="image" 
                    className="h-full w-full absolute" />   
                <div className="bg-darkshade bg-opacity-80 h-full w-full absolute"></div>             
            </div>

            {/* Desktop view ---------------------------------------------------------------------------------------------------------*/}

            <div className="relative bg-darkshade bg-opacity-70 w-[800px] h-[500px] rounded-xl sm:flex hidden flex-col gap-10 items-center justify-center overflow-hidden">
                
                     <img className="w-[120px] h-20"
                        src={kccLogo} alt="image" />

                    <div className={`${message? 'flex' : 'hidden'} border-2 border-green-600 w-72 rounded-lg text-center p-4`}>

                        <h1 className="font-poppins text-green-700">
                            Please check your email and follow the link to reset your password.
                        </h1>

                    </div>

                    <div className="flex gap-6 flex-col font-poppins">

                        <input className="h-10 w-72 outline-none bg-primary p-2 rounded-lg" type="text" placeholder='Email' ref={emailRef}/>

                    </div>

                    <h1 className={`${toggleErrorMessage ? 'flex' : 'hidden'} font-poppins`}>{error}</h1>

                    <button className="h-10 w-72 bg-highlight font-poppins text-primary rounded-lg 
                                        hover:scale-y-110 duration-300 ease-in-out transition-all"
                            onClick={handleResetButton}
                            disabled={loading}>
                        RESET PASSWORD
                    </button>
                    <a className="font-poppins text-sm hover:scale-110 duration-300 ease-in-out transition-all cursor-pointer text-highlight"
                        onClick={() => navigate("/")}>Go back to login?</a>          
             
            </div>

            {/* Mobile view ---------------------------------------------------------------------------------------------------------*/}

            <div className="sm:hidden flex relative w-screen h-screen items-center justify-center flex-col">

                <div className="absolute w-screen h-screen flex items-center justify-center">
                    <img src={landingBg} alt="image" 
                        className="h-full w-full absolute" />   
                    <div className="bg-darkshade bg-opacity-90 h-full w-full absolute"></div>             
                </div>

                <div className="relative w-[350px] h-[600px] rounded-xl flex items-center justify-center overflow-hidden">

                    <div className="relative w-[400px] h-full overflow-hidden">

                        <div className="w-full h-full absolute">
                            <img src={cardBg} alt="image" 
                                className="h-full w-full absolute" /> 
                            <div className="bg-darkshade bg-opacity-50 h-full w-full absolute"></div>  
                        </div>

                        <div className="relative h-full w-full flex items-center justify-center flex-col gap-4">

                            <img className="w-[120px] h-20"
                            src={kccLogo} alt="image" />

                            <div className={`${message? 'flex' : 'hidden'} border-2 border-green-600 w-72 rounded-lg text-center p-4`}>

                                <h1 className="font-poppins text-green-300">
                                    Please check your email and follow the link to reset your password.
                                </h1>

                            </div>

                            <div className="flex gap-6 flex-col font-poppins">

                                <input className="h-10 w-72 outline-none  bg-primary p-2 rounded-lg" type="text" placeholder='Email' ref={mobileEmailRef}/>

                            </div>

                            <h1 className={`${toggleErrorMessage ? 'flex' : 'hidden'} font-poppins text-red-400`}>{error}</h1>

                            <button className="h-10 w-72 bg-highlight font-poppins texprimary rounded-lg 
                                                hover:scale-y-110 duration-300 ease-in-out transition-all"
                                    onClick={handleMobileResetButton}
                                    disabled={loading}>
                                RESET PASSWORD
                            </button>
                            <a className="font-poppins text-sm hover:scale-110 duration-300 ease-in-out transition-all cursor-pointer text-highlight"
                                onClick={() => navigate("/")}>Go back to login?</a>          

                        </div>

                    </div>
                
                </div>


            </div>

        </div>
    )
}

export default ForgotPassword