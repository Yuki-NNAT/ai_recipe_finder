import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('[ErrorBoundary]', error, info); }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <span className="text-5xl">🍽️</span>
          <h1 className="font-display text-2xl font-bold text-ink">Oops, something went wrong</h1>
          <p className="text-sm text-muted max-w-md">{this.state.error?.message}</p>
          <button
            className="rounded-2xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white"
            onClick={() => window.location.href = '/'}
          >
            Back to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
