import React from 'react'
import Quagga from '../../../static/quagga';
import './style.scss'
class Scanner extends React.Component {
  constructor(props){
    super(props)
    this._scanner = Quagga
      .decoder({readers: ['ean_reader','code_39_reader','code_128_reader',]})
      .locator({patchSize: 'medium'})
      .fromSource({
        target: '.overlay_content',
        constraints: {
          name: "Live",
          type: "LiveStream",
          constraints: {
              width: 800,
              height: 600,
              deviceId: props && props.deviceId,
              facingMode: "environment",
          }
        }
      })
  }
  componentDidMount() {
      this._scanner
          .addEventListener('detected', this.props.onDetected)
          .start();
  }

  componentWillUnmount() {
      this._scanner
          .removeEventListener('detected', this.props.onDetected)
          .stop();
  }
  render() {
    return (
        <div className="overlay_content"></div>
    )
  }
}

export default Scanner
