import {default as React, PropTypes} from 'react'
import Relay from 'react-relay'
import {Header} from 'components/Header'
import {HelloTile} from 'components/HelloTile'
import 'normalize.css/normalize.css'
import styles from './App.css'

export const _App = ({viewer}) => {
  return (
  <div className={styles.app}>
    <Header />
    <div className={styles.widgets}>
      <HelloTile names={viewer.names} />
    </div>
  </div>
  )
}

_App.propTypes = {
  viewer: PropTypes.object
}

export const App = Relay.createContainer(_App, {
  initialVariables: {
    userid: window.ENV.CURRENT_USER.username
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on ViewerType {
        names:userBio(userid: $userid) {
          ${HelloTile.getFragment('names')}
        }
      }
    `
  }
})