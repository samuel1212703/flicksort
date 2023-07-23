import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import {
  getMovieList,
  removeFromMovieList,
} from "../external/firebase";
import { year_from_date } from "../utils/converter";
import "./DNDlist.css";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";

const grid = 5;

const getItemStyle = (rating, isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: !isDragging
    ? "rgb(" + (255 - rating * 25) + ", " + rating * 25 + ", 224)"
    : "#33c9c7",
  ...draggableStyle,
});

function gridItem(item, i) {
  return (
    <div key={String.fromCharCode(97 + i)} style={getItemStyle(item.vote_average)}>
      <img
        alt={item.title}
        className="poster-image"
        src={"https://image.tmdb.org/t/p/w500" + item.poster_path}
      ></img>
      <h1 className="list-numbers">{i + 1}</h1>
      {/* {isDragging ? (
        <h1 className="list-numbers">?</h1>
      ) : (
        <h1 className="list-numbers">{i + 1}</h1>
      )} */}
      <p className="item-content">
        {item.title}{item.title === item.original_title ? null : "/" + item.original_title} (
        {year_from_date(item.release_date)})
      </p>
      <Button onClick={() => removeFromMovieList(item)}>
        Remove
      </Button>
    </div>
  )
}


const ResponsiveGridLayout = WidthProvider(Responsive);
const layouts = []
const colAmount = [6, 5, 4, 3, 1]; // lg, md, sm, xs, xxs

function Example() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getMovieList().then(res => setItems(res))
  }, [])

  if (items.length) {
    const layoutAmount = colAmount.length;

    for (let i = 0; i < layoutAmount; i++) {
      const layout = []
      items.forEach((item, j) => {
        layout.push({ i: String.fromCharCode(97 + j), x: j % colAmount[i], y: Math.floor(j / colAmount[i]), w: 1, h: 1, static: true })
      })
      layouts.push(layout)
    }
  }

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: layouts[0], md: layouts[1], sm: layouts[2], xs: layouts[3], xxs: layouts[4] }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: colAmount[0], md: colAmount[1], sm: colAmount[2], xs: colAmount[3], xxs: colAmount[4] }}
      rowHeight={300}
    >
      {items.map((item, index) => {
        return gridItem(item, index)
      })}
    </ResponsiveGridLayout>
  );
}

export default Example;
