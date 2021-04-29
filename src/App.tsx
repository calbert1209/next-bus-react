import { useEffect, useState } from "react";
import "./App.css";
import { BusStopHeader, StopReport, StopTimeList } from "./components/StopTimeReport";

// HACK:  Yeah, I know that it looks like I'm exposing a app secret.
// The same script is publicly accessible anyway.
// const kScriptId = "AKfycbzhVQD402fi91IlcT9tndtmAvspn2V6noTkh9465JOuUtUcPyoWjhvgkFuQcmC26tPQ3A";
const kScriptId = "AKfycby9xxDzbgVfk7bXDmzyqaPN4heFGo6qQb3kXaNgI5T-efrJGKYkWjbEGh9anUJn-o3zaA";

function currentIndex(): number {
  const now = new Date();
  return (now.getHours() * 60) + now.getMinutes();
}

export type RoutePoints = {
  start: string;
  end: string;
  search: string;
}

export function routePoints(start: string, end: string): RoutePoints {
  return {
    start,
    end,
    search: `?start=${start}&end=${end}`
  }
}

export function getRoutePointsFromUrl(url: string): RoutePoints {
  const params = new URL(url).searchParams;
  const start = params.get("start") ?? "kanai";
  const end = params.get("end") ?? params.get("dest") ?? "totsuka";
  return routePoints(start, end);
}

function generateUrl({start, end}: RoutePoints, index: number) {
  const queryString = `?start=${start}&end=${end}&index=${index}`;
  return `https://script.google.com/macros/s/${kScriptId}/exec${queryString}`
}

function App() {

  const [isLoaded, setLoaded] = useState(false);
  const [data, setData] = useState<StopReport | null>(null);
  const [destination, setDestination] = useState<string>("totsuka");
  // eslint-disable-next-line
  const [timeIndex, setTimeIndex] = useState(currentIndex());

  useEffect(() => {
    if (isLoaded) {
      return;
    }
    const points = getRoutePointsFromUrl(document.location.href);
    setDestination(points.end);
    const url = generateUrl(points, timeIndex);
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
