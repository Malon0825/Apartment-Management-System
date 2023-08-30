import React, { useState, useRef, useEffect } from 'react';
import { kccLogo } from '../assets';
import { useAuth } from '../Context/Auth';
import { getFirestore, collection, query, updateDoc, where, getDocs, getDoc, doc, onSnapshot } from 'firebase/firestore';

const Profile = () => {
    const db = getFirestore();
    const userColRef = collection(db, 'users');
    
    const [toggleEdit, settoggleEdit] = useState(false);
    const [userId, setUserID] = useState();

    const [username, setUsername] = useState("");
    const [userProfile, setUserProfile] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  
    const userRef = useRef();
    const { currentUserId } = useAuth();

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
                setUsername(userName)
                const fisrtLetter = Array.from(userName)[0]
                const upperCase = fisrtLetter.toUpperCase()
                setUserProfile(upperCase)

                const user_email = doc.data().user_email
                setUserEmail(user_email)

                setLoading(false)
      
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });    
    }
  
    function handleClickEdit() {
      settoggleEdit(true);
    }
  
    function handleClickBack() {
      settoggleEdit(false);
    }
  
    async function handleClickContinue() {
        const newUsername = userRef.current.value;
        if(!newUsername) {
            setError("Please put your username.")
        }else{
            try {
            const currentUserQuery = query(userColRef, where("user_id", "==", currentUserId));
            const querySnapshot = await getDocs(currentUserQuery);
            const currentUserDocRef = doc(db, 'users', querySnapshot.docs[0].id);
        
            await updateDoc(currentUserDocRef, {
                user_name: newUsername,
            });
            } catch (error) {
            console.error(error);
            }
        
            settoggleEdit(false);
        }
      }

    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center gap-60">

            <div className={`${toggleEdit? 'flex' : 'hidden'} absolute w-full h-full z-20 items-center justify-center`}>

                <div className="w-[800px] h-[500px] bg-white rounded-xl flex flex-col items-center justify-center gap-10">

                    <img className="w-[120px] h-20"
                        src={kccLogo} alt="image" />

                    <h1 className="font-poppins text-lg text-red-400">
                            {error}
                    </h1>

                    <div className="flex gap-6 flex-col font-poppins">

                        <input className="h-10 w-72 outline-none bg-blue-50 p-2 rounded-lg" type="text" placeholder='New Username' ref={userRef}/> 

                        <div className="flex gap-2">
                            <button className="h-10 w-[140px] bg-blue-500 font-poppins text-white rounded-lg 
                                            hover:scale-y-110 duration-300 ease-in-out transition-all"
                                    onClick={handleClickBack}>
                            BACK
                            </button>
                            <button className="h-10 w-[140px] bg-blue-500 font-poppins text-white rounded-lg 
                                            hover:scale-y-110 duration-300 ease-in-out transition-all"
                                    onClick={handleClickContinue}>
                            CONTINUE
                            </button>                            
                        </div>


                    </div>

                </div>

            </div>

            <div className={`${toggleEdit? 'hidden' : 'flex'} relative w-full flex-col items-center justify-center gap-60`}>
                    
                    <div className="h-[500px] w-[350px] bg-white bg-opacity-50 absolute left-0 rounded-3xl flex items-center justify-center overflow-hidden">
                        <h1 className="font-poppins text-[400px] font-semibold text-blue-700 opacity-80 animate-bounce hover:animate-none cursor-pointer">
                            {userProfile}
                        </h1>
                    </div>

                    <div className="h-[500px] absolute right-0 flex flex-col justify-center text-white">

                        <div className="flex">
                            <h1 className="font-poppins text-[150px] font-semibold">{username}</h1>    

                            <button className="text-[30px] bg-blue-500 bg-opacity-50 w-[130px] h-14 rounded-xl flex items-center justify-center gap-4 hover:animate-pulse hover:scale-110 transition-all duration-300 ease-in-out"
                                    onClick={handleClickEdit}>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  
                                    className="w-8 h-8" 
                                    viewBox="0 -0.5 21 21" version="1.1">
                                    
                                    <title>edit_text_bar [#1373]</title>
                                    <desc>Created with Sketch.</desc>
                                    <defs>

                                    </defs>
                                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <g id="Dribbble-Light-Preview" transform="translate(-339.000000, -800.000000)" fill="#ffffff">
                                                <g id="icons" transform="translate(56.000000, 160.000000)">
                                                    <path d="M286.15,654 C285.5704,654 285.1,653.552 285.1,653 L285.1,647 C285.1,646.448 285.5704,646 286.15,646 C286.7296,646 287.2,645.552 287.2,645 C287.2,644.448 286.7296,644 286.15,644 L285.1,644 C283.93975,644 283,644.895 283,646 L283,654 C283,655.105 283.93975,656 285.1,656 L286.15,656 C286.7296,656 287.2,655.552 287.2,655 C287.2,654.448 286.7296,654 286.15,654 M301.9,644 L294.55,644 C293.9704,644 293.5,644.448 293.5,645 C293.5,645.552 293.9704,646 294.55,646 L300.85,646 C301.4296,646 301.9,646.448 301.9,647 L301.9,653 C301.9,653.552 301.4296,654 300.85,654 L294.55,654 C293.9704,654 293.5,654.448 293.5,655 C293.5,655.552 293.9704,656 294.55,656 L301.9,656 C303.06025,656 304,655.105 304,654 L304,646 C304,644.895 303.06025,644 301.9,644 M293.5,659 C293.5,659.552 293.0296,660 292.45,660 L288.25,660 C287.6704,660 287.2,659.552 287.2,659 C287.2,658.448 287.6704,658 288.25,658 L289.3,658 L289.3,642 L288.25,642 C287.6704,642 287.2,641.552 287.2,641 C287.2,640.448 287.6704,640 288.25,640 L292.45,640 C293.0296,640 293.5,640.448 293.5,641 C293.5,641.552 293.0296,642 292.45,642 L291.4,642 L291.4,658 L292.45,658 C293.0296,658 293.5,658.448 293.5,659" id="edit_text_bar-[#1373]">

                                    </path>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                                
                                Edit
                            </button>                
                        </div>


                        <div className="flex gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                className="h-14 w-14 animate-bounce" viewBox="0 0 24 24" fill="none">

                                <g id="SVGRepo_bgCarrier" stroke-width="0"/>

                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

                                <g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.03491 12.0867C3.47113 7.07306 7.8902 3 12.8523 3C15.7196 3 17.8266 3.9395 19.1651 5.39621C20.5022 6.85138 21.1747 8.93345 20.9611 11.4231C20.5044 14.9552 19.0656 16.0367 18.2488 16.214C17.8183 16.3075 17.4767 16.1935 17.2699 16.0157C17.0753 15.8483 16.9301 15.5668 16.9903 15.1395L17.9912 7.63216C18.0642 7.08472 17.6796 6.58176 17.1322 6.50877C16.5847 6.43578 16.0818 6.8204 16.0088 7.36784L15.9567 7.75854C15.4146 7.10868 14.7082 6.5939 13.8497 6.28585C10.9247 5.23623 7.78714 7.14862 6.6724 10.1682C5.55654 13.1908 6.71512 16.6608 9.65021 17.714C11.6179 18.4201 13.6817 17.7858 15.1612 16.3758C15.328 16.8251 15.6029 17.22 15.9658 17.5321C16.6868 18.1521 17.6813 18.3838 18.6731 18.1685C20.6993 17.7287 22.4458 15.5789 22.9475 11.657C22.9492 11.6438 22.9506 11.6306 22.9518 11.6174C23.2107 8.66121 22.4226 5.9854 20.6378 4.04299C18.8509 2.09828 16.1674 1 12.8523 1C6.83759 1 1.56725 5.88148 1.04244 11.9133C0.512091 18.0087 5.01427 23 11.1008 23C13.002 23 14.1991 22.8445 15.9667 22.0972C16.4754 21.8821 16.7134 21.2954 16.4984 20.7867C16.2833 20.278 15.6966 20.04 15.1879 20.2551C13.7302 20.8714 12.8133 21 11.1008 21C6.21043 21 2.60422 17.0367 3.03491 12.0867ZM8.54863 10.8608C9.38014 8.60848 11.5269 7.5772 13.1742 8.16832C14.8114 8.75582 15.7817 10.8897 14.9513 13.139C14.1198 15.3914 11.973 16.4227 10.3257 15.8316C8.68852 15.2441 7.71826 13.1102 8.54863 10.8608Z" fill="#ffffff"/> </g>

                            </svg>

                            <h1 className="text-5xl">
                                {userEmail}
                            </h1>
                        </div>
                    </div>
            
            

            </div>
        </div>
    )
}

export default Profile