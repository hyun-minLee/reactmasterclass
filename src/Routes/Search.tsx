import { get } from "http";
import { useLocation } from "react-router";

function Search() {
  const location = useLocation(); //locaiton을 하면 지금 있는 곳에 정보를 얻을수 있음
  console.log("location", location);
  const keyword = new URLSearchParams(location.search).get("keyword");

  return null;
}
export default Search;
