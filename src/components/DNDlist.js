import React, { Component, useState, useEffect } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Col, Container, Row } from "react-bootstrap";
import {
  updateRank,
  getMovieList,
  removeFromMovieList,
  auth,
} from "../external/firebase";
import { year_from_date } from "../utils/converter";
import "./DNDlist.css";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
// import {
//   GridContextProvider,
//   GridDropZone,
//   GridItem,
//   move,
//   swap
// } from "react-grid-dnd";
import { Responsive, WidthProvider } from "react-grid-layout";

// Reorder the list items
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

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

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "#a1ffc5" : "#daffff",
  padding: grid,
});

const standardModeListItem = (items, item, index, isDragging) => {
  return (
    <div className="list-item">
      <img
        alt={item}
        className="poster-image"
        src={"https://image.tmdb.org/t/p/w500" + item.poster_path}
      ></img>
      <div className="left p-0">
        {isDragging ? (
          <h1 className="list-numbers">?</h1>
        ) : (
          <h1 className="list-numbers">{index + 1}</h1>
        )}

        {item.title === item.original_title ? (
          <p className="item-content">
            {item.title} ({year_from_date(item.release_date)})
          </p>
        ) : (
          <p className="item-content">
            {item.title}/{item.original_title} (
            {year_from_date(item.release_date)})
          </p>
        )}
        <Button onClick={() => removeFromMovieList(items[index])}>
          Remove
        </Button>
      </div>
    </div>
  );
};

const fullModeListItem = (item, index, isDragging) => {
  return (
    <div className="list-item">
      <div className="p-0">
        <img
          alt="Movie poster"
          id="poster-image"
          src={"https://image.tmdb.org/t/p/w500" + item.poster_path}
        ></img>
      </div>
      <div className="p-0">
        <p className="item-content">
          {item.title}/{item.original_title} (item.release_date)
        </p>
        <Button onClick={() => removeFromMovieList(this.state.items[index])}>
          Remove
        </Button>
        <br />
        <p>{item.overview}</p>
      </div>
    </div>
  );
};

const liteModeListItem = (item, index) => {
  return (
    <div className="list-item">
      <div className="p-0">
        <p className="item-content">
          {item.title}/{item.original_title} (
          {year_from_date(item.release_date)})
        </p>
      </div>
      <div className="p-0">
        <Button onClick={() => removeFromMovieList(this.state.items[index])}>
          Remove
        </Button>
      </div>
    </div>
  );
};

let listItemFromMode = (items, mode, item, index, isDragging) => {
  console.log(mode);
  if (mode === "lite") {
    return liteModeListItem(item, index, isDragging);
  } else if (mode === "full") {
    return fullModeListItem(item, index, isDragging);
  }
  return standardModeListItem(items, item, index, isDragging);
};

// export const StrictModeDroppable = ({ children, ...props }) => {
//   const [enabled, setEnabled] = useState(false);
//   useEffect(() => {
//     const animation = requestAnimationFrame(() => setEnabled(true));
//     return () => {
//       cancelAnimationFrame(animation);
//       setEnabled(false);
//     };
//   }, []);
//   if (!enabled) {
//     return null;
//   }
//   return <Droppable {...props}>{children}</Droppable>;
// };

// function DNDlist() {
//   const [items, setItems] = useState([]);
//   const [colAmount, setColAmount] = useState(4);

//   useEffect(() => {
//     getMovieList().then(res => setItems(res))
//   }, [])

//   const heightRatio = 200;

//   function onChange(sourceIndex, targetIndex) {
//     const nextState = swap(items, sourceIndex, targetIndex);
//     setItems(nextState)
//   }

//   return (
//     <GridContextProvider onChange={onChange}>
//       <GridDropZone
//         id="items"
//         boxesPerRow={colAmount}
//         rowHeight={heightRatio - 5}
//         style={{ height: Math.ceil(items.length / colAmount) * heightRatio / 100 + "px" }}
//       >
//         {(items.map((item) => (
//           <GridItem key={item.title} style={getItemStyle(item.vote_average)}>
//             {/* {listItemFromMode(items, "", item, index)} */}
//           </GridItem>
//         )))}
//       </GridDropZone>
//     </GridContextProvider >
//   )
// }

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

function Example() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getMovieList().then(res => setItems(res))
  }, [])

  if (!layouts.length) {
    const lg = []
    const md = []
    const sm = []
    const xs = []
    const xxs = []

    items.forEach((item, i) => {
      const colAmount = [8, 6, 4, 3, 1]; // lg, md, sm, xs, xxs
      lg.push({ i: String.fromCharCode(97 + i), x: i % colAmount[0], y: Math.floor(i / colAmount[0]), w: 1, h: 1, static: true })
      md.push({ i: String.fromCharCode(97 + i), x: i % colAmount[1], y: Math.floor(i / colAmount[1]), w: 1, h: 1, static: true })
      sm.push({ i: String.fromCharCode(97 + i), x: i % colAmount[2], y: Math.floor(i / colAmount[2]), w: 1, h: 1, static: true })
      xs.push({ i: String.fromCharCode(97 + i), x: i % colAmount[3], y: Math.floor(i / colAmount[3]), w: 1, h: 1, static: true })
      xxs.push({ i: String.fromCharCode(97 + i), x: i % colAmount[4], y: Math.floor(i / colAmount[4]), w: 1, h: 1, static: true })
    })
    layouts.push(lg, md, sm, xs, xxs)
  }

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: layouts[0], md: layouts[1], sm: layouts[2], xs: layouts[3], xxs: layouts[4] }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 8, md: 6, sm: 4, xs: 3, xxs: 1 }}
      rowHeight={300}
    >
      {items.map((item, index) => {
        return gridItem(item, index)
      })}
    </ResponsiveGridLayout>
  );
}

// class DNDlist extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       items: [],
//       view_mode: props.view_mode,
//     };
//     this.onDragEnd = this.onDragEnd.bind(this);
//     this.onChange = this.onChange.bind(this);
//   }

//   onDragEnd(result) {
//     // if item dropped outside the list
//     if (!result.destination) {
//       return;
//     }

//     const items = reorder(
//       this.state.items,
//       result.source.index,
//       result.destination.index
//     );

//     // Update ranking based on the lists new order
//     items.forEach((movie, index) => {
//       movie.rank = index;
//     });

//     updateRank(items);

//     this.setState({
//       items,
//     });
//   }

//   getMovies() {
//     getMovieList(auth.currentUser.uid).then((res) => {
//       this.setState({items: res });
//     });
//   }

//   componentDidMount() {
//     this.getMovies()
//   }



//   render() {
//     const {view_mode} = this.state;
//     const colAmount = 4;
//     const heightRatio = 250;

//     return (

//       // <DragDropContext onDragEnd={this.onDragEnd}>
//       //   <StrictModeDroppable droppableId="droppable">
//       //     {(provided, snapshot) => (
//       //       <div
//       //         {...provided.droppableProps}
//       //         ref={provided.innerRef}
//       //         style={getListStyle(snapshot.isDraggingOver)}
//       //       >
//       //         {this.state.items.map((item, index) => (
//       //           <Draggable
//       //             key={item.original_title}
//       //             draggableId={item.original_title}
//       //             index={index}
//       //             className="draggables"
//       //           >
//       //             {(provided, snapshot) => (
//       //               <div
//       //                 ref={provided.innerRef}
//       //                 {...provided.draggableProps}
//       //                 {...provided.dragHandleProps}
//       //                 style={getItemStyle(
//       //                   item.vote_average,
//       //                   snapshot.isDragging,
//       //                   provided.draggableProps.style
//       //                 )}
//       //               >
//       //                 <div>
//       //                   {listItemFromMode(
//       //                     view_mode,
//       //                     item,
//       //                     index,
//       //                     snapshot.isDragging
//       //                   )}
//       //                 </div>
//       //               </div>
//       //             )}
//       //           </Draggable>
//       //         ))}
//       //         {provided.placeholder}
//       //       </div>
//       //     )}
//       //   </StrictModeDroppable>
//       // </DragDropContext>
//     );
//   }
// }

export default Example;
