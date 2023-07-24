import { Button } from "react-bootstrap";
import { year_from_date } from "../utils/converter"
import { removeFromMovieList } from "../external/firebase";

const getItemStyle = (rating) => ({
  userSelect: "none",
  padding: "10px",
  background: "rgb(" + (255 - rating * 25) + ", " + rating * 25 + ", 224)"
});

function itemContent(item, i) {
  return (
    <div>
      <img
        alt={item.title}
        className="poster-image"
        src={"https://image.tmdb.org/t/p/w500" + item.poster_path}
      ></img>
      <h1 className="list-numbers">{i + 1}</h1>
      <p className="item-content">
        {item.title}{item.title === item.original_title ? null : "/" + item.original_title} (
        {year_from_date(item.release_date)})
      </p>
    </div>
  )
}

export default function gridItem(item, i) {
  return (
    <div key={"movieItem" + i} style={getItemStyle(item.vote_average)}>
      {itemContent(item, i)}
      <Button onClick={() => removeFromMovieList(item)}>
        Remove
      </Button>
    </div>
  )
}