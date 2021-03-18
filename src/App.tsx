import { useEffect, useState } from "react";
import "./App.css";
import { BusStopHeader, StopReport, StopTimeList } from "./components/StopTimeReport";

const { search } = window.location;
const queryString = search.length > 0 ? search : "?dest=Totsuka";

const kUrl =
  "https://script.google.com/macros/s/" +
  "AKfycbwdm0nmrVJdptlecVeL0VrGfLJz2DyJ65qv-aFcixFtB5-kyJ0rfJLE7yBShRlM0B14tg/exec" +
  `${queryString}`;


function App() {

  const [isLoaded, setLoaded] = useState(false);
  const [data, setData] = useState<StopReport | null>(null);

  useEffect(() => {
    if (isLoaded) {
      return;
    }
    window
      .fetch(kUrl)
      .then((resp) => {
        return resp.text();
      })
      .then(JSON.parse)
      .then((report: StopReport) => {
        const { header, times } = report;

        return { header, times };
      })
      .then((stopTimes) => {
        setLoaded(true);
        setData(stopTimes);
      });
  }, [isLoaded]);

  const [_unused, rawDest] = queryString.split("=");
  const dest = rawDest.toLowerCase() ?? "totsuka";
  
  return (
    <div className="App" data-dest={dest}>
      <div className="stopTimeReport">
      {!isLoaded && <div className="loading">{"loading..."}</div>}
      {data && (
        <>
          <BusStopHeader headerData={data.header} />
          <StopTimeList fullList={data.times} />
        </>
      )}
      </div>
      <div id="modalMountPoint" />
    </div>
  );
}

export default App;
