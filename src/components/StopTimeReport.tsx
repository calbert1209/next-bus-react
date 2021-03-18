import { FC, useEffect, useState } from "react";
import { CurrentTime } from "./CurrentTime";

type StopTime = {
  index: number;
  hour: number;
  minute: number;
  label: number;
  note?: string;
};

type StopReportHeader = {
  busStop: string;
  dest: string;
  publish: string;
};

export type StopReport = {
  header: StopReportHeader;
  times: StopTime[];
};

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
  return (
    time.label === label && time.index > index && time.index <= index + 120
  );
};

type StopTimeQueryParams = {
  index: number;
  label: number;
};

const queryParams = (): StopTimeQueryParams => {
  const now = new Date();
  const index = now.getHours() * 60 + now.getMinutes();
  const label = getTodaysLabel(now.getDay());
  // const index = 504;
  // const label = 0;
  return { index, label };
};

export const BusStopHeader: FC<{ headerData: StopReportHeader }> = ({
  headerData: { busStop, dest },
}) => {
  return (
    <div className="header centerAlignedColumn">
      <div className="stopNameLabel">{busStop}</div>
      <div className="destinationDisplay">
        <div className="destinationLabel">{dest}</div>
        <SwapDestinationButton />
      </div>
      <CurrentTime />
    </div>
  );
};

export const StopTimeList: FC<{ fullList: StopTime[] }> = ({ fullList }) => {
  const params = queryParams();

  const times = fullList
    .filter(stopTimeQuery(params))
    .sort(byStopTimeIndexAscending)
    .slice(0, 4);
  if (times.length < 1) {
    console.warn("no times found");
  }

  // const modalMountPoint = document.getElementById("modalMountPoint");

  return (
    <div className="stopTimeList">
      {times.map((item, i) => {
        console.log(item);
        return (
          <div
            key={`${item.index}-${item.note}`}
            className="stopTimeRow"
            data-row={i}
            style={{
              fontSize: `${4 - i}em`,
            }}
          >
            <div className="hour">{item.hour}</div>
            <div className="colon">:</div>
            <div className="minuteAndNote">
              <div className="minute">{item.minute}</div>
              {item.note && (
                <div className="stopTimeNote">{` (${item.note})`}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

type Destination = "totsuka" | "ofuna";
type VoidFunc = () => void;

function containsOfuna(n: string) {
  return /ofuna/g.test(n);
}

const SwapDestinationButton: FC = () => {
  const [dest, setDest] = useState<Destination>(() => {
    const { search } = window.location;
    return containsOfuna(search) ? "ofuna" : "totsuka";
  });

  useEffect(() => {
    const nextSearch = `?dest=${dest}`;
    if (window.location.search !== nextSearch) {
      window.location.search = nextSearch;
    }
  }, [dest]);

  const onClick = () => {
    setDest((s) => (containsOfuna(s) ? "totsuka" : "ofuna"));
  };

  return <SwapIcon onClick={onClick} />;
};

const SwapIcon: FC<{ onClick?: VoidFunc }> = ({ onClick }) => {
  return (
    <div className="swapIcon" role="button" onClick={onClick}>
      <div className="swapArrow top">→</div>
      <div className="swapArrow bottom">←</div>
    </div>
  );
};
