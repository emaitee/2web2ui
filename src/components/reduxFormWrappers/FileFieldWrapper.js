import _ from 'lodash';
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Button, Error, Label } from '@sparkpost/matchbox';

import styles from './FileFieldWrapper.module.scss';

// TODO: Integrate in Matchbox if Dropzone isn't too big of a dependency
// TODO: Need a clear button
export default class FileFieldWrapper extends Component {
  handleCancel = () => {
    this.props.input.onBlur(); // run validation
  }

  // Always set value to dropped file even if rejected for validate functions to set error
  handleDrop = (acceptedFiles, rejectedFiles) => {
    const files = [...acceptedFiles, ...rejectedFiles];
    this.props.input.onChange(files[0]);
    this.props.input.onBlur(); // run validation
  }

  handleOpen = () => {
    this.dropzoneRef.open();
  }

  setDropzoneRef = (ref) => {
    this.dropzoneRef = ref;
  }

  render() {
    const { disabled, fileType, helpText, input, label, meta, required } = this.props;
    const filename = _.get(input, 'value.name');

    return (
      <fieldset className={styles.Field}>
        <Label id={input.id}>{label}{required && ' *'}</Label>
        <div className={styles.InputWrapper}>
          <Dropzone
            accept={`.${fileType}`}
            activeClassName={styles.DropzoneActive}
            className={styles.Dropzone}
            disabledClassName={styles.DropzoneDisabled}
            disablePreview
            disabled={disabled}
            id={input.id}
            multiple={false}
            name={input.name}
            onDrop={this.handleDrop}
            onFileDialogCancel={this.handleCancel}
            ref={this.setDropzoneRef}
          >
            {filename
              ? <span>{filename}</span>
              : <span className={styles.Placeholder}>example.{fileType}</span>}
          </Dropzone>
          <Button
            className={styles.Button}
            disabled={disabled}
            onClick={this.handleOpen}
          >
            Choose File
          </Button>
        </div>
        {helpText && <div className={styles.Help}>{helpText}</div>}
        {meta.touched && meta.error && <Error error={meta.error} />}
      </fieldset>
    );
  }
}
