import { useState } from "react";
import { get } from "http";
import styled from "styled-components";
import { useLocation } from "react-router";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import {
  getSearch,
  getSearchMovies,
  getSearchTV,
  IGetMoviesResult,
  IGetOnAirTVResult,
  IGetPersonResult,
  getSearchPerson,
} from "../api";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
  height: 160vh;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Slider = styled.div`
  position: relative;
  top: 200px;
`;

const Slider2 = styled.div`
  position: relative;
  top: 400px;
`;
const Slider3 = styled.div`
  position: relative;
  top: 600px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Row2 = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
const Row3 = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;

  cursor: pointer;
  font-size: 66px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Box2 = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;

  cursor: pointer;
  font-size: 66px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Box3 = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;

  cursor: pointer;
  font-size: 66px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const Type = styled(motion.div)`
  color: linear-gradient(rgba(0, 0, 0, 0), #77c413);
  cursor: pointer;
  font-size: 20px;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const rowVariants2 = {
  hidden: {
    x: -window.outerWidth - 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: window.outerWidth + 5,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,

      duaration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

function Search() {
  const location = useLocation(); //locaiton을 하면 지금 있는 곳에 정보를 얻을수 있음
  const keyword = new URLSearchParams(location.search).get("keyword") || "";
  const [uri, setUri] = useState(keyword);
  const history = useHistory();
  const { scrollY } = useScroll();
  const onOverlayClick = () => {
    setBigMovieflag(false);
    setBigTvflag(false);
    setBigPersonflag(false);
    // SetFlagId("");
  };

  const [movieindex, setMovieIndex] = useState(0);
  const [movieleaving, setMovieLeaving] = useState(false);
  const toggleMovieLeaving = () => setMovieLeaving((prev) => !prev);
  const [tvindex, setTvIndex] = useState(0);
  const [tvleaving, setTvLeaving] = useState(false);
  const toggleTvLeaving = () => setTvLeaving((prev) => !prev);
  const [personindex, setPersonIndex] = useState(0);
  const [personleaving, setPersonLeaving] = useState(false);
  const togglePersonLeaving = () => setPersonLeaving((prev) => !prev);
  const [bigmovieflag, setBigMovieflag] = useState(false);
  const [bigtvflag, setBigTvflag] = useState(false);
  const [bigpersonflag, setBigPersonflag] = useState(false);
  const [flagId, SetFlagId] = useState("");

  const { data: movieData, isLoading: ismovieLoading } =
    useQuery<IGetMoviesResult>(["moviesearch", "moviesearching"], () =>
      getSearchMovies(keyword)
    );
  const { data: tvData, isLoading: istvLoading } = useQuery<IGetOnAirTVResult>(
    ["tvsearch", "tvsearching"],
    () => getSearchTV(keyword)
  );

  const { data: personData, isLoading: ispersonLoading } =
    useQuery<IGetPersonResult>(["personsearch", "personsearching"], () =>
      getSearchPerson(keyword)
    );

  const incraseMovieIndex = () => {
    if (movieData) {
      if (movieleaving) return;
      toggleMovieLeaving();
      const totalMovies = movieData.results.length;
      console.log(totalMovies);
      const maxIndex = Math.floor(totalMovies / offset);
      setMovieIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const incraseTvIndex = () => {
    if (tvData) {
      if (tvleaving) return;
      toggleTvLeaving();
      const totalTV = tvData.results.length;
      const maxIndex = Math.floor(totalTV / offset);
      setTvIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const incrasePersonIndex = () => {
    if (personData) {
      if (personleaving) return;
      togglePersonLeaving();
      const totalPerson = personData.results.length;
      const maxIndex = Math.floor(totalPerson / offset);
      setPersonIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const onMovieBoxClicked = (Id: string) => {
    // history.push(`/search/keyword/${uri}/${Id}`);
    setBigMovieflag(true);
    SetFlagId(Id);
  };

  const onTvBoxClicked = (Id: string) => {
    // history.push(`/search/keyword/${uri}/${Id}`);
    setBigTvflag(true);
    SetFlagId(Id);
  };
  const onPersonBoxClicked = (Id: string) => {
    // history.push(`/search/keyword/${uri}/${Id}`);
    setBigPersonflag(true);
    SetFlagId(Id);
  };

  const searchForMovieImage = (flagId: string) => {
    const data = movieData?.results.find((movie) => movie.id + "" === flagId);
    if (data) {
      return data?.backdrop_path;
    } else {
      return "";
    }
  };

  const searchForTvImage = (flagId: string) => {
    const data = tvData?.results.find((tv) => tv.id + "" === flagId);
    if (data) {
      return data?.backdrop_path;
    } else {
      return "";
    }
  };

  const searchForPersonImage = (flagId: string) => {
    const data = personData?.results.find(
      (person) => person.id + "" === flagId
    );
    if (data) {
      return data?.profile_path;
    } else {
      return "";
    }
  };

  const bigMovieMatch = useRouteMatch<{ keyword: string; Id: string }>(
    `/search/keyword/:uri/:Id`
  );

  const clickedMovie = movieData?.results.find((movie) => movie.id === +flagId);
  const clickedTv = tvData?.results.find((tv) => tv.id === +flagId);
  const clickedPerson = personData?.results.find(
    (person) => person.id === +flagId
  );

  return (
    <Wrapper>
      <>
        {ismovieLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          <Slider>
            <Type onClick={incraseMovieIndex}>MOVIE</Type>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleMovieLeaving}
            >
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={movieindex}
              >
                {movieData?.results
                  .slice(offset * movieindex, offset * movieindex + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""} //layoutId는 string이여야 하므로 movie.id+""<< 이렇게 설정
                      key={movie.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onMovieBoxClicked(movie.id + "")}
                      // onHoverStart={() => onBoxHovered(movie.id)}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        )}
        {istvLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          <Slider2>
            <Type onClick={incraseTvIndex}>TV</Type>
            <AnimatePresence initial={false} onExitComplete={toggleTvLeaving}>
              <Row2
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={tvindex}
              >
                {tvData?.results
                  .slice(offset * tvindex, offset * tvindex + offset)
                  .map((tv) => (
                    <Box2
                      layoutId={tv.id + ""} //layoutId는 string이여야 하므로 movie.id+""<< 이렇게 설정
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onTvBoxClicked(tv.id + "")}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box2>
                  ))}
              </Row2>
            </AnimatePresence>
          </Slider2>
        )}
        {ispersonLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          <Slider3>
            <Type onClick={incrasePersonIndex}>PERSON</Type>
            <AnimatePresence
              initial={false}
              onExitComplete={togglePersonLeaving}
            >
              <Row3
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={personindex}
              >
                {personData?.results

                  .slice(offset * personindex, offset * personindex + offset)
                  .map((person) => (
                    <Box3
                      layoutId={person.id + ""} //layoutId는 string이여야 하므로 movie.id+""<< 이렇게 설정
                      key={person.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onPersonBoxClicked(person.id + "")}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(person.profile_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{person.name}</h4>
                      </Info>
                    </Box3>
                  ))}
              </Row3>
            </AnimatePresence>
          </Slider3>
        )}
        <AnimatePresence>
          {bigmovieflag ? (
            <>
              <Overlay
                onClick={onOverlayClick}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <BigMovie style={{ top: scrollY.get() + 100 }} layoutId={flagId}>
                {clickedMovie && (
                  <>
                    <BigCover
                      style={{
                        backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                          searchForMovieImage(flagId),
                          "w500"
                        )})`,
                      }}
                    />
                    {/* <BigTitle>{clickedMovie.title}</BigTitle>
                    <BigOverview>{clickedMovie.overview}</BigOverview> */}
                  </>
                )}
              </BigMovie>
            </>
          ) : null}
          {bigtvflag ? (
            <>
              <Overlay
                onClick={onOverlayClick}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <BigMovie style={{ top: scrollY.get() + 100 }} layoutId={flagId}>
                {clickedTv && (
                  <>
                    <BigCover
                      style={{
                        backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                          searchForTvImage(flagId),
                          "w500"
                        )})`,
                      }}
                    />
                    {/* <BigTitle>{clickedMovie.title}</BigTitle>
                    <BigOverview>{clickedMovie.overview}</BigOverview> */}
                  </>
                )}
              </BigMovie>
            </>
          ) : null}
          {bigpersonflag ? (
            <>
              <Overlay
                onClick={onOverlayClick}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <BigMovie style={{ top: scrollY.get() + 100 }} layoutId={flagId}>
                {clickedPerson && (
                  <>
                    <BigCover
                      style={{
                        backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                          searchForPersonImage(flagId),
                          "w500"
                        )})`,
                      }}
                    />
                    {/* <BigTitle>{clickedMovie.title}</BigTitle>
                    <BigOverview>{clickedMovie.overview}</BigOverview> */}
                  </>
                )}
              </BigMovie>
            </>
          ) : null}
        </AnimatePresence>
      </>
    </Wrapper>
  );
}
export default Search;
