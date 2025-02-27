import './App.css';
import { useEffect, useState } from 'react';
import './index.css';
import { Modal } from 'antd';
import axios from 'axios';

function App() {
  const Api = 'https://to-dos-api.softclub.tj/api/to-dos';
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") === "dark" ? "Light mode" : "Dark mode"
  );
  const [data, setData] = useState([]);
  const [isOpenModal, setOpenModal] = useState(false);
  const [inpName, setInpName] = useState("");
  const [inpDesc, setInpDesc] = useState("");
  const [inpImg, setInpImg] = useState(null);
  const [isOpenImgModal, setOpenImgModal] = useState(false); 
  const [isViewModal, setOpenView] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editBaxh, setBaxsh] = useState({});
  const [editModal, setEditModal] = useState(false);
  const [editName, setEditName] = useState(editBaxh.name);
  const [editDesc, setEditDesc] = useState(editBaxh.description);


  useEffect(()=> {
    setEditName(editBaxh.name)
    setEditDesc(editBaxh.description)
  },[editBaxh])
  function handleClick() {
    if (localStorage.theme === 'dark' || !('theme' in localStorage)) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'light';
      setTheme('Light mode');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'dark';
      setTheme('Dark mode');
    }
  }

  const Get = async() => {
    try {
      const request = await axios.get(Api);
      setData(request.data.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    Get();
    handleClick();
  }, []);

  const toggleCompletion = async(id, isCompleted) => {
    try {
      await axios.put(`https://to-dos-api.softclub.tj/completed?id=${id}`, { isCompleted: !isCompleted });
      setData(prevData =>
        prevData.map(item =>
          item.id === id ? { ...item, isCompleted: !isCompleted } : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  const deleteUser = async(id) => {
    await axios.delete(`${Api}?id=${id}`);
    Get();
  }

  const handleDeleteImg = async(id) => {
    await axios.delete(`${Api}/images/${id}`); 
    Get();
  }

  const handleAddSubmit = async(e) => {
    e.preventDefault();

    try {
     const formData = new FormData();
     formData.append('Name', inpName);
     formData.append('Description', inpDesc)
    
     if(inpImg && inpImg.length > 0){
      for(let i = 0; i < inpImg.length; i++){
        formData.append("Images", inpImg[i]);
      }
     }else{
      alert("Try again!");
     }

     await axios.post(Api, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
     });

     setInpName("");
     setInpImg([]);
     setOpenModal(false);
     Get();
    } catch (error) {
      console.error(error);
    }
  }

  const handleView = (task) => {
    setSelectedTask(task);
    setOpenView(true);
  }

  const handleEditer = (e) => {
    setEditModal(true);
    setBaxsh(e);
  }

  const handleEdit = async(e) => {
    e.preventDefault();
    let updateUSer = {
      ...editBaxh,
      name : editName,
      description : editDesc,
    }
    try {
      await axios.put(Api,updateUSer)
    } catch (error) {
      console.error(error);
    }
    setEditModal(false)
  }

  
  return (
    <>
    <Modal open={isOpenModal} footer={null} onCancel={()=> setOpenModal(false)}>
        <form onSubmit={handleAddSubmit} className='flex flex-col justify-center items-center gap-4'>
          <input value={inpName} onChange={(e)=> setInpName(e.target.value)} className='border rounded w-[300px] py-2 px-3' type="text" name="" id="" placeholder='Name...' />
          <input value={inpDesc} onChange={(e)=> setInpDesc(e.target.value)} className='border rounded w-[300px] py-2 px-3' type="text" name="" id="" placeholder='Description...' />
          <input onChange={(e)=> setInpImg([...e.target.files])} className='p-2.5 cursor-pointer' multiple type="file" />
          <button type='submit' className='bg-black text-white py-1 px-7 cursor-pointer rounded-2xl'>Save</button>
        </form>
    </Modal>

   <Modal open={isOpenImgModal} footer={null} onCancel={()=> setOpenImgModal(false)}>
      <form className='flex flex-col justify-center items-center gap-4 py-3'>
        <input onChange={(e)=> setInpImg([...e.target.files])} type="file" multiple />
        <button type='submit' className='bg-black text-white py-1 px-7 cursor-pointer rounded-2xl'>Save</button>
      </form>
   </Modal>

   <Modal open={isViewModal} footer={null} onCancel={()=> setOpenView(false)}>
   {selectedTask && (
        <div className='py-3 flex flex-col justify-center items-center'>
          <h1 className='font-bold text-3xl py-2'>Info</h1>
          <h2 className='text-xl font-bold'>Name: {selectedTask.name}</h2>
          <p className='py-3'>Description: {selectedTask.description}</p>
          <div className='flex gap-2'>
            {selectedTask.images && selectedTask.images.length > 0 ? selectedTask.images.map((img) => (
              <img key={img.id} src={`https://to-dos-api.softclub.tj/images/${img.imageName}`} alt={img.imageName} className='w-20 h-20 object-cover border rounded' />
            )) : <p>No images</p>}
          </div>
        </div>
      )}
   </Modal>

   <Modal open={editModal} footer={null} onCancel={()=> setEditModal(false)}>
     <form onSubmit={handleEdit} className='flex flex-col justify-center items-center gap-4'>
        <input className='border rounded w-[300px] py-2 px-3' type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
        <input className='border rounded w-[300px] py-2 px-3' type="text" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
        <button type='submit' className='bg-black text-white py-1 px-7 cursor-pointer rounded-2xl'>Save</button>
     </form>
   </Modal>

    <div className='w-[70%] m-auto gap-4 flex md:justify-end justify-center py-10'>
        <button onClick={()=> setOpenModal(true)} className='py-1 cursor-pointer px-4 border-2 rounded-2xl'>ADD +</button>
        <button className="bg-black dark:bg-white dark:text-black text-white cursor-pointer py-1 px-3 rounded-2xl" onClick={handleClick}>{theme}</button>
    </div>
    <div className='md:w-[80%] w-[90%] block m-auto md:flex justify-between items-center gap-7'>
      <div className='md:w-[500px] w-full'>
        <h1 className='md:text-4xl text-3xl md:text-left text-center font-bold'>Working with formDate and swagger</h1>
        <p className='py-7'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut labore odio sequi dignissimos debitis omnis modi expedita at! Blanditiis, nobis? Optio recusandae cumque officiis sunt eligendi. At aut magni ratione!
        praesentium. Itaque voluptates beatae hic voluptas dignissimos maxime amet id consequatur inventore rerum.
        Facilis, molestiae expedita reprehenderit temporibus praesentium officiis modi ex asperiores quibusdam consequuntur esse fugiat aspernatur rem a nobis, in architecto accusamus nulla assumenda obcaecati. Sit sed nobis dolorem facilis assumenda!</p>
      </div>
      <div className='md:w-[900px] w-[90%] h-[600px] flex flex-wrap gap-3 overflow-auto'> 
        {
          data.length > 0 ? data.map((e) => (
            <div key={e.id} className='w-[370px] h-[300px] p-5 flex flex-col justify-center items-center gap-3 shadow-2xl rounded-2xl dark:bg-blue-800'>
              <div className='flex gap-2'>
              {e.images && e.images.length > 0 ? e.images.map((img) => (
                <div key={e.id}>
                  <img key={img.id} src={`https://to-dos-api.softclub.tj/images/${img.imageName}`} alt={img.imageName} className="w-20 h-20 object-cover border rounded" />
                  <button onClick={()=> handleDeleteImg(img.id)} className='bg-black text-white dark:bg-white dark:text-black px-4.5 cursor-pointer'>Delete</button>
                </div>
                )) : <p>No images</p>}
              </div>
              <p>Name: {e.name}</p>
              <p>Description: {e.description}</p>
              <div className="flex gap-3 items-center">
                <input className='w-5 h-5 rounded-4xl' type="checkbox" checked={e.isCompleted} onChange={() => toggleCompletion(e.id, e.isCompleted)} />
                <p>{e.isCompleted ? "Completed" : "Not Completed"}</p>
              </div>
              <div className='flex gap-3'>
                <button onClick={()=> deleteUser(e.id)} className='cursor-pointer bg-black text-white dark:bg-white dark:text-black rounded-2xl px-2'>Delete</button>
                <button onClick={()=> handleEditer(e)} className='cursor-pointer bg-black text-white dark:bg-white dark:text-black rounded-2xl px-2'>Edit</button>
                <button onClick={()=> handleView(e)} className='cursor-pointer bg-black text-white dark:bg-white dark:text-black rounded-2xl px-2'>View</button>
                <button onClick={()=> setOpenImgModal(true)} className='cursor-pointer bg-black text-white dark:bg-white dark:text-black rounded-2xl px-2'>Add img</button>
              </div>
            </div>
          ))
        :"Not found"}
      </div>  
    </div>
    </>
  );
}

export default App;
