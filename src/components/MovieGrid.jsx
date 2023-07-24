import React, { useState, useEffect } from "react";
import { getMovieList } from "../external/firebase";
import { Responsive, WidthProvider } from "react-grid-layout";
import gridItem from "./MovieGridItem";

import "./MovieGrid.css";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";


const layoutNames = ['lg', 'md', 'sm', 'xs', 'xxs']
const ResponsiveGridLayout = WidthProvider(Responsive);

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
