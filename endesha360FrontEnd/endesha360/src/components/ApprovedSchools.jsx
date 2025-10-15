import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ApprovedSchools = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/schools/approved');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setSchools(data || []);
      } catch (err) {
        setError('Failed to load schools');
        console.error('Error fetching approved schools:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchools();
  }, []);

  if (loading) return <div>Loading approved schools...</div>;
  if (error) return <div>{error}</div>;

  // Carousel settings
  const settings = {
    dots: true,
    infinite: schools.length > 1,
    speed: 500,
    slidesToShow: schools.length === 2 ? 1 : Math.min(schools.length, 3),
    slidesToScroll: 1,
    arrows: schools.length > 1,
    autoplay: schools.length > 1,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: schools.length === 2 ? 1 : Math.min(schools.length, 2),
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-[#00712D] mb-8 text-center">
          Schools Using Our Platform
        </h2>
        {Array.isArray(schools) && schools.length > 0 ? (
          <>
            <Slider {...settings}>
              {schools.map((school) => (
                <div key={school.id}>
                  <div className="bg-white p-6 rounded-xl shadow border border-[#D5ED9F] flex flex-col items-center mx-4">
                    {/* Optionally add logo: <img src={school.logoUrl} alt={school.name} className="w-16 h-16 mb-4 rounded-full" /> */}
                    <h3 className="text-lg font-semibold text-[#00712D] mb-2">{school.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{school.city}, {school.country}</p>
                    <p className="text-gray-500 text-xs mb-2 text-center">{school.description}</p>
                    <button
                      className="text-[#FF9100] text-sm font-medium mt-2 hover:text-[#e6820e] transition-colors"
                      onClick={() => navigate(`/schools/${school.id}`)}
                    >
                      Explore more →
                    </button>
                  </div>
                </div>
              ))}
            </Slider>
          </>
        ) : (
          <div className="text-center text-gray-500">No approved schools found.</div>
        )}
      </div>
    </section>
  );
};

export default ApprovedSchools;
