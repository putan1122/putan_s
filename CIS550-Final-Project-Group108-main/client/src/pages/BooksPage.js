import { useEffect, useState } from 'react';
import { Button, Container, Grid, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { NavLink, useLocation } from 'react-router-dom';


const config = require('../config.json');

export default function BooksPage(props) {
  // first entry matching the ${} in the fetch function of 'search = ()' below
  const location = useLocation();
  const searchData = location.state?.searchData;
  const hasData = searchData !== undefined ? 1 : 0;
  const searchText = searchData !== undefined ? searchData.searchQuery : '';

  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [title, setTitle] = useState(searchText); 
  const [publisher, setPublisher] = useState(''); //for publisher
  const [author, setAuthor] = useState(''); //for author_name
  const [genre, setGenre] = useState(''); //for genre
  const [date, setDate] = useState([1000, 3000]); //for published_date_low and published_date_high
  const [rating, setRating] = useState([0, 5]); // for rating_low and rating_high
  const [numrating, setNumrating] = useState([0, 5000]); // for numrating_low and numrating_high


  useEffect(() => {
    if (hasData === 1) {
      const booksWithId = searchData.json.map((book) => ({ id: book.book_id, ...book }));
      setData(booksWithId);
    } else {
    fetch(`http://${config.server_host}:${config.server_port}/search_books`)
      .then(res => res.json())
      .then(resJson => {
        const booksWithId = resJson.map((book) => ({ id: book.book_id, ...book }));
        setData(booksWithId);
      })};
  }, []);

  // fetch from route 10
  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_books?title=${title}` +
      `&publisher=${publisher}` +
      `&author=${author}` +
      `&genre=${genre}` + 
      `&published_date_low=${date[0]}&published_date_high=${date[1]}` +
      `&rating_low=${rating[0]}&rating_high=${rating[1]}` + 
      `&numrating_low=${numrating[0]}&numrating_high=${numrating[1]}`
    )  
      .then(res => res.json())
      .then(resJson => {
        const booksWithId = resJson.map((book) => ({ id: book.book_id, ...book }));
        setData(booksWithId);
    });
  }

  const columns = [
    {
      field: 'title',
      headerName: 'Book Title',
      width: 500,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'pre-line', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <NavLink to={`/search_books/${params.row.book_id}`} >
            {params.value}
          </NavLink>
        </div>
      ),
    },

    { field: 'author', headerName: 'Author Name', width: 150, renderCell: (params) => (
        <NavLink to={`/search_authors/${params.row.author_id}`} >{params.value}</NavLink> )},
    { field: 'publisher', headerName: 'Publisher', width: 150 },
    { field: 'published_date', headerName: 'Published Date', width: 150 },
    { field: 'genre', headerName: 'Genre', width: 100 },
    { field: 'score_avg', headerName: 'Rating', width: 100 },
    { field: 'num_ratings', headerName: 'Number of Ratings', width: 150 },
  ]

  return (
    <Container>
      <h2>Search Books</h2>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <TextField label='Title' value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }}/>
        </Grid>

        <Grid item xs={8}>
          <TextField label='Author' value={author} onChange={(e) => setAuthor(e.target.value)} style={{ width: "100%" }}/>
        </Grid>

        <Grid item xs={8}>
          <TextField label='Publisher' value={publisher} onChange={(e) => setPublisher(e.target.value)} style={{ width: "100%" }}/>
        </Grid>

        <Grid item xs={8}>
          <TextField label='Genre' value={genre} onChange={(e) => setGenre(e.target.value)} style={{ width: "100%" }}/>
        </Grid>

        <Grid container item xs={12} spacing={6}>
          <Grid item xs={6}>
            <p>Published Year</p>
            <Slider
              value={date}
              min={1500}
              max={2023}
              step={10}
              onChange={(e, newValue) => setDate(newValue)}
              valueLabelDisplay='auto'
              valueLabelFormat={value => <div>{value}</div>} //
            />
          </Grid>
          <Grid item xs={3}>
            <p>Average Rating Score</p>
            <Slider
              value={rating}
              min={0}
              max={5}
              step={1}
              onChange={(e, newValue) => setRating(newValue)}
              valueLabelDisplay='auto'
              valueLabelFormat={value => <div>{value}</div>} //
            />
          </Grid>
          <Grid item xs={3}>
            <p>Number of Rating</p>
            <Slider
              value={numrating}
              min={0}
              max={3000}
              step={100}
              onChange={(e, newValue) => setNumrating(newValue)}
              valueLabelDisplay='auto'
              valueLabelFormat={value => <div>{value}</div>} 
            />
          </Grid>
        </Grid>
      </Grid>

      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>

      
      <h2>Results</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
        getRowId={(row) => `${row.book_id}_${Math.random()}`}
      />
    </Container>
  );
};