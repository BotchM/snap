import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {Grid, Row, Col} from 'react-flexbox-grid/lib'
import Box from './box'

const App = (props) => {
  return (
    <div>
      <Grid fluid={true} tagName="header" style={{paddingRight: 0, paddingLeft: 0}}>
        <Row style={{borderTop: '3px solid #007096', marginBottom: '5px'}}>
          <Col style={{paddingLeft: '50px'}} xs={12} sm={12} md={4} lg={4}>
            SFU logo
          </Col>
        </Row>
        <Row style={{backgroundColor: '#A6192E'}}>
          <Col xsOffset={11} style={{color: '#fff'}}>
            Hamburger
          </Col>
        </Row>
      </Grid>

      <Grid fluid={true} style={{paddingRight: 0, paddingLeft: 0}}>
        <Row>
          <Col xs={12} sm={8} md={8} lg={8} className="secondary">
            <Row>
              <Col xs>
                <div className='widget' style={{height: '450px'}}>My Schedule</div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={4} md={4} lg={4}>
                <div className='widget' style={{height: '350px'}}>Dining</div>
              </Col>
              <Col xs={12} sm={4} md={4} lg={4}>
                <div className='widget' style={{height: '350px'}}>News & Events</div>
              </Col>
              <Col xs={12} sm={4} md={4} lg={4}>
                <div className='widget' style={{height: '350px'}}>My Library</div>
              </Col>
            </Row>
          </Col>

          <Col xs={12} sm={4} md={4} lg={4} className="primary">
              <div className='widget' style={{height: '125px'}}>Hello Jane</div>
              <div className='widget' style={{height: '250px'}}>Coming Up</div>
              <div className='widget' style={{height: '550px'}}>Transit</div>
          </Col>
        </Row>
      </Grid>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
