import * as React from 'react';
import './style.css';
import getBills from './bills.json';
import getUsers from './users.json';
import getBillEngagementTimeseries from './billEngagementTimeseries.json';

const bills = getBills.bills;
const users = getUsers;
const billEngagementTimeseries = getBillEngagementTimeseries;

const totalCitizens = users.length;
const engagedCitizens = [
  ...new Set(billEngagementTimeseries.map((time) => time.userId)),
].length;
const percentageEngagedCitizens = Number(
  engagedCitizens / totalCitizens
).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 0 });

const billSupportFor = Object.assign(
  {},
  ...bills
    .map((bill) => {
      return billEngagementTimeseries.filter((time) => {
        return (
          time.billId === bill.type + '-' + bill.number &&
          time.supportedByUser === true
        );
      });
    })
    .map((bsf) => {
      return { [bsf[0].billId]: bsf.length };
    })
);

const billSupportAgainst = Object.assign(
  {},
  ...bills
    .map((bill) => {
      return billEngagementTimeseries.filter((time) => {
        return (
          time.billId === bill.type + '-' + bill.number &&
          time.supportedByUser === false
        );
      });
    })
    .map((bsf) => {
      return { [bsf[0].billId]: bsf.length };
    })
);

const billSupportForTime = Object.assign(
  {},
  ...bills
    .map((bill) => {
      return billEngagementTimeseries.filter((time) => {
        return (
          time.billId === bill.type + '-' + bill.number &&
          time.supportedByUser === true
        );
      });
    })
    .map((bsf) => {
      return {
        [bsf[0].billId]: [
          ...new Set(bsf.map((bsfss) => new Date(bsfss.createdAt))),
        ]
          .sort((a: Date, b: Date) => {
            return a.getTime() - b.getTime();
          })
          .filter(
            (date: Date, i, self) =>
              self.findIndex((d: Date) => d.getTime() == date.getTime()) === i
          )
          .map((time: Date) => {
            //console.log(JSON.stringify(bsf));

            return {
              [time.toDateString()]: bsf.filter((bsfsc) => {
                return new Date(bsfsc.createdAt).getTime() <= time.getTime();
              }).length,
            };
          }),
      };
    })
);

export default function App() {
  const [admin, setAdmin] = React.useState(false);
  const [timeSeries, setTimeSeries] = React.useState(false);
  const [selectedBill, setSelectedBill] = React.useState('');
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

  const BillTracker = ({ theBills }) => {
    return (
      <div>
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
  };

  const TimeSeries = () => {
    return (
      <div>
        <h3 style={{ display: 'inline-block' }}>
          Time Series of {selectedBill}
        </h3>
        <div
          style={{
            display: 'inline-block',
            margin: '5mm',
          }}
        >
          <button
            style={{ color: 'blue' }}
            onClick={() => setTimeSeries(false)}
          >
            Back to All Bills
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>% supporting</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: 'center' }}>
            {billSupportForTime[selectedBill].map((bsft) => (
              <tr key={Object.keys(bsft)[0]}>
                <td>{Object.keys(bsft)[0]}</td>
                <td>
                  {Number(
                    bsft[Object.keys(bsft)[0]] / totalCitizens
                  ).toLocaleString(undefined, {
                    style: 'percent',
                    minimumFractionDigits: 0,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const AllBills = () => {
    return (
      <div>
        <p>Total citizens: {totalCitizens}</p>
        <p>Engaged citizen: {engagedCitizens}</p>
        <p>% Engaged citizen: {percentageEngagedCitizens}</p>
        <table>
          <thead>
            <tr>
              <th>Time Breakdown</th>
              <th>Bill</th>
              <th>% supporting</th>
              <th>% not supporting</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: 'center' }}>
            {bills.map((bill) => (
              <tr key={bill.type + '-' + bill.number}>
                <td>
                  <button
                    style={{ color: 'blue' }}
                    onClick={() => {
                      setSelectedBill(bill.type + '-' + bill.number);
                      setTimeSeries(true);
                    }}
                  >
                    Select
                  </button>
                </td>
                <th>{bill.type + '-' + bill.number}</th>
                <td>
                  {Number(
                    billSupportFor[bill.type + '-' + bill.number] /
                      totalCitizens
                  ).toLocaleString(undefined, {
                    style: 'percent',
                    minimumFractionDigits: 0,
                  })}
                </td>
                <td>
                  {Number(
                    billSupportAgainst[bill.type + '-' + bill.number] /
                      totalCitizens
                  ).toLocaleString(undefined, {
                    style: 'percent',
                    minimumFractionDigits: 0,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const Admin = () => {
    return (
      <div>
        <h2>Admin</h2>
        {timeSeries ? <TimeSeries /> : <AllBills />}
      </div>
    );
  };

  return (
    <div>
      <h1>Civix</h1>
      <div style={{ position: 'absolute', top: 0, right: 0, margin: '5mm' }}>
        {admin ? (
          <button style={{ color: 'blue' }} onClick={() => setAdmin(false)}>
            Bill Tracker
          </button>
        ) : (
          <button style={{ color: 'blue' }} onClick={() => setAdmin(true)}>
            Admin
          </button>
        )}
      </div>
      {admin ? <Admin /> : <BillTracker theBills={bills} />}
    </div>
  );
}
