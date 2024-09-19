import React, { useEffect, useState } from "react";
import "./Vote.css";
import ImageList from "./ImageList";
import CountdownTimer from "./Countdown";
import { get, post } from "../../utilities";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { set } from "date-fns";

// Define how many images a user can vote for
const MAX_VOTES = 1;

const Vote: React.FC = () => {
  const [imagestwo, setImages] = useState<{ id: number; url: string; name: string }[]>([]);
  const [votes, setVotes] = useState<number[]>([]);
  const [prompt, setPrompt] = useState<string | null>(null);

  const fetchPrompt = async () => {
    try {
      const response = await fetch("/api/prompt");
      const result = await response.json();
      setPrompt(result.prompt);
    } catch (error) {
      console.error("Failed to fetch prompt:", error);
    }
  };

  useEffect(() => {
    fetchPrompt();
  }, []);
  let images: { id: number; url: string; name: string }[] = [];

  useEffect(() => {
    const loadImages = async () => {
      let curDate = fromZonedTime(
        set(new Date(), {
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        }),
        "America/New_York"
      );

      // const response = await fetch("/api/get-images?date=" + curDate);
      get("/api/get-images", { date: curDate })
        .then((result) => {
          const imagest = result.imagesWithSignedUrl;
          imagest.forEach((image) => {
            images = [...images, { id: image._id, url: image.signedUrl, name: image.name }];
          });
          return images;
        })
        .then((images) => {
          setImages(images);
        })
        .then(() => get("/api/userinfo"))
        .then((info) => {
          setVotes(info.votingFor === null ? [] : [info.votingFor]);
        })
        .catch((error) => {
          console.error("Failed to fetch images:", error);
        });
    };

    loadImages();
  }, []);

  // const handleVote = (imageId: number) => {
  //   if (votes.includes(imageId)) {
  //     setVotes(votes.filter((id) => id !== imageId)); // Remove vote
  //   } else if (votes.length < MAX_VOTES) {
  //     setVotes([...votes, imageId]); // Add vote
  //   }
  // };

  const handleVote = (imageId: number) => {
    if (!votes.includes(imageId)) {
      post("/api/add-vote", { imageId: imageId }).then(() => {
        setVotes([imageId]); // Add vote
      });
    }
  };

  return (
    <div className="app">
      <CountdownTimer />
      <h1 className="title">Vote for the best one!</h1>

      <div className="prompt-box">
        <h3>PROMPT: {prompt || "Loading ..."}</h3>
      </div>
      {/* <div id="image-gallery"></div> */}
      <ImageList images={imagestwo} votes={votes} onVote={handleVote} maxVotes={MAX_VOTES} />
      {/* <p>{`You can vote for up to ${MAX_VOTES} image.`}</p> */}
    </div>
  );
};

export default Vote;
