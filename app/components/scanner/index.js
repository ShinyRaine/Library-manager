import React from 'react'
import Quagga from '../../../static/quagga';

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
              deviceId: 0,
              facingMode: "environment",
          }
        }
      })
  }
  onCancel (e) {
    e.preventDefault()
    if (this._scanUntilResult) {
      this._scanUntilResult.cancel()
      this_scanUntilResult = null
    }
  }
  componentDidMount() {
    this._scanUntilResult = this._scanner.toPromise();
    this._scanUntilResult.promise
      .then(this.props.onDetected)
      .catch(this.props.onCancel);
  }
  render() {
    return (
        <div className="overlay_content"></div>
    )
  }
}

export default Scanner
