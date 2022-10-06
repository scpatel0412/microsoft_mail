import axios from "axios";
import React, { useEffect, useState, useRef } from "react";

function InfiniteScroll() {
  const [scrollData, setscrollData] = useState([]);
  const scrollRef = useRef(null);
  const [Show, setShow] = useState(10);
  const [storeNum, setStoreNum] = useState(1);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/posts").then((res) => {
      if (res) {
        console.log("res", res.data.length);
        setscrollData(res.data);
        console.log("scrollData", scrollData?.length);
      }
    });
    // window.addEventListener("scroll", handleScroll);
  }, []);

  //   function handleScroll(event) {
  //     console.log("event", event);
  //     let scrollTop = event.srcElement.body.scrollTop,
  //       itemTranslate = Math.min(0, scrollTop / 3 - 60);
  //   }
  function getScroll(event) {
    console.log("event", event);
    if (event) {
      setTimeout(() => {
        setStoreNum(storeNum + 1);
        setShow(storeNum * 10);
        console.log("+i", Show);
      }, 5000);
      setLoading(true);
    }
  }
  return (
    <div>
      <div
        style={{ width: "500px", height: "400px", overflowY: "auto" }}
        onScroll={(e) => getScroll(e)}
        ref={scrollRef.current}
      >
        {scrollData?.slice(0, Show)?.map((i) => {
          return (
            <div>
              <h3>{i.title}</h3>
            </div>
          );
        })}
        <div>{loading === true ? "loading" : null}</div>
      </div>
    </div>
  );
}

export default InfiniteScroll;
