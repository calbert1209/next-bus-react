import { FC, useEffect, useState } from "react";

type StopTime = {
  index: number;
  hour: number;
  minute: number;
  label: number;
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
  const [data, setData] = useState<StopTime[]>([]);

  useEffect(() => {
    if (isLoaded) {
      return;
    }
    window
      .fetch(kUrl)
      .then((resp) => {
        return resp.json();
      })
      .then((json: StopTime[]) => {
        const params = queryParams();
        return json
          .filter(stopTimeQuery(params))
          .sort(byStopTimeIndexAscending);
      })
      .then((stopTimes) => {
        setLoaded(true);
        setData(stopTimes);
      });
  }, [isLoaded]);

  return (
    <>
      {isLoaded ?? <div className="loading">{"loading..."}</div>}
      {data.length > 0 && (
        <div>
          {data.map((item) => {
            return (
              <div key={item.index}>
                <span>{item.hour}</span>
                <span>:</span>
                <span>{item.minute}</span>
                <br></br>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
