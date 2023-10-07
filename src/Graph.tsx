import React, { Component } from 'react';
import { Table, TableData } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;


    // We need to update schema in order to get new graph interface
    const schema = {
      abc_price:'float',
      def_price:'float',
      ratio_of_prices:'float',
      timestamp: 'date',
      upper_bound_val:'float',
      lower_bound_val:'float',
      alert_val:'float',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      // we need to make changes in the element attributes as well
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio_of_prices","upper_bound_val","lower_bound_val","alert_val"]');
      elem.setAttribute('aggregates', JSON.stringify({
        abc_price:'avg',
        def_price:'avg',
        ratio_of_prices:'avg',
        timestamp: 'distinct count',
        upper_bound_val:'avg',
        lower_bound_val:'avg',
        alert_val:'avg',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update([
        DataManipulator.generateRow(this.props.data),
      ] as unknown as TableData);
    }
  }
}

export default Graph;
