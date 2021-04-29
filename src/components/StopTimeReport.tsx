import { FC } from "react";
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

const doubleDigitString = (x: number) => `${x < 10 ? "0" : ""}${x}`;

export const BusStopHeader: FC<{
  headerData: StopReportHeader;
  swapDirection: () => void;
  swapRoute: () => void;
}> = ({ headerData: { busStop, dest }, swapDirection, swapRoute }) => {
  return (
    <div className="header centerAlignedColumn">
      <div className="stopNameLabel" role="button" onClick={swapRoute}>
        {busStop}
      </div>
      <div className="destinationDisplay">
        <div className="destinationLabel">{dest}</div>
        <SwapIcon rotate={true} colored={true} onClick={swapDirection} />
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
            <div className="colon">
              <div>{":"}</div>
            </div>
            <div className="minute">{doubleDigitString(item.minute)}</div>
            {item.note && (
              <div className="stopTimeNote">
                <div>{`(${item.note})`}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const SwapIcon: FC<{
  rotate?: boolean;
  colored?: boolean;
  onClick?: () => void;
}> = ({ rotate = false, colored = false, onClick }) => {
  let cNames = ["swapIcon"];
  if (rotate) {
    cNames.push("rotate90");
  }
  if (colored) {
    cNames.push("coloredArrow");
  }

  const className = cNames.join(" ");
  return (
    <div className={className} role="button" onClick={onClick}>
      <div className="swapArrow top">→</div>
      <div className="swapArrow bottom">←</div>
    </div>
  );
};
