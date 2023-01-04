import React, { Component, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Col, Container, Row, Button } from "react-bootstrap";
import {
  updateRank,
  getMovieList,
  removeFromMovieList,
} from "../external/firebase";
import "./DNDlist.css";
import { auth } from "../external/firebase";

// Reorder the list items
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 10;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "#77e2e0" : "#33c9c7",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "#a1ffc5" : "#daffff",
  padding: grid,
});

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

  render() {
    return (
      <div>
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
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <Container>
                          <Row>
                            <Col xs={12} md={10}>
                              <p className="item-content">
                                {item.original_title}
                              </p>
                            </Col>
                            <Col>
                              <Button
                                onClick={() =>
                                  removeFromMovieList(this.state.items[index])
                                }
                              >
                                Remove
                              </Button>
                            </Col>
                          </Row>
                        </Container>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>
        <Button
          className="buttons"
          onClick={() => this.getMovies(this.state.items)}
        >
          Refresh
        </Button>
      </div>
    );
  }
}

export default DNDlist;
