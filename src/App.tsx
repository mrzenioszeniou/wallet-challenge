import React from 'react';
import iconCopy from './img/copy.svg';
import iconDice from './img/dice.svg';
import iconShown from './img/shown.svg';
import iconHidden from './img/hidden.svg';
import './css/App.css';

import { randomBytes } from 'crypto';
import { EthereumAddress, HDKey, Mnemonic } from 'wallet.ts';
import copy from 'copy-to-clipboard';

interface Props {};

interface State {
  sensitive: boolean;
  valid: null | boolean;
  mnemonic: string;
  address: string;
  key: string;
}

class App extends React.Component<Props, State>  {

  constructor(props: Props) {
    super(props);
    this.state = {
      sensitive: false,
      valid: null,
      mnemonic: "",
      address: "",
      key: "",
    };
  }

  render() {
    return (
      <div className="App">

        <h1>Wallet Challenge - IOHK</h1>

        <div className='vbox'>
          <p className='intro'>
            This is a simple tool that allows you to generate BIP39 mnemonics, or use existing ones
            to restore HD wallets.
            <br/>
            This data is sensitive and you should be aware of your
            surroundings if you choose to display it on your screen. 
          </p>
          <div 
              className='sensitiveButton'
              onClick={() => this.setState({sensitive: !this.state.sensitive})}>
            <div>Show/Hide Sensitive Data</div>
            <img
                alt="Show/Hide Sensitive Data"
                className="bigButtonImg"
                src={ this.state.sensitive ? iconShown : iconHidden }/>
          </div>
        </div>

        <div className="vbox">
          Mnemonic Phrase
          <div className="hbox">
            <input
                className={ this.state.valid == null ? "" : this.state.valid ? "valid" : "invalid" }
                onChange={ (e) => this.handleMnemonicChange(e.target.value)}
                value={this.state.mnemonic} 
                type={ this.state.sensitive ? "text" : "password" }/>
            <img 
                alt="Generate Mnemonic"
                className="buttonImg"
                style={{borderTopRightRadius: 0, borderBottomRightRadius:0 }}
                src={iconDice} onClick={() => this.generateMnemonic()}/>
            <img
                alt="Copy to Clipboard"
                className="buttonImg"
                src={iconCopy}
                onClick={() => { if (this.state.valid) copy(this.state.mnemonic); }}/>
          </div>
        </div>

        <div className="vbox">
          Master Private Key
          <div className="hbox">
            <input
                value={this.state.key}
                type={ this.state.sensitive ? "text" : "password" }
                disabled={true}/>
            <img 
                alt="Copy to Clipboard"
                className="buttonImg"
                src={iconCopy}
                onClick={() => { if (this.state.valid) copy(this.state.key); }}/>
          </div>
        </div>

        <div className="vbox">
          Ethereum Address
          <div className="hbox">
            <input
                value={this.state.address}
                type={ this.state.sensitive ? "text" : "password" }
                disabled={true}/>
            <img
                alt="Copy to Clipboard"
                className="buttonImg"
                src={iconCopy}
                onClick={() => { if (this.state.valid) copy(this.state.address); }}></img>
          </div>
        </div>
        
      </div>
    );
  }

  /**
   * Verifies the provided mnemonic and updates the state appropriately.
   * @param mnemonicStr Mnemonic `string`.
   */
  handleMnemonicChange(mnemonicStr: string) {

    const mnemonic = Mnemonic.parse(mnemonicStr);

    if (mnemonic == null) {
      this.setState({
        valid: false,
        mnemonic: mnemonicStr,
        address: "",
        key: "",
      })
      return;
    }
    
    const masterKey = HDKey.parseMasterSeed(mnemonic.toSeed());
    const address = EthereumAddress.from(masterKey.publicKey);

    this.setState({
      valid: true,
      mnemonic: mnemonicStr,
      address: address.address.toLowerCase(),
      key: Buffer.from(masterKey.privateKey!).toString("hex").toLowerCase(),
    })
  }

  /**
   * Generates a random mnemonic and updates the state appropriately.
   */
  generateMnemonic() {
    this.handleMnemonicChange(Mnemonic.generate(randomBytes(32)).phrase);
  }

}

export default App;
