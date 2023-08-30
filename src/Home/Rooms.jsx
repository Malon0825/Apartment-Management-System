import React, { useState, useRef, useEffect} from 'react';
import { getFirestore, addDoc, collection, doc, query, where, onSnapshot, updateDoc,  getDocs, getDoc, deleteDoc } from 'firebase/firestore';


const Rooms = (props) => {

    const db = getFirestore()
    const roomsColRef = collection(db, 'rooms')

    const [roomName, setRoomName] = useState('');
    const [deleteRoomName, setDeleteRoomName] = useState();
    const [error, setError] = useState('');
    const [roomType, setRoomType] = useState();
    const [roomOccupants, setRoomOccupants] = useState();

    const [toggleBedSpacer, seTtoggleBedSpacer] = useState(false);

    const [roomData, setRoomData] = useState([]);
    const [roomSearchData, setRoomSearchData] = useState();
    const [roomFilterData, setRoomFilterData] = useState();

    const [detailsRoomName, setDetailsRoomName] = useState();
    const [detailsRoomType, setDetailsRoomType] = useState();
    const [occupantsNumber, setOccupantsNumber] = useState();
    const [detailsRoomOccupancy, setDetailsRoomOccupancy] = useState();
    const [detailsRoomCreator, setDetailsRoomCreator] = useState();

    const [loading, setLoading] = useState(false);


    const { setWindowOverlay, setWindowMessage, userNameProp } = props;


    // useEffect hook to check if room name already exists
    useEffect(() => {
        const roomQuery = query(roomsColRef, where("room_name", "==", roomName));

        // listen for changes in the query result
        const unsubscribe = onSnapshot(roomQuery, (snapshot) => {

        if (snapshot.size > 0) {
            setError(`Room ${roomName} already exist.`)
        } else {
            setError('')
        }
        });

        
        return () => unsubscribe();
    }, [roomName]);

    // useEffect hook to check if room type is bed spacer
    useEffect(() => {
        if (roomType === 'Bed Spacer') {
            seTtoggleBedSpacer(true)
        } else {
            seTtoggleBedSpacer(false)
        }
    }, [roomType]);

    // handle room name input change
    const handleRoomNameChange = (e) => {
        setRoomName(e.target.value)
    };

    // handle room type input change
    const handleChangeRoomType = (e) => {
        setRoomType(e.target.value)
    };

    // handle room occupants number input change
    const handleChangeOccupants = (e) => {
        setRoomOccupants(e.target.value)
    };

    // handle room name input change
    const handleDeleteRoomNameChange = (e) => {
        setDeleteRoomName(e.target.value)
    };

    // handle add room button click
    const handleAddRoomButton = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            if (!error){

                // check if room name and room type are valid
                if (!roomName || roomType === 'None') {

                    setWindowOverlay(true)
                    setWindowMessage('Please fill-up all the empty fields!!')

                } else if (roomName && roomType === 'Whole Room') {

                    await addDoc(roomsColRef, {
                        room_name: roomName,
                        room_type: roomType,
                        occupancy: 'Vacant',
                        occupants_number: 1,
                        user_added: userNameProp,
                        });
                        setRoomName('')
                        setRoomOccupants('')
                        setWindowOverlay(true)
                        setWindowMessage(`You have successfully added Room ${roomName}.`)

                } else if (roomName && roomType === 'Bed Spacer') {

                    let occupants = parseInt(roomOccupants)

                    if(occupants > 1) {

                        await addDoc(roomsColRef, {
                            room_name: roomName,
                            room_type: roomType,
                            occupancy: 'Vacant',
                            occupants_number: occupants,
                            user_added: userNameProp,
                            });
                            setRoomName('')
                            setRoomOccupants('')
                            setWindowOverlay(true)
                            setWindowMessage(`You have successfully added Room ${roomName}.`)
                            

                    }else if (occupants == 1) {

                        setWindowOverlay(true)
                        setWindowMessage('Please select the "Whole Room" if the room is for one person only.')

                    }else if (occupants < 0) {

                        setWindowOverlay(true)
                        setWindowMessage('Please do not put negative value.')

                    }else{
                        setWindowOverlay(true)
                        setWindowMessage('Please put a valid number.') 
                    }

                } else {
                    setWindowOverlay(true)
                    setWindowMessage('Please select room type.') 
                }
            }else if (error) {

                setWindowOverlay(true)
                setWindowMessage(error)
            } 
            setLoading(false)
        } catch (err) {
            setWindowOverlay(true)
            setWindowMessage(`Failed to add room ${roomName}.`)
            setLoading(false)
        }
        
    };

    // Update the room data state with the filtered array
    const handleFilterBedSpacer = () => {
        const filteredRooms = roomSearchData.filter((room) => room.room_type === "Bed Spacer");
        setRoomData(filteredRooms)
      };

    const handleFilterWholeRoom = () => {
        const filteredRooms = roomSearchData.filter((room) => room.room_type === "Whole Room");
        setRoomData(filteredRooms)
    };

    // Update the list of rooms if the name if has match
    const searchRoomChange = (e) => {
        setRoomFilterData(e.target.value)
    };

    // Handle search value
    const handleRoomSearchClick = () => {
        setRoomData(roomSearchData)
    };

    // useEffect hook to query all rooms from database
    useEffect(() => {
        if (roomFilterData) {
            const filteredRooms = roomSearchData.filter((room) => room.room_name === roomFilterData);
            setRoomData(filteredRooms)          
        } else if (!roomFilterData) {
            const q = query(roomsColRef)
    
            onSnapshot(q, (snapshot) => {
            let rooms = [];
            snapshot.docs.forEach((doc) => {
                rooms.push({ ...doc.data(), id: doc.id })
            });
        
            setRoomData(rooms)
            setRoomSearchData(rooms)
            });
        }

    }, [roomFilterData]);

    // Handle room list item click
    const handleRoomDataClick = (roomName, roomType, occupancy, creator, occupantsNumber) => {
        setDetailsRoomName(roomName)
        setDetailsRoomType(roomType)
        setDetailsRoomOccupancy(occupancy)
        setDetailsRoomCreator(creator)
        setOccupantsNumber(occupantsNumber)
    };

    // Handle deleting of rooms
    const handleDeleteRoom = async () => {
        if (deleteRoomName) {
            try {
                const q = query(collection(db, "rooms"), where("room_name", "==", deleteRoomName));
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    // handle case where no room is found
                    setWindowOverlay(true)
                    setWindowMessage(`Room ${deleteRoomName} doesn't exist.`)
                } else {
                    // check if there is a tenant in the room
                    let occupied = false;
                    querySnapshot.forEach((doc) => {
                        if (doc.data().tennant_name) {
                            occupied = true;
                        }
                    });
                    if (occupied) {
                        setWindowOverlay(true)
                        setWindowMessage("The room is currently occupied.")
                    } else {
                        querySnapshot.forEach((doc) => {
                            deleteDoc(doc.ref);
                        });
                        setDeleteRoomName('')
                        setWindowOverlay(true)
                        setWindowMessage(`Room ${deleteRoomName} successfully deleted.`)
                    }
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            setWindowOverlay(true)
            setWindowMessage(`Please fill up the empty field.`)
        }
    };

    return (

        <div className="font-poppins p-4 flex gap-8">

            <div className="w-[800px] h-full relative flex gap-6 flex-col">
                
                <input className="h-16 w-[300] outline-none bg-transparent border-highlight border-b-2 text-center p-2 text-primary focus:outline-none
                                text-3xl"
                        onChange={searchRoomChange} 
                        onClick={handleRoomSearchClick}
                id='searchRoomName' type="text" placeholder='Search Room'/>

                <div className="relative flex overflow-hidden overflow-y-scroll scrollbar rounded-xl h-[600px]">

                    <div className="relative grid grid-cols-2 w-full h-min gap-4">
                        {roomData.map(rooms => (
                            <button
                                key={rooms.room_name}
                                onMouseEnter={() => handleRoomDataClick(rooms.room_name, rooms.room_type, rooms.occupancy, rooms.user_added, rooms.occupants_number)}
                                className="rooms-items-grid group "
                            >
                                Room: {rooms.room_name}
                                <h1 className="group-hover:flex group-focus:flex hidden text-xl text-primary">
                                    {rooms.room_type}                             
                                </h1>
                                <h2 className="group-hover:flex group-focus:flex flex-col hidden text-xl text-primary">
                                    {Array.isArray(rooms.tennant_name) ? rooms.tennant_name.map(name => (
                                        <span key={name}>
                                            Tenant: {name}
                                        </span>
                                    )) : null}
                                </h2>                              
                            </button>
                        ))}
                    </div>
                </div>     
            </div>

            {/* Adding rooms **************************************************************/}
            <div className="flex flex-col items-center gap-8 mt-2">
                <div className="flex items-center justify-center gap-4">
                    <button className="search-room-button" onClick={handleFilterWholeRoom}>Whole Room</button>
                    <button className="search-room-button" onClick={handleFilterBedSpacer}>Bed Spacer</button>

                </div>


                <div className="bg-grayblue bg-opacity-70 h-full w-full rounded-xl p-2 gap-2 flex flex-col">

                    <h1 className="text-highlight text-2xl p-2 rounded-xl text-center">
                        Room Data
                    </h1>
                    <label className="text-2xl text-secondary">Room: <span className="text-highlight">{detailsRoomName}</span></label>
                    <label className="text-2xl text-secondary">Type: <span className="text-highlight">{detailsRoomType}</span></label>
                    <label className="text-2xl text-secondary">Available: <span className="text-highlight">{occupantsNumber}</span></label>
                    <label className="text-2xl text-secondary">Occupancy: <span className="text-highlight">{detailsRoomOccupancy}</span></label>
                    <label className="text-2xl text-secondary">Creator: <span className="text-highlight">{detailsRoomCreator}</span></label>
                    
                </div>  

                <div className="flex flex-col items-center gap-4 relative">

                    <label className="text-highlight text-2xl bg-grayblue p-2 rounded-xl"
                    htmlFor="roomName">Add Room</label>

                    <div className="flex flex-col gap-4">

                        <input className="add-room-input" id='roomName' type="text" placeholder='Room Number' value={roomName} onChange={handleRoomNameChange} />

                        <select className="add-room-input" required onChange={handleChangeRoomType}>

                            <option className="" value="None" selected disabled>Room Type</option>
                            <option className="" value="Whole Room">Whole Room</option>
                            <option className="" value="Bed Spacer">Bed Spacer</option>
                        </select> 

                        <div className="flex gap-4">
                            <input className={`${toggleBedSpacer? 'flex' : 'hidden'} w-24 add-room-input no-spinners`} min={0} id='tennantDeposit' value={roomOccupants} type="number" placeholder='Numbers' onChange={handleChangeOccupants} />

                            <button className="w-full h-10 bg-highlight font-poppins text-grayblue rounded-lg font-semibold text-xl
                                                hover:scale-y-110 duration-300 ease-in-out transition-all"
                                    onClick={handleAddRoomButton}
                                    disabled={loading}>
                                DONE
                            </button>                             
                        </div>

                 
                    </div>

                </div> 

                <div className="rounded-xl gap-4 flex mb-2">
                    <input className="outline-none w-[180px] bg-grayblue p-2 rounded-lg focus:bg-grayblue text-primary focus:outline-none focus:outline-highlight" id='roomName' type="text" placeholder='Room Number' onChange={handleDeleteRoomNameChange} value={deleteRoomName} />
                    <button className="bg-highlight font-poppins px-2 text-grayblue rounded-lg font-semibold text-xl
                                        hover:scale-y-110 duration-300 ease-in-out transition-all"
                            onClick={handleDeleteRoom}>DELETE</button>
                </div>             
            </div>



        </div>
    )
}

export default Rooms
