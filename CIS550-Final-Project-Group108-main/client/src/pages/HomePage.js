import { useEffect, useState } from 'react';
import { Box, Button, Container, Divider, FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import LazyTable from '../components/LazyTable';
import { DataGrid } from '@mui/x-data-grid';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, TwitterAuthProvider } from 'firebase/auth';


const config = require('../config.json');

export default function HomePage() {
  const [bookOfTheDay, setBookOfTheDay] = useState([]);
  const [authorOfTheDay, setAuthorOfTheDay] = useState([]);
  const [author, setAuthor] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOption, setSearchOption] = useState('book_title');
  const [sortOption, setSortOption] = useState('num_rating');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const twitterProvider = new TwitterAuthProvider();

  const [pageSize, setPageSize] = useState(5);
  const [genreName1, setGenreName1] = useState('');
  const [genreName2, setGenreName2] = useState('');
  const [genreName3, setGenreName3] = useState('');
  const [genreName4, setGenreName4] = useState('');
  const [genreName5, setGenreName5] = useState('');
  const [genreData1, setGenreData1] = useState([]);
  const [genreData2, setGenreData2] = useState([]);
  const [genreData3, setGenreData3] = useState([]);
  const [genreData4, setGenreData4] = useState([]);
  const [genreData5, setGenreData5] = useState([]);
  // The useEffect hook by default runs the provided callback after every render
  // The second (optional) argument, [], is the dependency array which signals
  // to the hook to only run the provided callback if the value of the dependency array
  // changes from the previous render. In this case, an empty array means the callback
  // will only run on the very first render.

  // const [signInButtonClicked, setSignInButtonClicked] = useState(false);
  
  function googleSignin() {
    // Remove the if (currentUser) condition
    // Add the 'prompt' option to the provider to always show the account selection
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const token = result.credential.accessToken;
        const user = result.user;
        setCurrentUser(user);
        
        console.log('User set in state:', user);
        console.log(token);
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
  
        console.log("Sign In Error:", errorCode, errorMessage);
      });
  }
  
  
  function signout() {
    if (currentUser) {
      signOut(auth)
        .then(() => {
          console.log("Signout Successful");
          setCurrentUser(null);
          // Set a flag in the localStorage to indicate the user has signed out
          localStorage.setItem("signedOut", "true");
        })
        .catch((error) => {
          console.log("Signout Failed");
        });
    } else {
      console.log("No user is currently signed in.");
    }
  }
  
  function twitterSignin() {
    // Add the 'force_login' option to the provider to always show the account selection
    twitterProvider.setCustomParameters({
      force_login: 'true',
    });
  
    signInWithPopup(auth, twitterProvider)
      .then((result) => {
        const token = result.credential.accessToken;
        const user = result.user;
        setCurrentUser(user);
  
        console.log('User set in state:', user);
        console.log(token);
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
  
        console.log('Sign In Error:', errorCode, errorMessage);
      });
  };


  useEffect(() => {
    
    // BOOK OF THE DAY from route 2
    fetch(`http://${config.server_host}:${config.server_port}/random/book`)
      .then(res => res.json())
      .then(resJson => {
        if (resJson.length > 0) {
          setBookOfTheDay(resJson[0]);
        }
      });
    
    //AUTHOR OF THE DAY from route 2
    fetch(`http://${config.server_host}:${config.server_port}/random/author`)
    .then(res => res.json())
    .then(resJson => {
      if (resJson.length > 0) {
        setAuthorOfTheDay(resJson[0]);
      }
    });

    // APP AUTHOR (name not pennkey) from route 1
    fetch(`http://${config.server_host}:${config.server_port}/owner/name`)
    .then(res => res.text())
    .then(resText => setAuthor(resText));

    //Get each of the 5 genre names from route 13
    fetch(`http://${config.server_host}:${config.server_port}/popular_genres`)
    .then(res => res.json())
    .then(resJson => {
      if (resJson.length > 0) {
        setGenreName1(resJson[0].genre);
        setGenreName2(resJson[10].genre);
        setGenreName3(resJson[20].genre);
        setGenreName4(resJson[30].genre);
        setGenreName5(resJson[40].genre);

        setGenreData1(resJson.slice(0,10));
        setGenreData2(resJson.slice(11,20));
        setGenreData3(resJson.slice(21,30));
        setGenreData4(resJson.slice(31,40));
        setGenreData5(resJson.slice(41,50));
      }
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Clean up the listener when the component is unmounted
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log("Current user:", currentUser);
  }, [currentUser]);


  // Here, we define the columns of the "Top Books" table. The songColumns variable is an array (in order)
  // of objects with each object representing a column. Each object has a "field" property representing
  // what data field to display from the raw data, "headerName" property representing the column label,
  // and an optional renderCell property which given a row returns a custom JSX element to display in the cell.
  const bookColumns = [
    {
      field: 'title',
      headerName: 'Book title',
      renderCell: (row) => <NavLink to={`/search_books/${row.book_id}`}>{row.title}</NavLink>
    },
    {
      field: 'num_rating',
      headerName: sortOption === 'num_rating' ? 'Number of Ratings' : 'Average Rating',
      renderCell: (row) => {
        return sortOption === 'num_rating' ? row.num_rating : row.avg_rating;
      },
    },
  ]; 

  const popularAuthorColumns = [
    {
      field: 'name',
      headerName: 'Author Name',
      renderCell: (row) => <NavLink to={`/search_authors/${row.author_id}`}>{row.name}</NavLink>
    },
    {
      field: 'rating_count',
      headerName: 'Rating Count',
    },
    {
      field: 'average_rate',
      headerName: 'Average Rate',
    },
    {
      field: 'title',
      headerName: 'Book Title',
      renderCell: (row) => <NavLink to={`/search_books/${row.book_id}`}>{row.title}</NavLink>
    },
    {
      field: 'genres',
      headerName: 'Genres of the Book',
      },

  ]; 

  // Define the columns of the tables for 5 popular genres
  const popularGenreColumns = [
    {
      field: 'title',
      headerName: 'Book Title',
      width:500,
      renderCell: (params) => <NavLink to={`/search_books/${params.row.book_id}`}>{params.value}</NavLink>
    },
    {
      field: 'author_name',
      headerName: 'Author Name',
      width:300,
      renderCell: (params) => <NavLink to={`/search_authors/${params.row.author_id}`}>{params.value}</NavLink>
    },
    {
      field: 'num_rating',
      width:200,
      headerName: 'Number of Ratings',
    },
    {
      field: 'average_score',
      width:200,
      headerName: 'Average Score',
    },
  ]; 

  const navigate = useNavigate();

  const handleClick = async () => {
    const searchEndpoint = searchOption === 'book_title' ? 'search_books' : 'search_authors';
    const query = searchOption === 'book_title' ? 'title' : 'author_name';
    console.log(searchEndpoint);
    console.log(query);
    console.log(searchQuery);
    console.log(`http://${config.server_host}:${config.server_port}/${searchEndpoint}?${query}=${searchQuery}`)
    const response = await fetch(`http://${config.server_host}:${config.server_port}/${searchEndpoint}?${query}=${searchQuery}`)
    const json = await response.json();
    const data = { json: json, searchEndpoint: searchEndpoint, searchQuery: searchQuery };
    navigate(`/${searchEndpoint}`, { state: { searchData: data } });
    console.log(json);
  };

  return (
    <Container>
      {/* SignIn component included
      <SignIn /> */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {!currentUser && (
            <>
              <Button variant="contained" onClick={() => googleSignin()}>
                Sign in with Google
              </Button>
              
              <Button
                variant="contained"
                color="secondary"
                onClick={() => twitterSignin()}
                style={{ marginLeft: '10px' }}
              >
                Sign in with Twitter
              </Button>
            </>
          )}
          {currentUser && (
            <>
              <Button variant="contained" onClick={() => signout()} style={{ marginLeft: '10px' }}>
                Sign out
              </Button>
            </>
          )}
        </>
      )}
      {bookOfTheDay && (
        <h2>
          Check out your book of the day:&nbsp;
          <NavLink to={`/search_books/${bookOfTheDay.book_id}`}>
            {bookOfTheDay.title}
          </NavLink>
        </h2>
      )}
      {authorOfTheDay && (
        <h2>
          Check out the author of the day:&nbsp;
          <NavLink to={`/search_authors/${authorOfTheDay.author_id}`}>
            {authorOfTheDay.name}
          </NavLink>
        </h2>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel id="search-option-label">Search by</InputLabel>
          <Select
            labelId="search-option-label"
            id="search-option"
            value={searchOption}
            onChange={(e) => setSearchOption(e.target.value)}
            label="Search by"
          >
            <MenuItem value="book_title">Book Title</MenuItem>
            <MenuItem value="name">Author Name</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Search Query"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mr: 2 }}
        />

        <Button id="search-btn" variant="contained" onClick={() => { handleClick() }}>
          Search
        </Button>

      </Box>
      
      <Divider />
      <img src="https://www.denofgeek.com/wp-content/uploads/2020/11/the-mandalorian-grogu-baby-yoda-name-origin.jpg?resize=768%2C432" alt="Grogu" style={{ display: 'block', margin: '0 auto' }} />
      <Divider />
    
      <h2>Top Books</h2>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel id="sort-option-label">Sort by</InputLabel>
          <Select
            labelId="sort-option-label"
            id="sort-option"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            label="Sort by"
          >
            <MenuItem value="num_rating">Number of Ratings</MenuItem>
            <MenuItem value="ave_rating">Average Rating</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <LazyTable
        route={`http://${config.server_host}:${config.server_port}/popular_books/${sortOption}`}
        columns={bookColumns}
        defaultPageSize={10}
        rowsPerPageOptions={[5, 10, 25]}
      />

<Divider />
      <h2> Popular Genres and Top Books In Each Genre </h2>
      <h3>{genreName1}</h3>
      <DataGrid
        rows={genreData1}
        columns={popularGenreColumns}
        getRowId={(row) => `${row.book_id}_${Math.random()}`}
        autoHeight = {true}
        pageSize={pageSize}
        rowsPerPageOptions={[5]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
       />

      <h3>{genreName2}</h3>
      <DataGrid
        rows={genreData2}
        columns={popularGenreColumns}
        getRowId={(row) => `${row.book_id}_${Math.random()}`}
        autoHeight = {true}
        pageSize={pageSize}
        rowsPerPageOptions={[5]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
       />

      <h3>{genreName3}</h3>
      <DataGrid
        rows={genreData3}
        columns={popularGenreColumns}
        getRowId={(row) => `${row.book_id}_${Math.random()}`}
        autoHeight = {true}
        pageSize={pageSize}
        rowsPerPageOptions={[5]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
       />

      <h3>{genreName4}</h3>
      <DataGrid
        rows={genreData4}
        columns={popularGenreColumns}
        getRowId={(row) => `${row.book_id}_${Math.random()}`}
        autoHeight = {true}
        pageSize={pageSize}
        rowsPerPageOptions={[5]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
       />

      <h3>{genreName5}</h3>
      <DataGrid
        rows={genreData5}
        columns={popularGenreColumns}
        getRowId={(row) => `${row.book_id}_${Math.random()}`}
        autoHeight = {true}
        pageSize={pageSize}
        rowsPerPageOptions={[5]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
       />


      <Divider />
      <h2> Popular Authors and Their Representative Books </h2>
      <LazyTable
        route={`http://${config.server_host}:${config.server_port}/popular_authors`}
        columns={popularAuthorColumns}
        defaultPageSize={10}
        rowsPerPageOptions={[5, 10, 25]}
        key={sortOption} 
      />

      <Divider />
      <p>{author}</p>
      <Divider />
    </Container>
  );
};