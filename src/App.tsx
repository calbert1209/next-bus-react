import { useEffect, useState } from "react";
import "./App.css";
import { BusStopHeader, StopReport, StopTimeList } from "./components/StopTimeReport";

// HACK:  Yeah, I know that it looks like I'm exposing an app secret.
// The same script is publicly accessible anyway.
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
  const { href } = window.document.location;
  const [isLoaded, setLoaded] = useState(false);
  const [data, setData] = useState<StopReport | null>(null);
  const [points, setPoints] = useState<RoutePoints>(() =>
    getRoutePointsFromUrl(href)
  );
  // eslint-disable-next-line
  const [timeIndex, setTimeIndex] = useState(currentIndex());

  useEffect(() => {
    setPoints(getRoutePointsFromUrl(href));
  }, [href]);

  useEffect(() => {
    const nextSearch = points.search;
    if (window.location.search !== nextSearch) {
      window.location.search = nextSearch;
    }
  }, [points]);

  useEffect(() => {
    if (isLoaded) {
      return;
    }
    const points = getRoutePointsFromUrl(document.location.href);
    setPoints(points);
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

  const swapDirection = () => {
    setPoints(s => routePoints(s.end, s.start))
  }

  const swapRoute = () => {
    setPoints(s => {
      if (s.start === "ofuna") {
        return routePoints("totsuka", s.end);
      } else if (s.start === "totsuka") {
        return routePoints("ofuna", s.end);
      } else {
        const nextEnd = s.end === "ofuna" ? "totsuka" : "ofuna";
        return routePoints(s.start, nextEnd);
      }
    });
  }

  const {start, end} = points;
  const destination = (start === "ofuna" || end === "ofuna") ? "ofuna" : "totsuka";
  return (
    <div className="App" data-dest={destination}>
      <div className="stopTimeReport">
      {!isLoaded && <div className="loading">{"loading..."}</div>}
      {data && (
        <>
          <BusStopHeader headerData={data.header} swapDirection={swapDirection} swapRoute={swapRoute} />
          <StopTimeList stopTimes={data.times} index={timeIndex} />
        </>
      )}
      </div>
      <div id="modalMountPoint" />
    </div>
  );
}

export default App;
