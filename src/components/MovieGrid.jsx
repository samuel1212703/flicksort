import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import {
  getMovieList,
  removeFromMovieList,
} from "../external/firebase";
import { year_from_date } from "../utils/converter";
import "./MovieGrid.css";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";

const layoutNames = ['lg', 'md', 'sm', 'xs', 'xxs']
const ResponsiveGridLayout = WidthProvider(Responsive);

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

function gridItem(item, i) {
  return (
    <div key={"movieItem" + i} style={getItemStyle(item.vote_average)}>
      {itemContent(item, i)}
      <Button onClick={() => removeFromMovieList(item)}>
        Remove
      </Button>
    </div>
  )
}

function getLayouts(items) {
  const gridLayouts = {} //lg: [], md: [], sm: [], xs: [], xxs: []
  for (let k = 0; k < colAmount.length; k++) {
    const layout = []
    for (let j = 0; j < items.length; j++) {
      layout.push({
        i: "movieItem" + j,
        x: j % colAmount[k],
        y: Math.floor(j / colAmount[k]) * rowHeight,
        w: 1,
        h: rowHeight
      })
    }
    gridLayouts[layoutNames[k]] = layout
  }
  return gridLayouts
}

// Main variables
const colAmount = [5, 4, 3, 2, 1]; // lg, md, sm, xs, xxs
const rowHeight = 1;
const breakpointsObject = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };

export default function MovieGrid() {
  const [items, setItems] = useState([]);
  const [gridLayouts, setLayouts] = useState({ lg: [], md: [], sm: [], xs: [], xxs: [] });

  useEffect(() => {
    getMovieList().then(res => {
      setItems(res, setLayouts(getLayouts(res)))
    })
  }, [])

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{
        lg: gridLayouts.lg,
        md: gridLayouts.md,
        sm: gridLayouts.sm,
        xs: gridLayouts.xs,
        xxs: gridLayouts.xxs
      }}
      breakpoints={breakpointsObject}
      cols={{
        lg: colAmount[0],
        md: colAmount[1],
        sm: colAmount[2],
        xs: colAmount[3],
        xxs: colAmount[4]
      }}
      rowHeight={250}
    >
      {items.map((item, index) => {
        return gridItem(item, index)
      })}
    </ResponsiveGridLayout>
  );
}


// function Example() {
//   const [items, setItems] = useState([]);
//   const [gridLayouts, setLayouts] = useState({ lg: [], md: [], sm: [], xs: [], xxs: [] });

//   useEffect(() => {
//     getMovieList().then(res => {
//       setItems(res)
//       if (res.length !== 0) {
//         console.log("hey")
//         setLayouts(getLayouts(items));
//       }
//     })
//   }, [])

//   return (
//     <ResponsiveGridLayout
//       className="layout"
//       layouts={{
//         lg: gridLayouts.lg,
//         md: gridLayouts.md,
//         sm: gridLayouts.sm,
//         xs: gridLayouts.xs,
//         xxs: gridLayouts.xxs
//       }}
//       breakpoints={breakpointsObject}
//       cols={{
//         lg: colAmount[0],
//         md: colAmount[1],
//         sm: colAmount[2],
//         xs: colAmount[3],
//         xxs: colAmount[4]
//       }}
//       rowHeight={250}
//     >
//       {items.map((item, index) => {
//         return gridItem(item, index)
//       })}
//     </ResponsiveGridLayout>
//   );
// }

// export default Example;
