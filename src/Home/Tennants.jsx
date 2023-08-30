import React, { useState, useRef, useEffect} from 'react';
import { getFirestore, addDoc, collection, query, where, onSnapshot, getDocs, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore'

const Tennants = (props) => {

	const db = getFirestore()
	const roomsColRef = collection(db, 'rooms')
	const tennantsColRef = collection(db, 'tennants')

	const [tennantData, setTennantData] = useState([]);
	const [filteredTennantData, setFilteredTennantData] = useState([]);

	const [tennantName, setTennantName] = useState('');
	const [tennantGender, setTennantGender] = useState('Gender');
	const [tennantRoom, setTennantRoom] = useState('Room');
	const [tennantDeposit, setTennantDeposit] = useState('');
	const [tennantPhoneNumber, setTennantPhoneNumber] = useState('');

	const [deleteTennant, setDeleteTennant] = useState('');
	const [deleteRoomTennant, setDeleteRoomTennant] = useState([]);
	const [tennantRoomQuery, setTennantRoomQuery] = useState([]);
	const [updateRoomOccupantNumbers, setUpdateRoomOccupantNumbers] = useState('');
	const [updateRoomType, setUpdateRoomType] = useState('');

	const [tennantVacantRoom, setTennantVacantRoom] = useState([]);
	const [occupantsValue, setOccupantsValue] = useState('');
	const [occupantsRoom, setOccupantsRoom] = useState('');
	const [updateRoomValue, setUpdateRoomValue] = useState([]);

	const [error, setError] = useState('');
	const [roomVacant, setRoomVacant] = useState([]);
	const [roomFilterData, setRoomFilterData] = useState();

	const [detailsName, setDetailsName] = useState();
	const [detailsGender, setDetailsGender] = useState();
	const [detailsRoom, setDetailsRoom] = useState();
	const [detailsDeposit, setDetailsDeposit] = useState();
	const [detailsPhoneNumber, setDetailsPhoneNumber] = useState();
	const [detailsCreator, setDetailsCreator] = useState();

	const [loading, setLoading] = useState(false);
	const [toggleEditView, setToggleEditView] = useState(false);
	const [toggleUpdateView, setToggleUpdateView] = useState(false);

	//Update usestates
	const [updateTenantName, setUpdateTenantName] = useState('');
	const [updateTenantGender, setUpdateTenantGender] = useState('');
	const [updateTennantRoom, setUpdateTenantRoom] = useState([]);
	const [updateTenantDeposit, setUpdateTenantDeposit] = useState('');
	const [updateTenantPhoneNumber, setUpdateTenantPhoneNumber] = useState('');


	const { setWindowOverlay, setWindowMessage, userNameProp } = props;

	 // useEffect hook to query all tennants from database
    useEffect(() => {
        if (roomFilterData) {
            const filteredTennants = roomSearchData.filter((tennant) => tennant.name === filteredTennantData);
            setTennantData(filteredTennants)         
        } else if (!roomFilterData) {
            const tennantQuery = query(tennantsColRef)
    
            onSnapshot(tennantQuery, (snapshot) => {
            let tennants = [];
            snapshot.docs.forEach((doc) => {
                tennants.push({ ...doc.data(), id: doc.id })
            });
        
            setTennantData(tennants)
            setFilteredTennantData(tennants)
            });
        }

    }, [roomFilterData]);

	// useEffect hook to query all vacant rooms 
	useEffect(() => {
		const vacantRoomQuery = query(roomsColRef, where("occupancy", "==", "Vacant"));
    
		onSnapshot(vacantRoomQuery, (snapshot) => {
		let rooms = [];
		snapshot.docs.forEach((doc) => {
			rooms.push({ ...doc.data(), id: doc.id })
		});
	
		setRoomVacant(rooms)
		});

	}, []);

	// useEffect hook to check if tennant name already exists
    useEffect(() => {
        const tennantNameQuery = query(tennantsColRef, where("name", "==", tennantName));

        // listen for changes in the query result
        const unsubscribe = onSnapshot(tennantNameQuery, (snapshot) => {

        if (snapshot.size > 0) {
            setError(`A tennant named ${tennantName} already exists`)
        } else {
            setError('')
        }
        });
       
        return () => unsubscribe();
    }, [tennantName]);

	// useEffect hook to check if tennant name already exists
    useEffect(() => {
        const tennantNameQuery = query(tennantsColRef, where("phone_number", "==", tennantPhoneNumber));

        // listen for changes in the query result
        const unsubscribe = onSnapshot(tennantNameQuery, (snapshot) => {

        if (snapshot.size > 0) {
            setError(`The phone number already exist`)
        } else {
            setError('')
        }
        });
       
        return () => unsubscribe();
    }, [tennantPhoneNumber]);

	// handle chnage name input change
	const handleChangeName = (e) => {
		setTennantName(e.target.value)
	};

	// handle change gender input change
	const handleChangeGender = (e) => {
		setTennantGender(e.target.value)
	};

	// handle change room input change
	const handleChangeRoom = (e) => {
		setTennantRoom(e.target.value)
	};

	// handle change deposit input change
	const handleChangeDeposit = (e) => {
		setTennantDeposit(e.target.value)
	};

	
	// handle change deposit input change
	const handleChangePhoneNumber = (e) => {
		setTennantPhoneNumber(e.target.value)
	};

  	// handle add tennant button click
	const handleAddTennantButton = async (e) => {
		e.preventDefault();

		if (tennantName && tennantGender != "Gender" && tennantRoom != "Room" && tennantDeposit && tennantPhoneNumber) {
			try {
				await addDoc(tennantsColRef, {
					name: tennantName,
					gender: tennantGender,
					room: tennantRoom,
					deposit: tennantDeposit,
					phone_number: tennantPhoneNumber,
					creator: userNameProp
				});
				fetchData()
				setTennantName('')
				setTennantGender("Gender")
				setTennantRoom("Room")
				setTennantDeposit('')
				setTennantPhoneNumber('')
				setWindowOverlay(true)
				setWindowMessage(`You have successfully added ${tennantName}.`) 
			} catch (err) {
				console.log(err)
			}			
		} else {
			setWindowOverlay(true)
			setWindowMessage(`Please make sure to fillup all the empty fields.`) 
		}

	};

	// UseEffect hook to get the selected room for tennant
	useEffect(() => {
		if (tennantRoom) {

			const tennantRoomQuery = query(roomsColRef, where("room_name", "==", tennantRoom));
    
			onSnapshot(tennantRoomQuery, (snapshot) => {
			let tennantRoom = [];
			snapshot.docs.forEach((doc) => {
				tennantRoom.push({ ...doc.data(), id: doc.id })
			});
			setTennantVacantRoom(tennantRoom)
			});	
				
		}
	}, [tennantRoom]);

	// UseEffect hook to convert arrary value to number
	useEffect(() => {
		if (tennantVacantRoom) {
			setUpdateRoomValue(tennantVacantRoom)
			getRoom()
		}
		function getRoom ()	{
			tennantVacantRoom.find(room => {
				const n = room.occupants_number
				setOccupantsValue(n)
			})
		}
	}, [tennantVacantRoom]);
	

	const fetchData = async () => {

		if (occupantsValue > 1) {

			const occupantsNumber = occupantsValue - 1

			const tennantRoomQuery = query(roomsColRef, where("room_name", "==", tennantRoom));
			const querySnapshot = await getDocs(tennantRoomQuery);
			querySnapshot.forEach((doc) => {
				updateDoc(doc.ref, { 
					occupancy: 'Vacant',
					occupants_number: occupantsNumber,
					tennant_name: arrayUnion(tennantName)
				})
			})
			console.log("Entered bed spacer")
		} else if (occupantsValue == 1) {

			const occupantsNumber = occupantsValue - 1

			const tennantRoomQuery = query(roomsColRef, where("room_name", "==", tennantRoom));
			const querySnapshot = await getDocs(tennantRoomQuery);
			querySnapshot.forEach((doc) => {
				updateDoc(doc.ref, { 
					occupancy: 'Occupied',
					occupants_number: occupantsNumber,
					tennant_name: arrayUnion(tennantName)
				})
			})
			console.log("Entered whole room")
			
		}		
	};

	// Update the room data state with the filtered array
	const handleViewTennant = () => {
	};

	const handleEditTennant = () => {
	};

	// Update the list of rooms if the name if has match
	const searchRoomChange = (e) => {
	};

	const handleRoomSearchClick = () => {
	};

	// useEffect hook to query all rooms from database
	useEffect(() => {
	}, [roomFilterData]);

	// Handle room list item click
	const handleRoomDataOnMouseEnter = (name, gender, room, deposit, phoneNumber, creator) => {

		setDetailsName(name);
		setDetailsGender(gender);
		setDetailsRoom(room);
		setDetailsDeposit(deposit);
		setDetailsPhoneNumber(phoneNumber);
		setDetailsCreator(creator);
		setToggleEditView(false);
	};

	// handle delete tennant input change
	const handleDeleteTenantInput= (e) => {
		setDeleteTennant(e.target.value)
	};

	// Delete tenant from the grid view
	const onMouseEnterHandleDeleteTenant  = () => {
		deleteTennantFromFirestore();
	};

	// Delete tenant from input field
	const handleDeleteTenant = () => {

		if (deleteTennant) {
			deleteTennantFromFirestore();
		} else {
			  setWindowOverlay(true);
			  setWindowMessage(`Please fillup the empty field.`);			
		}

	};
	
	useEffect(() => {	
		setDeleteTennant(detailsName);
	}, [detailsName])

	// Function to delete tenant from firestore
	const deleteTennantFromFirestore =  async () => {

		try {
			const q = query(tennantsColRef, where("name", "==", deleteTennant));
			onSnapshot(q, (snapshot) => {
				let deleteTennant = [];
				snapshot.docs.forEach((doc) => {
					deleteTennant.push({ ...doc.data(), id: doc.id })
				});
				setDeleteRoomTennant(deleteTennant);
			});	
			const querySnapshot = await getDocs(q);
			if (querySnapshot.empty) {
  
			  setWindowOverlay(true);
			  setWindowMessage(`${deleteTennant} doesn't exist.`);
			} else {
				querySnapshot.forEach((doc) => {
					deleteDoc(doc.ref);
				});
				setWindowOverlay(true);
				setWindowMessage(`${deleteTennant} successfuly deleted.`);
			}
		} catch (error) {
			console.log(error);
		}			
	
	};

	//Get the occupant room name
	useEffect(() => {

		if (deleteRoomTennant) {
			deleteRoomTennant.find(tennant => {
				const n = tennant.room
				setOccupantsRoom(n)
			})
		}

	}, [deleteRoomTennant])

	// Query the tennants room from firestore 
	useEffect(() => {

		console.log(deleteRoomTennant)

		const fetchRoomData = async () => {
			try {
				const q = query(roomsColRef, where("room_name", "==", occupantsRoom));
				onSnapshot(q, (snapshot) => {
					let room = [];
					snapshot.docs.forEach((doc) => {
						room.push({ ...doc.data(), id: doc.id })
					});
					setTennantRoomQuery(room)
					});	
			} catch (error) {
				  console.log(error)
			}
		};
		
		fetchRoomData()

  	}, [occupantsRoom])

	// Searching tennant's roomName and roomType
	useEffect(() => {

		if (tennantRoomQuery) {
			tennantRoomQuery.find(room => {
				const roomName = room.occupants_number
				const roomType = room.room_type
				setUpdateRoomOccupantNumbers(roomName)
				setUpdateRoomType(roomType)
				console.log(roomType)
			})
		}

  	}, [tennantRoomQuery])

	
	// Update the room values based of the deleted tennant
	useEffect(() => {

		if (updateRoomType)	{

			const updateRoomAfterDelete = async () => {

				if (updateRoomType === 'Whole Room') {
		
					const occupantsNumber = updateRoomOccupantNumbers + 1
		
					const tennantRoomQuery = query(roomsColRef, where("room_name", "==", occupantsRoom));
					const querySnapshot = await getDocs(tennantRoomQuery);
					querySnapshot.forEach((doc) => {
						updateDoc(doc.ref, { 
							occupancy: 'Vacant',
							occupants_number: occupantsNumber,
							tennant_name: arrayRemove(deleteTennant)
						})
						setDeleteTennant('')				
					})				
		
		
				} else if (updateRoomType === 'Bed Spacer') {
		
					const occupantsNumber = updateRoomOccupantNumbers + 1
		
					const tennantRoomQuery = query(roomsColRef, where("room_name", "==", occupantsRoom));
					const querySnapshot = await getDocs(tennantRoomQuery);
					querySnapshot.forEach((doc) => {
						updateDoc(doc.ref, { 
							occupancy: 'Vacant',
							occupants_number: occupantsNumber,
							tennant_name: arrayRemove(deleteTennant)
						})
						setDeleteTennant('')	
					})			
		
				}		
			};

			updateRoomAfterDelete()
		}
		
  	}, [updateRoomType]);

	const onMouseEnterHandleUpdateTenant = () => {

		setToggleUpdateView(true);
		
		setUpdateTenantName(detailsName);
		setUpdateTenantDeposit(detailsGender);
		setUpdateTenantRoom(detailsRoom);
		setUpdateTenantDeposit(detailsDeposit);
		setUpdateTenantPhoneNumber(detailsPhoneNumber);
	};

	// handle update gender input change
	const handleUpdateName = (e) => {
		setUpdateTenantName(e.target.value)
	};

	// handle update gender input change
	const handleUpdateGender = (e) => {
		setUpdateTenantGender(e.target.value)
	};

	// handle update gender input change
	const handleUpdateRoom = (e) => {
		setUpdateTenantRoom(e.target.value)
	};

	// handle update gender input change
	const handleUpdateDeposit = (e) => {
		setUpdateTenantGender(e.target.value)
	};

	// handle update gender input change
	const handleUpdatePhoneNumber = (e) => {
		setUpdateTenantPhoneNumber	(e.target.value)
	};



  return (
    <div className="font-poppins p-4 flex gap-8">

            <div className="w-[800px] h-full relative flex gap-6 flex-col">
                
                <input type="search" className="h-16 outline-none bg-transparent border-highlight border-b-2 text-center p-2 text-primary focus:outline-none
                                text-3xl"
                        onChange={searchRoomChange} 
                        onClick={handleRoomSearchClick}
                id='roomName' placeholder='Search Tennant'/>

				<div className="relative flex overflow-hidden overflow-y-scroll scrollbar rounded-xl h-[600px]">

					<div className="relative grid grid-cols-2 w-full h-min gap-4">
						{tennantData.map(tennants => (

								<button
								key={tennants.name}
								onMouseEnter={() => handleRoomDataOnMouseEnter(tennants.name, tennants.gender, tennants.room, tennants.deposit, tennants.phone_number, tennants.creator)}
								className="rooms-items-grid group gap-4">

								{tennants.name}
									<h1 className="flex text-xl text-primary">
										Room: {tennants.room} <br /> Gender: {tennants.gender}
									</h1>

									<div className="group-hover:flex hidden group-focus:flex gap-2">
										<button className="main-button w-min px-2" onClick={onMouseEnterHandleDeleteTenant}>DELETE</button>
										<button className="main-button w-min px-2" onClick={onMouseEnterHandleUpdateTenant}>UPDATE</button>										
									</div>

								</button>
						))}

					</div>	

					<div className={`${toggleUpdateView? 'flex' : 'hidden'} absolute w-full h-full bg-grayblue bg-opacity-95 rounded-xl items-center gap-8 p-10 flex-col`}>
							<h1 className="text-2xl text-highlight">Tenant Details</h1>

							<label htmlFor="updateName" className="w-72 border-b-2 border-highlight text-primary text-opacity-70">
								Name:
								<span> </span>
								<input className="bg-transparent focus:outline-none focus:bg-transparent text-primary" type="text" value={updateTenantName} name="tenantName" id="updateName" onChange={handleUpdateName}/>
							</label>
							
							<label htmlFor="updateGender" className="w-72 border-b-2 border-highlight text-primary text-opacity-70">
								Gender:
								<span> </span>
								<select className="bg-transparent focus:bg-grayblue text-primary text-opacity-70" id="updateGender" value={updateTenantGender} onChange={handleUpdateGender}>

										<option className="" value="Gender" selected disabled>Gender</option>
										<option className="" value="Male">Male</option>
										<option className="" value="Female">Female</option>
								</select> 
							</label>

							<label htmlFor="updateRoom" className="w-72 border-b-2 border-highlight text-primary text-opacity-70">
								Room:
								<span> </span>
								<select className="bg-transparent focus:bg-grayblue text-primary text-opacity-70" id="updateRoom" value={updateTennantRoom} onChange={handleUpdateRoom}>

									<option className="" value="Room" selected disabled>Room</option>
									{roomVacant?.map(room => (
									<option
										key={room.room_name}
										className="font-poppins text-lg"
										>
										{room.room_name}
									</option>
									))}
				
								</select> 
							</label>

							<label htmlFor="updateDeposit" className="w-72 border-b-2 border-highlight text-primary text-opacity-70">
								Deposit:
								<span> </span><input className="bg-transparent focus:outline-none text-primary" type="text" value={updateTenantDeposit} 
								id="updateDeposit" onChange={handleUpdateDeposit}/>
							</label>

							<label htmlFor="updatePhone" className="w-72 border-b-2 border-highlight text-primary text-opacity-70">
								Phone #:
								<span> </span><input className="bg-transparent focus:outline-none text-primary" type="text" value={updateTenantPhoneNumber} id="updatePhone" onChange={handleUpdatePhoneNumber}/>
							</label>

					</div>				
				</div>

            </div>

            {/* Adding rooms **************************************************************/}
            <div className="flex flex-col items-center gap-4 mt-2 w-[300px]">

                <div className={`${toggleEditView? 'hidden' : 'flex'} bg-grayblue bg-opacity-70 w-full rounded-xl p-6 gap-6 flex flex-col`}>

                    <h1 className="text-highlight text-2xl p-2 rounded-xl text-center">
                        Tennant Data
                    </h1>
                    <label className="text-2xl text-secondary">Name: <span className="text-highlight">{detailsName}</span></label>
					<label className="text-2xl text-secondary">Gender: <span className="text-highlight">{detailsGender}</span></label>
                    <label className="text-2xl text-secondary">Room: <span className="text-highlight">{detailsRoom}</span></label>
					<label className="text-2xl text-secondary">Deposit: <span className="text-highlight">{detailsDeposit}</span></label>
                    <label className="text-2xl text-secondary">Phone #: <span className="text-highlight">{detailsPhoneNumber}</span></label>
                    <label className="text-2xl text-secondary">Creator: <span className="text-highlight">{detailsCreator}</span></label>
                    
                </div>  

				<div className={`${toggleEditView? 'flex' : 'hidden'} items-center justify-center flex-col gap-10`}>

					<div className="flex flex-col items-center gap-4 relative">

						<label className="text-highlight text-2xl bg-grayblue p-2 rounded-xl"
						htmlFor="roomName">Add Tennant</label>

						<div className="flex flex-col gap-4">

							<input className="add-room-input mt-4" id='tennantName' value={tennantName} type="text" placeholder='Name' onChange={handleChangeName} />

							<select className="add-room-input" value={tennantGender} required onChange={handleChangeGender}>

									<option className="" value="Gender" selected disabled>Gender</option>
									<option className="" value="Male">Male</option>
									<option className="" value="Female">Female</option>
							</select> 

							<select className="add-room-input" value={tennantRoom} required onChange={handleChangeRoom}>

								<option className="" value="Room" selected disabled>Room</option>
								{roomVacant?.map(room => (
								<option
									key={room.room_name}
									className="font-poppins text-lg"
									>
									{room.room_name}
								</option>
								))}
			
							</select> 

							<input className="add-room-input no-spinners" value={tennantDeposit} min={0} id='tennantDeposit' type="number" placeholder='Deposit' onChange={handleChangeDeposit} />

							<input className="add-room-input no-spinners" value={tennantPhoneNumber} min={0} id='tennantPhoneNumber' type="number" placeholder='Phone #' onChange={handleChangePhoneNumber} />

							<button className="h-10 w-72 bg-highlight font-poppins text-grayblue rounded-lg font-semibold text-xl
													hover:scale-y-110 duration-300 ease-in-out transition-all"
										onClick={handleAddTennantButton}
										disabled={loading}>
									DONE
								</button>                  
							</div>

					</div> 

					{/* <div className="h-full rounded-xl gap-4 flex mb-2">
						<input className="outline-none w-[180px] bg-grayblue p-2 rounded-lg focus:bg-grayblue text-primary focus:outline-none focus:outline-highlight" id='roomName' type="text"placeholder='Tennant name' value={deleteTennant} onChange={handleDeleteTenantInput} />
						<button className="bg-highlight font-poppins px-2 text-grayblue rounded-lg font-semibold text-xl
												hover:scale-y-110 duration-300 ease-in-out transition-all"
								onClick={handleDeleteTenant}>DELETE</button>
					</div>              */}
				</div>

				<div className="flex items-center justify-center gap-4 h-20 absolute bottom-4">
                    <button className="search-room-button" onClick={() => {setToggleEditView(false)}}>View</button>
                    <button className="search-room-button" onClick={() => {setToggleEditView(true)}}>Edit</button>

                </div>					
			</div>




        </div>
  )
}

export default Tennants