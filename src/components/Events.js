import React from "react";
import Timeline from 'react-calendar-timeline';
// make sure you include the timeline stylesheet or the timeline will not be styled
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';

import './Events.css';

export default function Events() {
  const [eventInfo, setEventInfo] = React.useState(null);

  const groups = [{ id: 1, title: 'Shifts' }, { id: 2, title: 'Jumps' }, { id: 3, title: 'Land Missions' }, { id: 4, title: 'Random Events' }];

  const items = [
    {
      id: 1,
      group: 2,
      title: 'Jump 1',
      start_time: moment(),
      end_time: moment().add(1, 'hour')
    },
    {
      id: 2,
      group: 3,
      title: 'Land Mission 1',
      start_time: moment().add(1, 'hour'),
      end_time: moment().add(2, 'hour')
    },
    {
      id: 3,
      group: 2,
      title: 'Jump 2',
      start_time: moment().add(3, 'hour'),
      end_time: moment().add(4, 'hour')
    },
    {
      id: 4,
      group: 4,
      title: 'Gas Leak',
      start_time: moment().add(3, 'hour'),
      end_time: moment().add(4, 'hour')
    },
    {
      id: 5,
      group: 1,
      title: 'Solar',
      start_time: moment(),
      end_time: moment().add(4, 'hour'),
      itemProps: {
        test: "Testing testing",
        onDoubleClick: () => { console.log("test") },
        style: {
          background: 'orange'
        }
      }
    },
    {
      id: 6,
      group: 1,
      title: 'Lunar',
      start_time: moment().add(4, 'hour'),
      end_time: moment().add(8, 'hour')
    }
  ];
  console.log(items);

  return (
    <div>
      <Timeline
        timeSteps={{
          second: 1,
          minute: 1,
          hour: 1,
          day: 1,
          month: 1,
          year: 1
        }}
        onItemSelect={(itemId, e, time) => {setEventInfo(items.find(item => item.id == itemId))}}
        maxZoom={5 * 86400 * 1000}
        groups={groups}
        items={items}
        defaultTimeStart={moment().add(-12, 'hour')}
        defaultTimeEnd={moment().add(12, 'hour')}
      />
      {(eventInfo === null) ? <div></div> :
        <div className='events'>
          <h1>{eventInfo.title}</h1>
          <div>{eventInfo.itemProps?.test}</div>
        </div>
      }
    </div>
  )
}


