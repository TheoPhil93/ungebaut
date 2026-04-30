import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (typeof window !== 'undefined' && window.console) {
      // Real error reporting (Sentry etc.) is tracked in issue #33.
      // Until then, surface to the console so devs see the stack.
      console.error('[ErrorBoundary]', error, info);
    }
  }

  handleReload = () => {
    if (typeof window !== 'undefined') window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="error-boundary" role="alert">
          <p className="error-boundary__eyebrow">Something broke</p>
          <h1 className="error-boundary__title">UNGEBAUT</h1>
          <p className="error-boundary__body">
            The page hit an unexpected error and could not finish rendering.
          </p>
          <button type="button" className="error-boundary__cta" onClick={this.handleReload}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
