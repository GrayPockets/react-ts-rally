import * as React from 'react';
import './style.css';
import getBills from './bills.json';

const bills = getBills.bills;

export default function App() {
  const [supportedBills, setSupportedBills] = React.useState(
    localStorage.getItem('supportedBills')
      ? JSON.parse(localStorage.getItem('supportedBills'))
      : {}
  );

  const Support = (support, billNumber) => {
    const updater = {};
    updater[billNumber] = support;

    const deconstructed = {
      ...supportedBills,
      ...updater,
    };

    setSupportedBills(deconstructed);

    localStorage.setItem('supportedBills', JSON.stringify(deconstructed));
  };

  const LeftSide = ({ theBill }) => {
    return (
      <div
        style={{
          display: 'inline-block',
          paddingRight: '60mm',
        }}
      >
        <h4>
          {theBill.type} {theBill.number}
        </h4>
        <h3>{theBill.title}</h3>
        <p>
          <b>Last Update</b> - {theBill.latestAction.text}
          <br />({theBill.latestAction.actionDate})
        </p>
      </div>
    );
  };

  const RightSide = ({ supported, billNumber }) => {
    return (
      <div
        style={{
          display: 'inline-block',
          float: 'right',
          borderLeft: 'solid',
          background: 'LightSalmon',
          width: '57mm',
          height: '100%',
          position: 'absolute',
          right: 0,
          top: 0,
        }}
      >
        {supported === undefined ? (
          <div
            style={{
              display: 'inline-block',
              margin: '10mm 0',
            }}
          >
            <p
              style={{
                margin: '0mm 5mm',
              }}
            >
              <b>Do you support this bill?</b>
            </p>
            <button
              style={{
                display: 'inline-block',
                border: 'solid black',
                boxShadow: '1mm 1mm black',
                background: 'green',
                color: 'white',
                margin: '5mm',
                padding: '1mm 3mm 1mm 3mm',
              }}
              onClick={() => Support(true, billNumber)}
            >
              <i className="fa fa-thumbs-up"></i> Yes
            </button>
            <div
              style={{
                display: 'inline-block',
                border: 'solid black',
                boxShadow: '1mm 1mm black',
                background: 'red',
                color: 'white',
                margin: '5mm',
                padding: '1mm 3mm 1mm 3mm',
              }}
              onClick={() => Support(false, billNumber)}
            >
              <i className="fa fa-thumbs-down"></i> No
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'inline-block',
              margin: '10mm 0',
            }}
          >
            {supported === true ? (
              <div
                style={{
                  margin: '0mm 5mm',
                }}
              >
                <p>
                  <b>
                    You <span style={{ color: 'green' }}>Support</span> this
                    bill
                  </b>
                </p>
                <p>
                  <i
                    className="fa fa-thumbs-up"
                    style={{ color: 'green', fontSize: 'xx-large' }}
                  ></i>
                </p>
              </div>
            ) : (
              <div
                style={{
                  margin: '0mm 5mm',
                }}
              >
                <p>
                  <b>
                    You do <span style={{ color: 'red' }}>Not Support</span>{' '}
                    this bill
                  </b>
                </p>
                <p>
                  <i
                    className="fa fa-thumbs-down"
                    style={{ color: 'red', fontSize: 'xx-large' }}
                  ></i>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1>Civix</h1>
      <h2>Bill Tracker</h2>
      {bills.map((bill) => (
        <div
          style={{
            display: 'block',
            border: 'solid',
            margin: '0 0 5mm 0',
            overflow: 'hidden',
            position: 'relative',
            width: '100%',
          }}
          key={bill.type + '-' + bill.number}
        >
          <LeftSide theBill={bill} />
          <RightSide
            supported={supportedBills[bill.type + '-' + bill.number]}
            billNumber={bill.type + '-' + bill.number}
          />
        </div>
      ))}
    </div>
  );
}
