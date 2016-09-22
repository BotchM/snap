import { default as React, PropTypes } from 'react'
import Relay from 'react-relay'
import { Widget } from 'components/Widget'
import LibaryHours from 'components/LibraryHours'
import MyLibrary from 'components/MyLibrary'

const _Library = React.createClass({
  propTypes: {
    viewer: PropTypes.object
  },

  render() {
    const { library } = this.props.viewer
    return (
      <div>
        <Widget title="Library Hours">
          <LibaryHours />
        </Widget>
        <Widget title="My Library">
          <MyLibrary
            barcode={window.ENV.CURRENT_USER.barcode}
            fines={library.fines}
            checkedOut={library.checked_out}
            holds={library.holds}
          />
        </Widget>
      </div>
    )

  }
})

export const Library = Relay.createContainer(_Library, {
  initialVariables: {
    barcode: window.ENV.CURRENT_USER.barcode
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on ViewerType {
        library(barcode: $barcode) {
          fines
          checked_out {
            title
            link
            due
            due_printable
          }
          holds {
            title
            link
            status
            pickup
          }
        }
      }
    `
  }
})
