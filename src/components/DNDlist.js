import React, { Component, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "react-bootstrap";
import {
  updateRank,
  getMovieList,
  removeFromMovieList,
  auth,
} from "../external/firebase";
import { year_from_date } from "../utils/converter";
import "./DNDlist.css";

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

const standardModeListItem = (item, index, isDragging) => {
  return (
    <div className="list-item">
      <img
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
        <Button onClick={() => removeFromMovieList(this.state.items[index])}>
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

const liteModeListItem = (item, index, isDragging) => {
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

let listItemFromMode = (mode, item, index, isDragging) => {
  console.log(mode);
  if (mode === "lite") {
    return liteModeListItem(item, index, isDragging);
  } else if (mode === "full") {
    return fullModeListItem(item, index, isDragging);
  }
  return standardModeListItem(item, index, isDragging);
};

export const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <Droppable {...props}>{children}</Droppable>;
};

class DNDlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      view_mode: props.view_mode,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // if item dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    // Update ranking based on the lists new order
    items.forEach((movie, index) => {
      movie.rank = index;
    });

    updateRank(items);

    this.setState({
      items,
    });
  }

  getMovies() {
    getMovieList(auth.currentUser.uid).then((res) => {
      this.setState({ items: res });
    });
  }

  componentDidMount() {
    this.getMovies();
  }

  render() {
    const { view_mode } = this.state;

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <StrictModeDroppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.items.map((item, index) => (
                <Draggable
                  key={item.original_title}
                  draggableId={item.original_title}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        item.vote_average,
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <div>
                        {listItemFromMode(
                          view_mode,
                          item,
                          index,
                          snapshot.isDragging
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    );
  }
}

export default DNDlist;
