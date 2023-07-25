import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
  getMovies,
  IGetMoviesResult,
  getTopRateMovies,
  IGetTopRateMoviesResult,
} from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

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

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Slider2 = styled.div`
  position: relative;
  top: +100px;
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

function Home() {
  interface IhoverObject {
    backdrop_path: string;
    title: string;
    overview: string;
  }

  const history = useHistory(); //url를 바꾸기위해서는 histroy obeject에 접근
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId"); //movies/:movieId<< 랑 맞는지 확인해줌, 그리고 useRouteMatch안에 movieId가 string이라고 알려줘야함
  const bigTopRateMovieMatch = useRouteMatch<{ movieId: string }>(
    "/topratemovies/:movieId"
  );
  const [hover, SetHover] = useState(false);
  const [hoverObject, SetHoverObject] = useState<IhoverObject>({
    backdrop_path: "",
    title: "",
    overview: "",
  });

  const { scrollY } = useScroll();
  const { data: moviesData, isLoading: isMoviesLoading } =
    useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
  const { data: onTopRateMoviesData, isLoading: isTopRateMoviesLoading } =
    useQuery<IGetTopRateMoviesResult>(
      ["topratemovies", "ontoprate"],
      getTopRateMovies
    );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [type, SetType] = useState(true);
  const incraseIndex = () => {
    if (moviesData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = moviesData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }

    if (onTopRateMoviesData) {
      if (leaving) return;
      toggleLeaving();
      const totalTopRateMovies = onTopRateMoviesData.results.length - 1;
      const maxIndex = Math.floor(totalTopRateMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const onBoxHovered = (movieId: number) => {
    SetHover(true);
    if (hover === true) {
      moviesData?.results.find((movie) => {
        if (movie.id === movieId) {
          // SetHoverImage(movie.backdrop_path);
          const dynamicObject: IhoverObject = {
            backdrop_path: "",
            title: "",
            overview: "",
          };
          dynamicObject.backdrop_path = movie.backdrop_path;
          dynamicObject.title = movie.title;
          dynamicObject.overview = movie.overview;

          SetHoverObject(dynamicObject);
        }
      });
    }
  };

  const onTopRateBoxClicked = (movieId: number) => {
    history.push(`/topratemovies/${movieId}`);
  };
  const onOverlayClick = () => history.push("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    moviesData?.results.find(
      (movie) => movie.id === +bigMovieMatch.params.movieId
    );
  const clickeTopRateMovie =
    bigTopRateMovieMatch?.params.movieId &&
    onTopRateMoviesData?.results.find(
      (topratemovies) =>
        topratemovies.id === +bigTopRateMovieMatch.params.movieId
    );

  const TypecheckClick = (type: string) => {
    if (type === "TV") {
      SetType((prev) => !prev);
    } else if (type === "MOVIE") {
      SetType((prev) => !prev);
    }
  };

  return (
    <Wrapper>
      {isMoviesLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={incraseIndex}
            bgPhoto={
              hover
                ? makeImagePath(hoverObject.backdrop_path)
                : makeImagePath(moviesData?.results[0].backdrop_path || "")
            }
          >
            <Title>
              {hover ? hoverObject.title : moviesData?.results[0].title}
            </Title>
            <Overview>
              {hover ? hoverObject.overview : moviesData?.results[0].overview}
            </Overview>
          </Banner>
          <Slider>
            <Type onClick={() => TypecheckClick("MOVIE")}>Movies</Type>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {moviesData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""} //layoutId는 string이여야 하므로 movie.id+""<< 이렇게 설정
                      key={movie.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(movie.id)}
                      onHoverStart={() => onBoxHovered(movie.id)}
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
          <Slider2>
            <Type onClick={() => TypecheckClick("TV")}>Top Rate Movies</Type>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row2
                variants={rowVariants2}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {onTopRateMoviesData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((topratemovie) => (
                    <Box2
                      layoutId={topratemovie.id + ""} //layoutId는 string이여야 하므로 movie.id+""<< 이렇게 설정
                      key={topratemovie.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onTopRateBoxClicked(topratemovie.id)}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(
                        topratemovie.backdrop_path,
                        "w500"
                      )}
                    >
                      <Info variants={infoVariants}>
                        <h4>{topratemovie.title}</h4>
                      </Info>
                    </Box2>
                  ))}
              </Row2>
            </AnimatePresence>
          </Slider2>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
            {bigTopRateMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigTopRateMovieMatch.params.movieId}
                >
                  {clickeTopRateMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickeTopRateMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickeTopRateMovie.title}</BigTitle>
                      <BigOverview>{clickeTopRateMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
