import React from 'react';
import { observer } from 'mobx-react';

function goodImage(school) {
  switch (school) {
    case 'EPFL' : return 'logo_epfl.jpg'
    case 'UNIFR' : return 'logo_uni_fr.jpg'
    case 'HEIA-FR' : return 'Logo_EIA.jpg'
    default: return 'none';
  }
}

function getKeywords(test) {
  let text = ''
  for (let i = 0; i < test.length; i += 1) {
    text += test[i].key;
    if (i !== test.length - 1) {
      text += ', ';
    }
  }


  return text;
}

const Card = ({ employe }) => {
  const keywordsSlice = employe.keywords.slice(0, 2);

  return (<div key={employe.id} className="card">
    <table><tbody>
      <tr><td><h2 className="name">{employe.lastname} {employe.name}</h2></td></tr>
      <tr><td><img role="presentation" src={employe.img} /></td></tr>
      <tr><td>
        <h3 className="fonction">
          {employe.fonction}
          <br />
          <span style={{ fontSize: '0.8em' }}>{employe.institut}</span>
        </h3>
      </td></tr>
      <tr><td><a href={employe.contact} >Contact</a></td></tr>
      <tr><td><span className="keywords"> {getKeywords(keywordsSlice)}</span></td></tr>
      <tr><td valign="bottom"><img role="presentation" className="logo" src={`/images/${goodImage(employe.school)}`} /></td></tr>
    </tbody></table>
  </div>);
};

export default observer(Card);
