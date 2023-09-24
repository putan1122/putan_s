import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Button,
  Container,
  Grid,
  Slider,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";


const config = require("../config.json");

export default function AuthorPage() {
  const location = useLocation();
  const searchData = location.state?.searchData;
  const hasData = searchData !== undefined ? 1 : 0;
  const searchText = searchData !== undefined ? searchData.searchQuery : '';

  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [country, setCountry] = useState("");
  const [author, setAuthor] = useState(searchText); //for author_name
  const [genre, setGenre] = useState(""); //for genre
  const [fanData, setFanData] = useState([0, 709826]);

  const [rating, setRating] = useState([0, 5]); // for avg_rating_low and avg_rating_high

  useEffect(() => {
    if (hasData === 1) {
      const authorsWithId = searchData.json.map((author) => ({
        id: author.author_id,
        ...author,
      }));
      setData(authorsWithId);
    } else {
    fetch(`http://${config.server_host}:${config.server_port}/search_authors`)
      .then((res) => res.json())
      .then((resJson) => {
        const authorsWithId = resJson.map((author) => ({
          id: author.author_id,
          ...author,
        }));
        setData(authorsWithId);
      });
  }
}, []);

  const search = () => {
    fetch(
      `http://${config.server_host}:${config.server_port}/search_authors?author_name=${author}` +
        `&country=${country}` +
        `&genre=${genre}` +
        `&fan_count_low=${fanData[0]}&fan_count_high=${fanData[1]}` +
        `&avg_rate_low=${rating[0]}&avg_rate_high=${rating[1]}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        const authorsWithId = resJson.map((author) => ({id: author.author_id, ...author,}));
        setData(authorsWithId);
      });
  };

  // This defines the columns of the table of songs used by the DataGrid component.
  // The format of the columns array and the DataGrid component itself is very similar to our
  // LazyTable component. The big difference is we provide all data to the DataGrid component
  // instead of loading only the data we need (which is necessary in order to be able to sort by column)
  const columns = [
    {
      field: "author_name",
      headerName: "Author Name",
      width: 400,
      renderCell: (params) => (
        //<Link onClick={() => setSelectedBookId(params.row.book_id)}>{params.value}</Link>
        <NavLink to={`/search_authors/${params.row.author_id}`}>
          {params.value}
        </NavLink>
      ),
    },
    { field: "average_rate", width: 200, headerName: "Average Rate" },
    { field: "fan_count", width: 200, headerName: "Fan Count" },
    { field: "genres", width: 200, headerName: "Genre"},
    { field: "country", width: 200, headerName: "Country"}
  ];

  

  // This component makes uses of the Grid component from MUI (https://mui.com/material-ui/react-grid/).
  // The Grid component is super simple way to create a page layout. Simply make a <Grid container> tag
  // (optionally has spacing prop that specifies the distance between grid items). Then, enclose whatever
  // component you want in a <Grid item xs={}> tag where xs is a number between 1 and 12. Each row of the
  // grid is 12 units wide and the xs attribute specifies how many units the grid item is. So if you want
  // two grid items of the same size on the same row, define two grid items with xs={6}. The Grid container
  // will automatically lay out all the grid items into rows based on their xs values.
  return (
    <Container>
      <h2>Search Authors</h2>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <TextField
            label="Author Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{ width: "100%" }}
          />
        </Grid>

        <Grid item xs={8}>
          <TextField
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ width: "100%" }}
          ></TextField>
        </Grid>

        <Grid item xs={8}>
          <TextField
            label="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            style={{ width: "100%" }}
          />
        </Grid>

        <Grid item xs={6}>
          <p>Fan Count Score</p>
          <Slider
            value={fanData}
            min={0}
            max={709826}
            step={1000}
            onChange={(e, newValue) => setFanData(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => <div>{value}</div>} //
          />
        </Grid>
        <Grid item xs={6}>
          <p>Average Rating Score</p>
          <Slider
            value={rating}
            min={0}
            max={5}
            step={1}
            onChange={(e, newValue) => setRating(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => <div>{value}</div>}
          />
        </Grid>
      </Grid>

      <Button
        onClick={() => search()}
        style={{ left: "50%", transform: "translateX(-50%)" }}
      >
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
      />
    </Container>
  );
}
