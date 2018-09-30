import * as React from 'react';

export const createScrollStore = () => {
  let scrollPosition = 0;

  return class RestoreScrollOnMount extends React.Component {
    componentDidMount() {
      window.scrollTo(0, scrollPosition);
    }

    componentWillUnmount() {
      if (document.body) {
        scrollPosition =
          (document.documentElement && document.documentElement.scrollTop) ||
          document.body.scrollTop ||
          window.pageYOffset;
      }
    }

    render() {
      return null;
    }
  };
};

export default createScrollStore;
