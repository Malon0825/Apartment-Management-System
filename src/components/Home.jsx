import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/Auth';
import { useNavigate } from 'react-router-dom';
import { landingBg, kccLogo } from '../assets';
import { Hero, Rooms, Tennants, Billings, Profile } from '../Home';
import { getFirestore, addDoc, collection, doc, query, where, onSnapshot, updateDoc,  getDocs, getDoc } from 'firebase/firestore'


const Home = () => {

	const db = getFirestore()
    const roomsColRef = collection(db, 'rooms')  
    const userColRef = collection(db, 'users');

    const [userId, setUserID] = useState();
    const [userName, setUserName] = useState();
    const [userInitial, setUserInitial] = useState();
    const [loading, setLoading] = useState(false);

	const [toggleHero, setToggleHero] = useState(true);
	const [toggleProfile, setToggleProfile] = useState(false);
	const [toggleRooms, setToggleRooms] = useState(false);
	const [toggleTennants, setToggleTennants] = useState(false);
	const [toggleBillings, setToggleBillings] = useState(false);

	const [windowOverlay, setWindowOverlay] = useState();
	const [windowMessage, setWindowMessage] = useState();


	const { logout, currentUserId } = useAuth()
	let navigate = useNavigate()

	async function handleLogout() {

		try {
		await logout()
		navigate("/")
		}catch {
		}
	}

	function handleClickHome () {
		setToggleHero(true);
		setToggleProfile(false);
		setToggleRooms(false);
		setToggleTennants(false);
		setToggleBillings(false);
	}

	function handleClickRooms () {
		setToggleHero(false);
		setToggleProfile(false);
		setToggleRooms(true);
		setToggleTennants(false);
		setToggleBillings(false);
	}

	function handleClickTennants () {
		setToggleHero(false);
		setToggleProfile(false);
		setToggleRooms(false);
		setToggleTennants(true);
		setToggleBillings(false);
	}

	function handleClickBillings () {
		setToggleHero(false);
		setToggleProfile(false);
		setToggleRooms(false);
		setToggleTennants(false);
		setToggleBillings(true);
	}

	function handleClickProfile () {
		setToggleHero(false);
		setToggleProfile(true);
		setToggleRooms(false);
		setToggleTennants(false);
		setToggleBillings(false);
	}

	useEffect(() => {
        const currentUserQuery = query(userColRef, where("user_id", "==", currentUserId));

        onSnapshot(currentUserQuery, (snapshot) => {
            let users = []
            snapshot.docs.forEach((doc) => {
              users.push({ ...doc.data(), id: doc.id})
            })
            
            users.map((user) => {
                setUserID(user.id) 
                setLoading(true)      
            })
          })

    }, [currentUserId])

    useEffect(() => {

        if (loading) {
            userData()
        }

    }, [loading]);



    function userData(){
        const docRef = doc(db, 'users', userId)

        getDoc(docRef).then(function(doc) {
            if (doc.exists) {
      
                const userName = doc.data().user_name
                setUserName(userName)
                const fisrtLetter = Array.from(userName)[0]
                const upperCase = fisrtLetter.toUpperCase()
                setUserInitial(upperCase)

                setLoading(false)    
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });   
    }

  return (
	<div className="relative w-screen h-screen flex items-center justify-center flex-col">

	{/* Desktop view **********************************************************************************************/}
		<div className="sm:flex hidden relative w-screen h-full overflow-x-hidden">
			
			<div className="absolute w-full h-full flex items-center justify-center">
				<img src={landingBg} alt="image" 
					className="h-full w-full absolute" />   
				<div className="bg-darkshade bg-opacity-80 h-full w-full absolute"></div>             
			</div>

			{/* Side navigation bar *********************************************************************************************/}
			<div className="bg-darkshade bg-opacity-90 sticky left-0 top-4 w-[300px] h-[95vh] mt-4 ml-4 rounded-2xl flex items-center flex-col gap-4">

				<div className="relative bg-grayblue bg-opacity-50 w-40 h-40 mt-10 rounded-full flex justify-center group hover:scale-105 transition-all duration-500 ease-in-out">

					<img className="absolute group-hover:hidden mt-4 scale-125"
						src={kccLogo} alt="logo" />

					<div className="h-full w-full rounded-full absolute bottom-0 items-center justify-center overflow-hidden group-hover:scale-110 hover:overflow-visible hover:bg-opacity-10 transition-all duration-500 ease-in-out cursor-pointer group-hover:flex hidden">
						<h1 className="text-highlight font-poppins text-[120px] font-semibold hover:scale-125 transition-all duration-500 ease-in-out cursor-pointer">
							{userInitial}
						</h1>

					</div>

				</div>

				<button onClick={handleClickHome}
					className={`${toggleHero? 'navbar-tab-focus' : ''} navbar-tab mt-10`}>
					<a className="navbar-text">
						<svg className="w-10 h-10 absolute left-2"
							xmlns="http://www.w3.org/2000/svg" 
							viewBox="0 0 24 24" fill="none">
							<g id="SVGRepo_bgCarrier" stroke-width="0"/>
							<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
							<g id="SVGRepo_iconCarrier"> <path d="M9 16C9.85038 16.6303 10.8846 17 12 17C13.1154 17 14.1496 16.6303 15 16" stroke="#c17555" stroke-width="0.8" stroke-linecap="round"/> <path d="M21.6359 12.9579L21.3572 14.8952C20.8697 18.2827 20.626 19.9764 19.451 20.9882C18.2759 22 16.5526 22 13.1061 22H10.8939C7.44737 22 5.72409 22 4.54903 20.9882C3.37396 19.9764 3.13025 18.2827 2.64284 14.8952L2.36407 12.9579C1.98463 10.3208 1.79491 9.00229 2.33537 7.87495C2.87583 6.7476 4.02619 6.06234 6.32691 4.69181L7.71175 3.86687C9.80104 2.62229 10.8457 2 12 2C13.1543 2 14.199 2.62229 16.2882 3.86687L17.6731 4.69181C19.9738 6.06234 21.1242 6.7476 21.6646 7.87495" stroke="#c17555" stroke-width="0.8" stroke-linecap="round"/> </g>

						</svg>
						<span className="relative left-16">Home</span>
					</a>
				</button>


				<button onClick={handleClickRooms}
					className={`${toggleRooms? 'navbar-tab-focus' : ''} navbar-tab`}>
					<a className="navbar-text">

						<svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 absolute left-2" viewBox="0 0 24 24" fill="none">
							<g id="SVGRepo_bgCarrier" stroke-width="0"/>
							<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
							<g id="SVGRepo_iconCarrier"> <path d="M3 21.0001L14 21V5.98924C14 4.6252 14 3.94318 13.7187 3.47045C13.472 3.05596 13.0838 2.74457 12.6257 2.59368C12.1032 2.42159 11.4374 2.56954 10.1058 2.86544L7.50582 3.44322C6.6117 3.64191 6.16464 3.74126 5.83093 3.98167C5.53658 4.19373 5.30545 4.48186 5.1623 4.8152C5 5.19312 5 5.65108 5 6.56702V21.0001M13.994 5.00007H15.8C16.9201 5.00007 17.4802 5.00007 17.908 5.21805C18.2843 5.4098 18.5903 5.71576 18.782 6.09209C19 6.51991 19 7.07996 19 8.20007V21.0001H21M11 12.0001H11.01" stroke="#c17555" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/> </g>
						</svg>
						<span className="relative left-16">Rooms</span>
					</a>
				</button>


				<button onClick={handleClickTennants}
					className={`${toggleTennants? 'navbar-tab-focus' : ''} navbar-tab`}>
					<a className="navbar-text">

					<svg className="w-10 h-10 absolute left-2"
						xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" viewBox="0 0 24 24" fill="none">
						<g id="SVGRepo_bgCarrier" stroke-width="0"/>
						<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
						<g id="SVGRepo_iconCarrier"> <circle cx="12" cy="6" r="4" stroke="#c17555" stroke-width="0.8"/> <path d="M19.9975 18C20 17.8358 20 17.669 20 17.5C20 15.0147 16.4183 13 12 13C7.58172 13 4 15.0147 4 17.5C4 19.9853 4 22 12 22C14.231 22 15.8398 21.8433 17 21.5634" stroke="#c17555" stroke-width="0.8" stroke-linecap="round"/> </g>

					</svg>
						<span className="relative left-16">Tennants</span>
					</a>

				</button>


				<button onClick={handleClickBillings}
					className={`${toggleBillings? 'navbar-tab-focus' : ''} navbar-tab`}>
					<a className="navbar-text">
					<svg className="w-10 h-10 absolute left-2"
						xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" viewBox="0 0 24 24" fill="none">
						<g id="SVGRepo_bgCarrier" stroke-width="0"/>
						<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
						<g id="SVGRepo_iconCarrier"> <path d="M10.5 11L17 11" stroke="#c17555" stroke-width="0.8" stroke-linecap="round"/> <path d="M7 11H7.5" stroke="#c17555" stroke-width="0.8" stroke-linecap="round"/> <path d="M7 7.5H7.5" stroke="#c17555" stroke-width="0.8" stroke-linecap="round"/> <path d="M7 14.5H7.5" stroke="#c17555" stroke-width="0.8" stroke-linecap="round"/> <path d="M17 14.5H16M10.5 14.5H13.5" stroke="#c17555" stroke-width="0.8" stroke-linecap="round"/> <path d="M17 7.5H14M10.5 7.5H11.5" stroke="#c17555" stroke-width="0.8" stroke-linecap="round"/> <path d="M21 7V6.37006C21 5.17705 21 4.58055 20.842 4.09946C20.5425 3.18719 19.8468 2.47096 18.9606 2.16261C18.4933 2 17.9139 2 16.755 2H7.24502C6.08614 2 5.50671 2 5.03939 2.16261C4.15322 2.47096 3.45748 3.18719 3.15795 4.09946C3 4.58055 3 5.17705 3 6.37006V15M21 11V20.3742C21 21.2324 20.015 21.6878 19.3919 21.1176C19.0258 20.7826 18.4742 20.7826 18.1081 21.1176L17.625 21.5597C16.9834 22.1468 16.0166 22.1468 15.375 21.5597C14.7334 20.9726 13.7666 20.9726 13.125 21.5597C12.4834 22.1468 11.5166 22.1468 10.875 21.5597C10.2334 20.9726 9.26659 20.9726 8.625 21.5597C7.98341 22.1468 7.01659 22.1468 6.375 21.5597L5.8919 21.1176C5.52583 20.7826 4.97417 20.7826 4.6081 21.1176C3.985 21.6878 3 21.2324 3 20.3742V19" stroke="#c17555" stroke-width="0.8" stroke-linecap="round"/> </g>
					</svg>
						<span className="relative left-16">Billings</span>
					</a>
				</button>



				<button className="absolute bottom-3 w-[200px] rounded-2xl focus:outline focus:bg-transparent focus:outline-highlight hover:bg-highlight hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer"
						onClick={handleLogout}>
					<a className="text-3xl text-highlight p-2 font-light flex items-center relative hover:bg-darkshade
								 rounded-2xl transition-all duration-500 ease-in-out">
						<svg className="w-10 h-10 absolute left-2"
												xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" viewBox="0 0 24 24" fill="none">
												<g id="SVGRepo_bgCarrier" stroke-width="0"/>
												<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
												<g id="SVGRepo_iconCarrier"> <path d="M15 12L6 12M6 12L8 14M6 12L8 10" stroke="#c17555" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12 21.9827C10.4465 21.9359 9.51995 21.7626 8.87865 21.1213C8.11027 20.3529 8.01382 19.175 8.00171 17M16 21.9983C18.175 21.9862 19.3529 21.8897 20.1213 21.1213C21 20.2426 21 18.8284 21 16V14V10V8C21 5.17157 21 3.75736 20.1213 2.87868C19.2426 2 17.8284 2 15 2H14C11.1715 2 9.75733 2 8.87865 2.87868C8.11027 3.64706 8.01382 4.82497 8.00171 7" stroke="#c17555" stroke-width="0.8" stroke-linecap="round"/> <path d="M3 9.5V14.5C3 16.857 3 18.0355 3.73223 18.7678C4.46447 19.5 5.64298 19.5 8 19.5M3.73223 5.23223C4.46447 4.5 5.64298 4.5 8 4.5" stroke="#c17555" stroke-width="0.8" stroke-linecap="round"/> </g>
						</svg>
						<span className="relative left-16">Logout</span>
					</a>
				</button>

			</div>

			{/* Main content window **********************************************************************************************/}
			<div className="w-[77vw] h-[95vh] bg-darkshade relative top-4 left-4 rounded-2xl bg-opacity-90 overflow-hidden">

				<div className={`${toggleHero? 'flex' : 'hidden'} `}>
					<Hero/>
				</div>

				<div className={`${toggleRooms? 'flex' : 'hidden'} `}>
					<Rooms setWindowOverlay={setWindowOverlay} setWindowMessage={setWindowMessage} userNameProp={userName}/>
				</div>

				<div className={`${toggleTennants? 'flex' : 'hidden'} `}>
					<Tennants setWindowOverlay={setWindowOverlay} setWindowMessage={setWindowMessage} userNameProp={userName}/>
				</div>

				<div className={`${toggleBillings? 'flex' : 'hidden'} `}>
					<Billings/>
				</div>

				<div className={`${toggleProfile? 'flex' : 'hidden'} `}>
					<Profile/>
				</div>


			</div>

			<div className={`${windowOverlay? 'flex' : 'hidden'} w-screen h-screen absolute bg-darkshade bg-opacity-80 items-center justify-center`}>
				<div className=" relative w-[400px] h-[300px] bg-grayblue bg-opacity-80 rounded-xl font-poppins flex p-4 flex-col items-center">
					<h1 className=" text-3xl font-light text-highlight">Alert</h1>
					<p className="text-2xl text-center mt-6 text-secondary">{windowMessage}</p>

					<button className="main-button absolute bottom-6"
							onClick={() => setWindowOverlay(false)}>
                                CONTINUE
                    </button>
					
				</div>
			</div>
		</div>


		
	</div>
  )
}

export default Home