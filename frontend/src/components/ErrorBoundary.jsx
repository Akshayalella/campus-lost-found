import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('UI error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="state-box">
          <h2>Something went wrong</h2>
          <p>An unexpected error occurred while displaying this page.</p>
          <button className="btn btn-primary" onClick={() => window.location.assign('/')}>
            Back to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
