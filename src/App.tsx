import { useEffect, useState } from "react";
import "./App.css";
import { BusStopHeader, StopReport, StopTimeList } from "./components/StopTimeReport";

// HACK:  Yeah, I know that it looks like I'm exposing a app secret.
const kScriptId = "AKfycbzhVQD402fi91IlcT9tndtmAvspn2V6noTkh9465JOuUtUcPyoWjhvgkFuQcmC26tPQ3A";

// TODO: need something more maintainable
type Destination = "totsuka" | "ofuna";

function currentIndex(): number {
  const now = new Date();
  return (now.getHours() * 60) + now.getMinutes();
}

function getDestination(search: string) {
  return /ofuna/g.test(search.toLowerCase()) ? "ofuna" : "totsuka";
}

function generateUrl(dest: Destination, index: number) {
  const queryString = `?dest=${dest}&index=${index}`;
  return `https://script.google.com/macros/s/${kScriptId}/exec${queryString}`
}

function App() {

  const [isLoaded, setLoaded] = useState(false);
  const [data, setData] = useState<StopReport | null>(null);
  const [destination, setDestination] = useState<Destination>("totsuka");
  // eslint-disable-next-line
  const [timeIndex, setTimeIndex] = useState(currentIndex());

  useEffect(() => {
    if (isLoaded) {
      return;
    }
    const dest = getDestination(document.location.search);
    setDestination(dest);
    const url = generateUrl(dest, timeIndex);
    window
      .fetch(url)
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
  }, [isLoaded, timeIndex]);
  
  return (
    <div className="App" data-dest={destination}>
      <div className="stopTimeReport">
      {!isLoaded && <div className="loading">{"loading..."}</div>}
      {data && (
        <>
          <BusStopHeader headerData={data.header} />
          <StopTimeList stopTimes={data.times} index={timeIndex} />
        </>
      )}
      </div>
      <div id="modalMountPoint" />
    </div>
  );
}

export default App;
