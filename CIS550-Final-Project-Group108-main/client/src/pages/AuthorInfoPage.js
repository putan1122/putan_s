import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Stack,
} from "@mui/material";
import { NavLink } from "react-router-dom";
const config = require("../config.json");
const flexFormat = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-evenly",
};

export default function AuthorInfoPage() {
  const { author_id } = useParams();
  const [authorData, setAuthorData] = useState([{}]);
  const [authorName, setAuthorName] = useState("Unknown Author");
  const [authorImageURL, setAuthorImageURL] = useState("");
  const [about, setAbout] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("Unknown Country");
  const [fanCount, setFanCount] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [genres, setGenres] = useState([{}]);

  // fetch author data from route 5
  useEffect(() => {
    fetch(
      `http://${config.server_host}:${config.server_port}/search_authors/${author_id}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        console.log(resJson)
        setAuthorName(resJson[0].name);
        setWebsite(resJson[0].website);
        setAbout(resJson[0].about);
        setAuthorImageURL(resJson[0].image_url);
        setCountry(resJson[0].country);
        setFanCount(resJson[0].fan_count);
        setRatingCount(resJson[0].rating_count);
        setAvgRating(resJson[0].average_rate);
        setAuthorData(resJson);
      });
  }, []);

  //fetch genres the author has written in from route 7
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/author_genres/${author_id}`)
      .then(res => res.json())
      .then(resJson => 
        {
        setGenres(resJson);
        console.log(resJson);
        });
  }, []);

  return (
    <Container style={flexFormat}>
      <Stack direction="row" justify="center">
        <img
          key={authorData.author_id}
          src={authorImageURL}
          alt={`author photo`}
          style={{
            width: 250,
            marginTop: "40px",
            marginRight: "60px",
            marginBottom: "40px",
          }}
        />
        <Stack direction="column">
          <h1 style={{ fontSize: 40 }}>{authorName}</h1>
          <a href={website}>Website</a>
          <h3>Country: {country}</h3>
          <h3>Fan Count: {fanCount}</h3>
          <h3>Ratings Count: {ratingCount}</h3>
          <h3>Average Rating: {avgRating}</h3>
        </Stack>
      </Stack>

      <Container>
        <h3> About </h3>
        <h4> {about} </h4>
       
      <hr></hr>
      <h3> Genres </h3>
      <Stack direction='row'>
        {genres.length > 0 && genres.map((row) => (
          <h4>{row.name}&nbsp;</h4>
        ))}
      </Stack>
      <hr></hr>
      <h3> Books By {authorName} </h3>
      </Container>

      <Container style={flexFormat}>
        {authorData.map((row) => (
          <Box
            key={row.book_id}
            p={3}
            m={2}
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid grey",
              width: 300,
              height: 400,
            }}
          >
            {
              <img
                src={row.image}
                alt={`${row.title} book cover`}
                style={{ width: 200, height: 250 }}
              />
            }
            <h4>
              <NavLink to={`/search_books/${row.book_id}`}>{row.title}</NavLink>
            </h4>
          </Box>
        ))}
      </Container>
    </Container>
  );
}
