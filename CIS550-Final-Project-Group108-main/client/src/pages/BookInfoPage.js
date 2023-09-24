import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { formatReleaseDate } from '../helpers/formatter';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function BookInfoPage() {
  const [pageSize, setPageSize] = useState(10);
  const { book_id } = useParams();
  const [bookData, setBookData] = useState([{}]);
  const [bookTitle, setBookTitle] = useState('Unknown Name');
  const [bookImageURL, setBookImageURL] = useState('');
  const [description, setDescription] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  const [authorData, setAuthorData] = useState([]);
  const [publisher, setPublisher] = useState('Unknown Publisher');
  const [publishedDate, setPublishedDate] = useState('Unknown Published Date');
  const [genres, setGenres] = useState([{}]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_books/${book_id}`)
      .then(res => res.json())
      .then(resJson => 
        {
        setBookTitle(resJson[0].title);
        setPreviewLink(resJson[0].preview_link);
        setDescription(resJson[0].description);
        setBookImageURL(resJson[0].image);
        setPublisher(resJson[0].publisher);
        setPublishedDate(resJson[0].published_date);
        setBookData(resJson)
        });
  }, []);

  //fetch genres this book belongs to from route 6
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/book_genres/${book_id}`)
      .then(res => res.json())
      .then(resJson => 
        {
        setGenres(resJson);
        console.log(resJson);
        });
  }, []);

  //fetch author data from route 8, there coule be multiple authors 
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_book_authors/${book_id}`)
      .then(res => res.json())
      .then(resJson => 
        {
        setAuthorData(resJson);
        console.log(resJson);
        });
  }, []);


  // Define columns of user, score, review (to be used for datagrid with pages)
  const columns = [
    { field: 'user_name', headerName: 'User', width:200},
    { field: 'score', headerName: 'Score',width:100},
    {
      field: 'review_text',
      headerName: 'Review',
      width: 800,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'pre-line', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <span title={params.value}>{params.value}</span>
        </div>
      ),
    },
  ]

  return (
    <Container>
      <Stack direction='row' justify='center'>
        <img
          key={bookData.book_id}
          src={bookImageURL}
          alt={`${bookTitle} book cover`}
          style={{
            width: 300,
            height: 400,
            marginTop: '40px',
            marginRight: '60px',
            marginBottom: '40px'
          }}
        />
        <Stack>
          <h1 style={{ fontSize: 40 }}>{bookTitle}</h1>
          <a href={previewLink}>Preview Link</a>
          <h2>
            Author:&nbsp; 
            {
              authorData.map((row)=>(
                <NavLink to={`/search_authors/${row.author_id}`}>{row.name}</NavLink>
              ))
            }
          </h2> 
          <h2>Published at: {formatReleaseDate(publishedDate)}</h2>
          <h2>Publisher: {publisher}</h2>
        </Stack>

      </Stack>
      <hr></hr>
      <h3> Description</h3>
      <h4> {description} </h4>
      <hr></hr>
      <h3> Genres </h3>
      <Stack direction='row'>
        {genres.length > 0 && genres.map((row) => (
          <h4>{row.name}&nbsp;</h4>
        ))}
      </Stack>
      <hr></hr>
      
      <h3> Reviews </h3>
      
      <DataGrid
        rows={bookData}
        columns={columns}
        pageSize={pageSize}
        getRowId={(row) => row.user_id + row.review_text}
        getRowHeight = {
          (row)=> {
            return row.model.review_text ? row.model.review_text.split('').length * 0.2 + 20: 40;
          }
        }
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight = {true}
       />
    </Container>
  );

  
}