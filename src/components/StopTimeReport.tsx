import { FC, useEffect, useState } from "react";

type StopTime = {
  index: number;
  hour: number;
  minute: number;
  label: number;
};

type StopReport = {
  header: {
    name: string;
    dest: string;
    publish: string;
  };
  times: StopTime[];
};

const kUrl =
  "https://script.google.com/macros/s/AKfycbwdm0nmrVJdptlecVeL0VrGfLJz2DyJ65qv-aFcixFtB5-kyJ0rfJLE7yBShRlM0B14tg/exec";

function getTodaysLabel(dayofWeek: number) {
  if (dayofWeek > 0 && dayofWeek < 6) {
    return 0;
  } else if (dayofWeek === 6) {
    return 1;
  } else if (dayofWeek === 0) {
    return 2;
  } else {
    throw new Error("invalid arg: dayOfWeek must be between 0 ~ 6");
  }
}

const byStopTimeIndexAscending = (a: StopTime, b: StopTime): number =>
  a.index - b.index;

const stopTimeQuery = ({ index, label }: StopTimeQueryParams) => (
  time: StopTime
) => {
  return time.label === label && time.index > index && time.index <= index + 60;
};

type StopTimeQueryParams = {
  index: number;
  label: number;
};

const queryParams = (): StopTimeQueryParams => {
  const now = new Date();
  const index = now.getHours() * 60 + now.getMinutes();
  const label = getTodaysLabel(now.getDay());
  return { index, label };
};

export const StopTimeReport: FC = () => {
  const [isLoaded, setLoaded] = useState(false);
  const [data, setData] = useState<StopReport | null>(null);

  useEffect(() => {
    if (isLoaded) {
      return;
    }
    window
      .fetch(kUrl)
      .then((resp) => {
        return resp.json();
      })
      .then(({ header, times }: StopReport) => {
        const params = queryParams();

        const filteredTimes = times
          .filter(stopTimeQuery(params))
          .sort(byStopTimeIndexAscending);
        return { header, times: filteredTimes };
      })
      .then((stopTimes) => {
        setLoaded(true);
        setData(stopTimes);
      });
  }, [isLoaded]);

  return (
    <div>
      {!isLoaded && <div className="loading">{"loading..."}</div>}
      {data && (
        <div className="header centerAlignedColumn">
          <div className="stopNameLabel">{data.header.name}</div>
          <div className="destinationLabel">{data.header.dest}</div>
        </div>
      )}
      {data && data.times.length > 0 && (
        <div className="stopTimeList centerAlignedColumn">
          {data.times.map((item, i) => {
            console.log(item);
            return (
              <div
                key={item.index}
                style={{
                  fontSize: `${64 - 12.8 * i}px`,
                }}
                className={i === 0 ? "firstTime" : "laterTime"}
              >
                <span>{item.hour}</span>
                <span>:</span>
                <span>{item.minute}</span>
                <br></br>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
