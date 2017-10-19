import React, { Component } from 'react';
import qs from 'query-string';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import Pagination from './Pagination';
import CollectionFilter from './Filter';

import { objectSortMatch, getObjectPattern } from 'src/helpers/sortMatch';

const PassThroughWrapper = (props) => props.children;

class Collection extends Component {
  state = {};

  componentDidMount() {
    const { defaultPerPage = 25, location } = this.props;
    this.setState({
      perPage: defaultPerPage,
      currentPage: qs.parse(location.search).page || 1
    });
  }

  handlePageChange = (index) => {
    const currentPage = index + 1;
    this.setState({ currentPage }, this.maybeUpdateQueryString);
  }

  handlePerPageChange = (perPage) => {
    this.setState({ perPage, currentPage: 1 }, this.maybeUpdateQueryString);
  }

  maybeUpdateQueryString() {
    const { currentPage, perPage } = this.state;
    const { search, pathname } = this.props.location;
    const parsed = qs.parse(search);
    if (parsed.page || this.props.updateQueryString) {
      const updated = Object.assign(parsed, { page: currentPage, perPage });
      this.props.history.push(`${pathname}?${qs.stringify(updated)}`);
    }
  }

  getVisibleRows() {
    const { perPage, currentPage } = this.state;
    const { rows } = this.props;
    const currentIndex = (currentPage - 1) * perPage;
    let rowsToSlice = rows;
    if (this.state.filtering) {
      rowsToSlice = objectSortMatch({
        items: rows,
        pattern: this.state.filterPattern,
        objectPattern: this.state.filterObjectPattern,
        getter: (key) => `${key.name} ${key.key}`
      });
    }
    return rowsToSlice.slice(currentIndex, currentIndex + perPage);
  }

  renderPagination() {
    const { rows, perPageButtons, pagination } = this.props;
    const { currentPage, perPage } = this.state;

    if (!pagination || !currentPage) { return null; }

    return (
      <Pagination
        data={rows}
        perPage={perPage}
        currentPage={currentPage}
        perPageButtons={perPageButtons}
        onPageChange={this.handlePageChange}
        onPerPageChange={this.handlePerPageChange}
      />
    );
  }

  handleFilterChange = _.debounce((value) => {
    const update = {
      currentPage: 1,
      filtering: false
    };

    if (value) {
      update.filtering = true;
      update.filterPattern = value;
      update.filterObjectPattern = getObjectPattern(value);
    }

    this.setState(update);
  }, 500);

  render() {
    const {
      rowComponent: RowComponent,
      rowKeyName = 'id',
      headerComponent,
      outerWrapper: OuterWrapper = PassThroughWrapper,
      bodyWrapper: BodyWrapper = PassThroughWrapper
    } = this.props;

    return (
      <div>
        <CollectionFilter onChange={this.handleFilterChange} />
        <OuterWrapper>
          {headerComponent}
          <BodyWrapper>
            {this.getVisibleRows().map((row, i) => <RowComponent key={`${row[rowKeyName]}-${i}`} {...row} />)}
          </BodyWrapper>
        </OuterWrapper>
        {this.renderPagination()}
      </div>
    );
  }
}

export default withRouter(Collection);
