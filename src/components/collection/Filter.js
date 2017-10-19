import React, { Component } from 'react';
import { Panel, Grid, TextField } from '@sparkpost/matchbox';

export default class CollectionFilter extends Component {
  handleChange = (e) => {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <Panel>
        <Grid>
          <Grid.Column>
            <TextField onChange={this.handleChange} />
          </Grid.Column>
        </Grid>
      </Panel>
    );
  }
}
