import { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import './App.css';
import axios from 'axios';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectItems, setProjectItems] = useState([]);
  const [projectItem2, setProjectItem2] = useState([]);
  const [vehiclesCount, setVehiclesCount] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2); // Change this value to adjust items per page

  useEffect(() => {
    axios.get('https://swapi.dev/api/people')
      .then((response) => {
        const results = response.data.results;
        setProjectItems(results);
        setProjectItem2(results);

        const vehicleCounts = results.map(item => item.vehicles.length);
        setVehiclesCount(vehicleCounts);

        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filteredItems = projectItem2.filter(item =>
      item.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setProjectItems(filteredItems);
  };

  // Logic to get current items based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projectItems.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='Allprojects'>
      <div className="journeyheader">
        <h1>Assignment</h1>
      </div>
      <div className="searchbox">
        <input type="text" placeholder='Search...' value={searchTerm} onChange={handleSearch} />
        <div className='searchbtn'><FaSearch /></div>
      </div>
      <div className="projectshowcont">
        {currentItems.map((item, index) => (
          <div key={index} className="portfoiliocard">
            <img src={`https://picsum.photos/200/${index * 100}`} alt="none" className="cardimg" />
            <p className="projectnames">Name: {item.name}</p>
            <p className="projectnames">Hair color: {item.hair_color}</p>
            <p className="projectnames">Skin color: {item.skin_color}</p>
            <p className="projectnames">Gender: {item.gender}</p>
            <p className="projectnames">Count vehicles: {vehiclesCount[indexOfFirstItem + index]}</p>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="pagination">
        {projectItems.length > itemsPerPage &&
          Array.from({ length: Math.ceil(projectItems.length / itemsPerPage) }).map((_, index) => (
            <button key={index} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          ))}
      </div>
    </div>
  );
}

export default App;
