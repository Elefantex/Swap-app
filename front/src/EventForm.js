import React, { Component } from 'react';

class EventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      date: '',
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onAddEvent(this.state);
    this.setState({
      title: '',
      description: '',
      date: '',
    });
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={this.state.title}
          onChange={this.handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={this.state.description}
          onChange={this.handleChange}
        />
        <input
          type="date"
          name="date"
          value={this.state.date}
          onChange={this.handleChange}
        />
        <button type="submit">Add Event</button>
      </form>
    );
  }
}

export default EventForm;
