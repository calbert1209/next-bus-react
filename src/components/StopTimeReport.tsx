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

const byStopTimeIndexAscending = (a: StopTime, b: StopTime): number =>
  a.index - b.index;

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

export const StopTimeList: FC<{ stopTimes: StopTime[]; index: number }> = ({
  stopTimes,
  index,
}) => {
  const times = stopTimes
    .filter((time) => time.index >= index)
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
