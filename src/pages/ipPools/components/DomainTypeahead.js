/* eslint-disable */
import Downshift from 'downshift';
import React, { Component } from 'react';
import { ActionList, TextField } from '@sparkpost/matchbox';
import cx from 'classnames';

import sortMatch from 'src/helpers/sortMatch';
import styles from './DomainTypeahead.module.scss';

/**
 * This component controls downshift's inputValue manually to prevent cursor jumping on change
 * See:
 * https://github.com/paypal/downshift#oninputvaluechange
 * https://github.com/paypal/downshift/issues/217
 */
export class DomainTypeahead extends Component {

  state = {
    value: ''
  }

  componentDidMount() {
    this.setState({ value: this.props.value });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  handleInputValueChange = (value) => {
    this.setState({ value });
  }

  handleStateChange = (changes, downshift) => {
    const { onChange } = this.props;

    // Push changes to redux form store
    if (changes.hasOwnProperty('inputValue')) {
      onChange && onChange(changes.inputValue);
    }

    // Highlights first item in list by default
    if (!downshift.highlightedIndex) {
      downshift.setHighlightedIndex(0);
    }
  }

  getMatches = (inputValue, selectedItem) => {
    let matches = [];
    const { domains } = this.props;

    matches = domains.reduce((options, { domain }) => {
      if (!selectedItem || inputValue !== domain) {
        options.push(`${domain}`);
      }
      return options;
    }, []);

    matches = sortMatch(matches, inputValue, (item) => item);

    const domainNames = domains.reduce((options, { domain }) => {
      options.push(domain);
      return options;
    }, []);

    return matches.length ? matches : domainNames;
  }

  typeaheadFn = ({
    getInputProps,
    getItemProps,
    highlightedIndex,
    inputValue,
    selectedItem,
    isOpen,
    openMenu
  }) => {
    const { domains, onChange, value, error, placeholder = (isOpen ? 'Type to search' : 'Select a domain'), ...rest } = this.props;
    const matches = this.getMatches(inputValue, selectedItem);

    // Create ActionList actions from matches
    const mappedItems = matches.map((item, index) => ({
      ...getItemProps({ item, index }),
      content: item,
      highlighted: highlightedIndex === index
    }));

    const textFieldProps = getInputProps({
      ...rest,
      error: !isOpen && error ? error : undefined,
      value: this.state.value,
      placeholder
    });

    const listClasses = cx(
      styles.List,
      (isOpen && (!inputValue || matches.length)) && styles.open
    );

    return (
      <div className={styles.Typeahead}>
        <ActionList className={listClasses} actions={mappedItems} />
        <TextField {...textFieldProps} onFocus={openMenu} />
      </div>
    );
  }

  render() {
    return (
      <Downshift
        onInputValueChange={this.handleInputValueChange}
        onStateChange={this.handleStateChange}
        selectedItem={this.state.value}>
        {this.typeaheadFn}
      </Downshift>
    );
  }
}

const DomainTypeaheadWrapper = ({ input, meta, ...rest }) => {
  const { active, error, touched } = meta;
  return (
    <DomainTypeahead
      {...input}
      error={!active && touched && error ? error : undefined}
      {...rest} />
  );
};

export default DomainTypeaheadWrapper;
