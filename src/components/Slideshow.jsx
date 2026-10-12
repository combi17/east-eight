import React, { useEffect, useState } from "react";
import "./Slideshow.css";
import birou1 from "../assets/birou.jpg";
import birou2 from "../assets/birou2.jpg";
import birou3 from "../assets/birou3.jpg";
import apart1 from "../assets/apart1.jpg";
import apart2 from "../assets/apart2.jpg";
import house1 from "../assets/house1.webp";
import SearchCard from "./SearchCard.jsx";

const images = [birou1, birou2, birou3, apart1, apart2, house1];

const Slideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="slideshow">
      {images.map((img, index) => (
        <div
          key={index}
          className={`slide ${index === currentIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      <div className="gradient-overlay"></div>

      <div className="slideshow-content">
        <SearchCard/>
      </div>
    </section>
  );
};

export default Slideshow;
