import React, { useState, useRef } from 'react';
import { useAuth } from '../Context/Auth';
import { useNavigate } from 'react-router-dom';
import { getFirestore, addDoc, collection } from 'firebase/firestore'
import { landingBg, kccLogo, cardBg } from '../assets';

const Signup = () => {

    // Declerations ////
	const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [toggleErrorMessage, seTtoggleErrorMessage] = useState(false);
    const [togglePassword, setTogglePassword] = useState(false);

    const db = getFirestore()
    const colRef = collection(db, 'users')

	const { signup } = useAuth();
    let navigate = useNavigate();

    const userRef = useRef();
    const emailRef = useRef();
    const passRef = useRef();

    const mobileUserRef = useRef();
    const mobileEmailRef = useRef();
    const mobilePassRef = useRef();

    // Desktop signup button ////
    async function handleSignupButton(e) {
        e.preventDefault();

        try {
            setLoading(true);
			setError("");

            if (!emailRef.current.value || !userRef.current.value ||  !passRef.current.value){
                setError('Please fill-up all the empty fields')
                seTtoggleErrorMessage(true)

            }else{
                await signup(emailRef.current.value, passRef.current.value).then(cred => {
                    return addDoc(colRef, {
                    user_id: cred.user.uid,
                    user_name: userRef.current.value,
                    user_email: emailRef.current.value
                    })        
                })
                navigate("/home");
            }

        }catch{
            seTtoggleErrorMessage(true)
            setError('Failed to create an account')
        }
        setLoading(false);
    }

    // Mobile signup button ////
    async function handleMobileSignupButton(e) {
        e.preventDefault();

        try {
            setLoading(true);
			setError("");

            if (!mobileEmailRef.current.value || !mobileUserRef.current.value || !mobilePassRef.current.value){
                setError('Please fill-up all the empty fields')
                seTtoggleErrorMessage(true)

            }else{
                await signup(mobileEmailRef.current.value, mobilePassRef.current.value).then(cred => {
                    return addDoc(colRef, {
                    user_id: cred.user.uid,
                    user_name: mobileUserRef.current.value,
                    user_email: mobileEmailRef.current.value
                    })        
                })
                navigate("/home");
            }

        }catch{
            seTtoggleErrorMessage(true)
            setError('Failed to create an account')
        }
        setLoading(false);
    }

    // Password field visibility ////
    function toggleVisibilityTrue () {
        setTogglePassword(false)
    };
    
    function toggleVisibilityFalse () {
    setTogglePassword(true)
    };

    return (
        <div className="relative w-screen h-screen flex items-center justify-center flex-col">

            <div className="absolute w-screen h-screen flex items-center justify-center">
                <img src={landingBg} alt="image" 
                    className="h-full w-full absolute" />   
                <div className="bg-darkshade bg-opacity-80 h-full w-full absolute"></div>             
            </div>
             {/* Desktop view ---------------------------------------------------------------------------*/}
            <div className="sm:flex hidden relative bg-darkshade bg-opacity-70 w-[800px] h-[500px] rounded-xl flex-col gap-10 items-center justify-center overflow-hidden">
                
                     <img className="w-[120px] h-20"
                        src={kccLogo} alt="image" />

                    <div className="flex gap-6 flex-col font-poppins">

                        <input className="h-10 w-72 outline-none bg-primary p-2 rounded-lg" type="text" placeholder='User Name' ref={userRef}/> 

                        <input className="h-10 w-72 outline-none bg-primary p-2 rounded-lg" type="text" placeholder='Email' ref={emailRef}/>
                        
                        <div className="flex h-10 w-72 outline-none bg-primary rounded-lg items-center justify-center">

                                <input className="h-10 w-[250px] outline-none bg-primary p-2 rounded-lg" 
                                type={`${togglePassword? 'text' : 'password'}`} placeholder='Password' ref={passRef}/>

                                <a  onClick={toggleVisibilityTrue}
                                    className={`${togglePassword? 'flex' : 'hidden'} w-6 h-6 z-20 cursor-pointer`}>

                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                        onClick={toggleVisibilityTrue}
                                        className="w-6 h-6" viewBox="0 0 24 24" fill="none">

                                        <g id="SVGRepo_bgCarrier" stroke-width="0"/>

                                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

                                        <g id="SVGRepo_iconCarrier"> <path d="M9 4.45962C9.91153 4.16968 10.9104 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C3.75612 8.07914 4.32973 7.43025 5 6.82137" stroke="#000000" stroke-width="1.5" stroke-linecap="round"/> <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="#000000" stroke-width="1.5"/> </g>

                                    </svg>
                                </a>

                                <a onClick={toggleVisibilityFalse}

                                    className={`${togglePassword? 'hidden' : 'flex'} w-6 h-6 z-20 cursor-pointer`}>

                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                        className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#000000">

                                        <g id="SVGRepo_bgCarrier" stroke-width="0"/>

                                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

                                        <g id="SVGRepo_iconCarrier"> <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </g>

                                    </svg>            

                                </a>
                                                
                        </div>

                    </div>

                    <h1 className={`${toggleErrorMessage ? 'flex' : 'hidden'} font-poppins`}>{error}</h1>

                    <button className="h-10 w-72 bg-highlight font-poppins text-primary rounded-lg 
                                        hover:scale-y-110 duration-300 ease-in-out transition-all"
                            onClick={handleSignupButton}
                            disabled={loading}>
                        SIGNUP
                    </button>
                    <a className="font-poppins text-highlight text-sm hover:scale-110 duration-300 ease-in-out transition-all cursor-pointer"
                        onClick={() => navigate("/")}>Already have an account?</a>          
             
            </div>

            {/* Mobile view ---------------------------------------------------------------------------*/}
            <div className="sm:hidden flex w-full h-screen items-center justify-center">
                <div className="absolute w-full h-screen flex items-center justify-center">
                    <img src={landingBg} alt="image" 
                        className="h-full w-full absolute" />   
                    <div className="bg-darkshade bg-opacity-90 h-full w-full absolute"></div>             -
                </div>

                <div className="relative w-[350px] h-[600px] rounded-xl flex items-center justify-center overflow-hidden">

                    <div className="relative w-full h-full overflow-hidden ">

                        <div className="w-full h-full absolute">
                            <img src={cardBg} alt="image" 
                                className="h-full w-full absolute" /> 
                            <div className="bg-darkshade bg-opacity-50 h-full w-full absolute"></div>  
                        </div>

                        <div className="relative flex flex-col justify-center items-center w-full h-full gap-4">
                            <img className="w-[120px] h-20"
                            src={kccLogo} alt="image" />

                            <div className="flex gap-6 flex-col font-poppins">

                                <input className="h-10 w-72 outline-none bg-primary p-2 rounded-lg" type="text" placeholder='User Name' ref={mobileUserRef}/> 

                                <input className="h-10 w-72 outline-none bg-primary p-2 rounded-lg" type="text" placeholder='Email' ref={mobileEmailRef}/>
                                
                                <div className="flex h-10 w-72 outline-none bg-primary rounded-lg items-center justify-center">

                                    <input className="h-10 w-[250px] outline-none bg-primary p-2 rounded-lg" 
                                    type={`${togglePassword? 'text' : 'password'}`} placeholder='Password' ref={mobilePassRef}/>

                                    <a  onClick={toggleVisibilityTrue}
                                        className={`${togglePassword? 'flex' : 'hidden'} w-6 h-6 z-20 cursor-pointer`}>

                                        <svg xmlns="http://www.w3.org/2000/svg" 
                                            onClick={toggleVisibilityTrue}
                                            className="w-6 h-6" viewBox="0 0 24 24" fill="none">

                                            <g id="SVGRepo_bgCarrier" stroke-width="0"/>

                                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

                                            <g id="SVGRepo_iconCarrier"> <path d="M9 4.45962C9.91153 4.16968 10.9104 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C3.75612 8.07914 4.32973 7.43025 5 6.82137" stroke="#000000" stroke-width="1.5" stroke-linecap="round"/> <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="#000000" stroke-width="1.5"/> </g>

                                        </svg>
                                    </a>

                                    <a onClick={toggleVisibilityFalse}

                                        className={`${togglePassword? 'hidden' : 'flex'} w-6 h-6 z-20 cursor-pointer`}>

                                        <svg xmlns="http://www.w3.org/2000/svg" 
                                            className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#000000">

                                            <g id="SVGRepo_bgCarrier" stroke-width="0"/>

                                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

                                            <g id="SVGRepo_iconCarrier"> <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </g>

                                        </svg>            

                                    </a>
                                                
                                </div>

                            </div>

                            <h1 className={`${toggleErrorMessage ? 'flex' : 'hidden'} font-poppins`}>{error}</h1>

                            <button className="h-10 w-72 bg-highlight font-poppins text-primary rounded-lg 
                                                hover:scale-y-110 duration-300 ease-in-out transition-all"
                                    onClick={handleMobileSignupButton}
                                    disabled={loading}>
                                SIGNUP
                            </button>
                            <a className="font-poppins text-sm hover:scale-110 duration-300 ease-in-out transition-all cursor-pointer text-highlight"
                                onClick={() => navigate("/")}>Already have an account?</a>                             
                        </div>

                    </div>
                
                </div>
            </div>

        </div>
    )
}

export default Signup